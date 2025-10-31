import { IsNumber, IsOptional, IsString, IsArray } from 'class-validator';

export class ApplySplitRuleDto {
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  splitRuleId?: string;

  @IsOptional()
  @IsArray()
  memberIds?: string[];
}

