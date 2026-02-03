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
import { Account } from './account.entity';
import { Member } from './member.entity';
import { EnvelopeCategory } from './envelope.entity';
import { TransactionType } from './transaction.entity';

export enum RecurringFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

@Entity('recurring_transactions')
export class RecurringTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.EXPENSE,
  })
  type: TransactionType;

  @Column({
    type: 'enum',
    enum: EnvelopeCategory,
    nullable: true,
  })
  category: EnvelopeCategory;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: RecurringFrequency,
    default: RecurringFrequency.MONTHLY,
  })
  frequency: RecurringFrequency;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'date', nullable: true })
  lastProcessedDate: Date;

  @Column({ type: 'date', nullable: true })
  nextDueDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Household, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'householdId' })
  household: Household;

  @Column()
  householdId: string;

  @ManyToOne(() => Account, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column({ nullable: true })
  accountId: string;

  @ManyToOne(() => Member, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'payerId' })
  payer: Member;

  @Column({ nullable: true })
  payerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
