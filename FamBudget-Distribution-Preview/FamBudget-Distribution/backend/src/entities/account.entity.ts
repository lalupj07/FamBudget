import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Household } from './household.entity';
import { Transaction } from './transaction.entity';

export enum AccountType {
  PERSONAL = 'personal',
  JOINT = 'joint',
}

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: AccountType,
    default: AccountType.PERSONAL,
  })
  type: AccountType;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  balance: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ nullable: true })
  linkedBankId: string;

  @Column({ nullable: true })
  linkedBankName: string;

  @Column({ type: 'jsonb', nullable: true })
  linkedBankData: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Household, (household) => household.accounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'householdId' })
  household: Household;

  @Column()
  householdId: string;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

