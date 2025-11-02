import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsNumber, IsEnum } from 'class-validator';
import { CreateGoalDto } from './create-goal.dto';
import { GoalStatus } from '../../../entities/goal.entity';

export class UpdateGoalDto extends PartialType(CreateGoalDto) {
  @IsOptional()
  @IsNumber()
  currentAmount?: number;

  @IsOptional()
  @IsEnum(GoalStatus)
  status?: GoalStatus;
}
