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
import { Income } from './income.entity';
import { Transaction } from './transaction.entity';

export enum MemberRole {
  PRIMARY = 'primary',
  PARTNER = 'partner',
  CHILD = 'child',
  GUEST = 'guest',
}

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: MemberRole,
    default: MemberRole.PARTNER,
  })
  role: MemberRole;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  shares: number;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  inviteToken: string;

  @Column({ nullable: true })
  inviteExpiry: Date;

  @ManyToOne(() => Household, (household) => household.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'householdId' })
  household: Household;

  @Column()
  householdId: string;

  @OneToMany(() => Income, (income) => income.member)
  incomes: Income[];

  @OneToMany(() => Transaction, (transaction) => transaction.payer)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

