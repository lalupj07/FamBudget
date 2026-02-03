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
import { SplitRule } from './split-rule.entity';
import { EnvelopeCategory } from './envelope.entity';

export enum TransactionType {
  EXPENSE = 'expense',
  INCOME = 'income',
  TRANSFER = 'transfer',
}

@Entity('transactions')
export class Transaction {
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

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'jsonb', nullable: true })
  receipts: string[];

  @Column({ type: 'jsonb', nullable: true })
  splitData: Record<string, any>;

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ nullable: true })
  recurringPattern: string;

  @ManyToOne(() => Household, (household) => household.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'householdId' })
  household: Household;

  @Column()
  householdId: string;

  @ManyToOne(() => Account, (account) => account.transactions, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column({ nullable: true })
  accountId: string;

  @ManyToOne(() => Member, (member) => member.transactions, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'payerId' })
  payer: Member;

  @Column({ nullable: true })
  payerId: string;

  @ManyToOne(() => SplitRule, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'splitRuleId' })
  splitRule: SplitRule;

  @Column({ nullable: true })
  splitRuleId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

