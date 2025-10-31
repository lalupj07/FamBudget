import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Household } from '../../entities/household.entity';
import { Member } from '../../entities/member.entity';

@Injectable()
export class HouseholdService {
  constructor(
    @InjectRepository(Household)
    private householdRepository: Repository<Household>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async findOne(id: string): Promise<Household> {
    const household = await this.householdRepository.findOne({
      where: { id },
      relations: ['members', 'accounts', 'envelopes'],
    });

    if (!household) {
      throw new NotFoundException('Household not found');
    }

    return household;
  }

  async update(id: string, updateData: Partial<Household>): Promise<Household> {
    await this.householdRepository.update(id, updateData);
    return this.findOne(id);
  }

  async getMembers(householdId: string): Promise<Member[]> {
    return this.memberRepository.find({
      where: { householdId },
      relations: ['incomes'],
    });
  }

  async getDashboard(householdId: string) {
    const household = await this.findOne(householdId);
    
    // Calculate combined balance from all accounts
    const totalBalance = household.accounts?.reduce(
      (sum, account) => sum + Number(account.balance),
      0,
    ) || 0;

    // Calculate total allocated budget
    const totalBudget = household.envelopes?.reduce(
      (sum, envelope) => sum + Number(envelope.allocatedAmount),
      0,
    ) || 0;

    // Calculate total spent
    const totalSpent = household.envelopes?.reduce(
      (sum, envelope) => sum + Number(envelope.spentAmount),
      0,
    ) || 0;

    return {
      household,
      totalBalance,
      totalBudget,
      totalSpent,
      budgetRemaining: totalBudget - totalSpent,
      members: household.members,
      accounts: household.accounts,
      envelopes: household.envelopes,
    };
  }
}

