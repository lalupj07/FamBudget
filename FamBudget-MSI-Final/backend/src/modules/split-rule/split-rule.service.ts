import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SplitRule, SplitRuleType } from '../../entities/split-rule.entity';
import { Envelope } from '../../entities/envelope.entity';
import { CreateSplitRuleDto } from './dto/create-split-rule.dto';
import { ApplySplitRuleDto } from './dto/apply-split-rule.dto';

@Injectable()
export class SplitRuleService {
  constructor(
    @InjectRepository(SplitRule)
    private splitRuleRepository: Repository<SplitRule>,
    @InjectRepository(Envelope)
    private envelopeRepository: Repository<Envelope>,
  ) {}

  async findAll(householdId: string): Promise<SplitRule[]> {
    return this.splitRuleRepository.find({
      where: { householdId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<SplitRule> {
    const rule = await this.splitRuleRepository.findOne({ where: { id } });
    if (!rule) {
      throw new NotFoundException('Split rule not found');
    }
    return rule;
  }

  async getDefaultRule(householdId: string): Promise<SplitRule | null> {
    return this.splitRuleRepository.findOne({
      where: { householdId, isDefault: true, isActive: true },
    });
  }

  async create(
    householdId: string,
    createSplitRuleDto: CreateSplitRuleDto,
  ): Promise<SplitRule> {
    const rule = this.splitRuleRepository.create({
      ...createSplitRuleDto,
      householdId,
    });
    return this.splitRuleRepository.save(rule);
  }

  async update(id: string, updateData: Partial<SplitRule>): Promise<SplitRule> {
    await this.splitRuleRepository.update(id, updateData);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.splitRuleRepository.update(id, { isActive: false });
  }

  async setAsDefault(householdId: string, ruleId: string): Promise<SplitRule> {
    // Unset current default
    await this.splitRuleRepository.update(
      { householdId, isDefault: true },
      { isDefault: false },
    );

    // Set new default
    await this.splitRuleRepository.update(ruleId, { isDefault: true });
    return this.findOne(ruleId);
  }

  /**
   * Apply a split rule to an amount (e.g., expense splitting)
   */
  async applySplitRule(
    householdId: string,
    applySplitRuleDto: ApplySplitRuleDto,
  ): Promise<any> {
    const { amount, splitRuleId, memberIds } = applySplitRuleDto;

    const rule = splitRuleId
      ? await this.findOne(splitRuleId)
      : await this.getDefaultRule(householdId);

    if (!rule) {
      throw new NotFoundException('No split rule found');
    }

    const splits = this.calculateSplit(rule, amount, memberIds);

    return {
      rule,
      totalAmount: amount,
      splits,
    };
  }

  /**
   * Split income across envelopes based on percentages
   */
  async splitIncome(
    householdId: string,
    incomeAmount: number,
    splitRuleId?: string,
  ): Promise<any> {
    // Get envelopes
    const envelopes = await this.envelopeRepository.find({
      where: { householdId, isActive: true },
      order: { sortOrder: 'ASC' },
    });

    if (envelopes.length === 0) {
      throw new NotFoundException('No envelopes found. Create envelopes first.');
    }

    // Calculate allocation for each envelope
    const allocations = envelopes.map((envelope) => {
      const allocated = (incomeAmount * Number(envelope.percentage)) / 100;
      return {
        envelopeId: envelope.id,
        envelopeName: envelope.name,
        percentage: Number(envelope.percentage),
        allocatedAmount: allocated,
        currentAllocated: Number(envelope.allocatedAmount),
        newAllocated: Number(envelope.allocatedAmount) + allocated,
      };
    });

    const totalAllocated = allocations.reduce(
      (sum, a) => sum + a.allocatedAmount,
      0,
    );

    return {
      incomeAmount,
      totalAllocated,
      remaining: incomeAmount - totalAllocated,
      allocations,
    };
  }

  /**
   * Apply income split to envelopes (actually update the database)
   */
  async applyIncomeSplit(householdId: string, incomeAmount: number): Promise<void> {
    const envelopes = await this.envelopeRepository.find({
      where: { householdId, isActive: true },
    });

    for (const envelope of envelopes) {
      const allocated = (incomeAmount * Number(envelope.percentage)) / 100;
      envelope.allocatedAmount = Number(envelope.allocatedAmount) + allocated;
      await this.envelopeRepository.save(envelope);
    }
  }

  /**
   * Calculate how to split an amount based on a rule
   */
  private calculateSplit(
    rule: SplitRule,
    amount: number,
    memberIds?: string[],
  ): any[] {
    switch (rule.type) {
      case SplitRuleType.PERCENTAGE:
        return this.calculatePercentageSplit(rule.formula, amount, memberIds);

      case SplitRuleType.FIXED_AMOUNT:
        return this.calculateFixedSplit(rule.formula, amount, memberIds);

      case SplitRuleType.RATIO:
        return this.calculateRatioSplit(rule.formula, amount, memberIds);

      case SplitRuleType.CUSTOM:
        return this.calculateCustomSplit(rule.formula, amount, memberIds);

      default:
        // Equal split by default
        return this.calculateEqualSplit(amount, memberIds);
    }
  }

  private calculatePercentageSplit(
    formula: any,
    amount: number,
    memberIds?: string[],
  ): any[] {
    // formula: { "member1": 50, "member2": 30, "member3": 20 }
    const splits = [];

    for (const [memberId, percentage] of Object.entries(formula)) {
      if (!memberIds || memberIds.includes(memberId)) {
        splits.push({
          memberId,
          percentage: Number(percentage),
          amount: (amount * Number(percentage)) / 100,
        });
      }
    }

    return splits;
  }

  private calculateFixedSplit(
    formula: any,
    amount: number,
    memberIds?: string[],
  ): any[] {
    // formula: { "member1": 100, "member2": 50 }
    const splits = [];
    let totalFixed = 0;

    for (const [memberId, fixedAmount] of Object.entries(formula)) {
      if (!memberIds || memberIds.includes(memberId)) {
        splits.push({
          memberId,
          amount: Number(fixedAmount),
        });
        totalFixed += Number(fixedAmount);
      }
    }

    // Remaining split equally
    const remaining = amount - totalFixed;
    if (remaining > 0 && splits.length > 0) {
      const equalShare = remaining / splits.length;
      splits.forEach((split) => {
        split.amount += equalShare;
      });
    }

    return splits;
  }

  private calculateRatioSplit(
    formula: any,
    amount: number,
    memberIds?: string[],
  ): any[] {
    // formula: { "member1": 3, "member2": 2, "member3": 1 }
    const splits = [];
    let totalRatio = 0;

    for (const [memberId, ratio] of Object.entries(formula)) {
      if (!memberIds || memberIds.includes(memberId)) {
        totalRatio += Number(ratio);
      }
    }

    for (const [memberId, ratio] of Object.entries(formula)) {
      if (!memberIds || memberIds.includes(memberId)) {
        splits.push({
          memberId,
          ratio: Number(ratio),
          amount: (amount * Number(ratio)) / totalRatio,
        });
      }
    }

    return splits;
  }

  private calculateCustomSplit(
    formula: any,
    amount: number,
    memberIds?: string[],
  ): any[] {
    // Custom formula evaluation (could be expanded)
    return this.calculateEqualSplit(amount, memberIds);
  }

  private calculateEqualSplit(amount: number, memberIds?: string[]): any[] {
    if (!memberIds || memberIds.length === 0) {
      return [{ amount }];
    }

    const perPerson = amount / memberIds.length;
    return memberIds.map((memberId) => ({
      memberId,
      amount: perPerson,
    }));
  }

  /**
   * Create default income split rule for a household
   */
  async createDefaultIncomeSplitRule(householdId: string): Promise<SplitRule> {
    const rule = this.splitRuleRepository.create({
      name: 'Default Income Split',
      type: SplitRuleType.PERCENTAGE,
      householdId,
      formula: {
        household: 40,
        bills: 20,
        groceries: 15,
        personal: 15,
        savings: 10,
      },
      isDefault: true,
      isActive: true,
    });

    return this.splitRuleRepository.save(rule);
  }
}

