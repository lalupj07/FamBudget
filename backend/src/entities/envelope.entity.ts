import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Household } from './household.entity';

export enum EnvelopeCategory {
  HOUSEHOLD = 'household',
  BILLS = 'bills',
  GROCERIES = 'groceries',
  PERSONAL = 'personal',
  EMERGENCY = 'emergency',
  INVESTMENTS = 'investments',
  SAVINGS = 'savings',
  TRAVEL = 'travel',
  ENTERTAINMENT = 'entertainment',
  HEALTHCARE = 'healthcare',
  EDUCATION = 'education',
  OTHER = 'other',
}

@Entity('envelopes')
export class Envelope {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: EnvelopeCategory,
    default: EnvelopeCategory.OTHER,
  })
  category: EnvelopeCategory;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  percentage: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  allocatedAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  spentAmount: number;

  @Column({ nullable: true })
  colorHex: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @ManyToOne(() => Household, (household) => household.envelopes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'householdId' })
  household: Household;

  @Column()
  householdId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

