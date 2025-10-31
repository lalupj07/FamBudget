import { IsString, IsNumber, IsOptional, IsDateString, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ContributorDto {
  @IsString()
  memberId: string;

  @IsNumber()
  @Min(0)
  contributionAmount: number;

  @IsString()
  contributionSchedule: string;
}

export class CreateGoalDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0.01)
  targetAmount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentAmount?: number;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContributorDto)
  contributors?: ContributorDto[];

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
