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

export enum GoalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  targetAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  currentAmount: number;

  @Column({ type: 'date', nullable: true })
  deadline: Date;

  @Column({
    type: 'enum',
    enum: GoalStatus,
    default: GoalStatus.ACTIVE,
  })
  status: GoalStatus;

  @Column({ type: 'jsonb', nullable: true })
  contributors: Array<{
    memberId: string;
    contributionAmount: number;
    contributionSchedule: string;
  }>;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => Household, (household) => household.goals, {
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

