import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Envelope, EnvelopeCategory } from '../../entities/envelope.entity';
import { CreateEnvelopeDto } from './dto/create-envelope.dto';

@Injectable()
export class EnvelopeService {
  constructor(
    @InjectRepository(Envelope)
    private envelopeRepository: Repository<Envelope>,
  ) {}

  async findAll(householdId: string): Promise<Envelope[]> {
    return this.envelopeRepository.find({
      where: { householdId, isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async create(
    householdId: string,
    createEnvelopeDto: CreateEnvelopeDto,
  ): Promise<Envelope> {
    const envelope = this.envelopeRepository.create({
      ...createEnvelopeDto,
      householdId,
    });
    return this.envelopeRepository.save(envelope);
  }

  async update(id: string, updateData: Partial<Envelope>): Promise<Envelope> {
    await this.envelopeRepository.update(id, updateData);
    return this.envelopeRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.envelopeRepository.update(id, { isActive: false });
  }

  async createDefaultEnvelopes(householdId: string): Promise<Envelope[]> {
    const defaultEnvelopes = [
      {
        name: 'Household',
        category: EnvelopeCategory.HOUSEHOLD,
        percentage: 40,
        colorHex: '#1565C0',
        sortOrder: 1,
      },
      {
        name: 'Bills',
        category: EnvelopeCategory.BILLS,
        percentage: 20,
        colorHex: '#FF9800',
        sortOrder: 2,
      },
      {
        name: 'Groceries',
        category: EnvelopeCategory.GROCERIES,
        percentage: 15,
        colorHex: '#8BC34A',
        sortOrder: 3,
      },
      {
        name: 'Personal',
        category: EnvelopeCategory.PERSONAL,
        percentage: 15,
        colorHex: '#9C27B0',
        sortOrder: 4,
      },
      {
        name: 'Savings',
        category: EnvelopeCategory.SAVINGS,
        percentage: 10,
        colorHex: '#00ACC1',
        sortOrder: 5,
      },
    ];

    const envelopes = defaultEnvelopes.map((env) =>
      this.envelopeRepository.create({
        ...env,
        householdId,
        allocatedAmount: 0,
        spentAmount: 0,
        isActive: true,
      }),
    );

    return this.envelopeRepository.save(envelopes);
  }

  async recalculateAllocations(
    householdId: string,
    totalIncome: number,
  ): Promise<Envelope[]> {
    const envelopes = await this.findAll(householdId);

    for (const envelope of envelopes) {
      envelope.allocatedAmount = (Number(envelope.percentage) / 100) * totalIncome;
      await this.envelopeRepository.save(envelope);
    }

    return envelopes;
  }
}

