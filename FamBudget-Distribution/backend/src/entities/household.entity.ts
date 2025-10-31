import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Member } from './member.entity';
import { Account } from './account.entity';
import { Envelope } from './envelope.entity';
import { Transaction } from './transaction.entity';
import { Goal } from './goal.entity';
import { SplitRule } from './split-rule.entity';

@Entity('households')
export class Household {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 'UTC' })
  timezone: string;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, any>;

  @OneToMany(() => Member, (member) => member.household)
  members: Member[];

  @OneToMany(() => Account, (account) => account.household)
  accounts: Account[];

  @OneToMany(() => Envelope, (envelope) => envelope.household)
  envelopes: Envelope[];

  @OneToMany(() => Transaction, (transaction) => transaction.household)
  transactions: Transaction[];

  @OneToMany(() => Goal, (goal) => goal.household)
  goals: Goal[];

  @OneToMany(() => SplitRule, (rule) => rule.household)
  splitRules: SplitRule[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

