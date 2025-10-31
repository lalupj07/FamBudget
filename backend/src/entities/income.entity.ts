import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Member } from './member.entity';

export enum IncomeFrequency {
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  ANNUAL = 'annual',
}

@Entity('incomes')
export class Income {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  grossAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  netAmount: number;

  @Column({
    type: 'enum',
    enum: IncomeFrequency,
    default: IncomeFrequency.MONTHLY,
  })
  frequency: IncomeFrequency;

  @Column({ type: 'date', nullable: true })
  nextPayDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Member, (member) => member.incomes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  member: Member;

  @Column()
  memberId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

