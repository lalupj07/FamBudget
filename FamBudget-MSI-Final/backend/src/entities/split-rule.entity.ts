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
import { EnvelopeCategory } from './envelope.entity';

export enum SplitRuleType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  RATIO = 'ratio',
  CUSTOM = 'custom',
}

@Entity('split_rules')
export class SplitRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: SplitRuleType,
    default: SplitRuleType.PERCENTAGE,
  })
  type: SplitRuleType;

  @Column({
    type: 'enum',
    enum: EnvelopeCategory,
    nullable: true,
  })
  category: EnvelopeCategory;

  @Column({ type: 'jsonb' })
  formula: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @ManyToOne(() => Household, (household) => household.splitRules, {
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

