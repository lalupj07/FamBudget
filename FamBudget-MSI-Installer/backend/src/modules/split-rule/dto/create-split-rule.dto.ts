import { IsString, IsEnum, IsObject, IsOptional, IsBoolean } from 'class-validator';
import { SplitRuleType } from '../../../entities/split-rule.entity';
import { EnvelopeCategory } from '../../../entities/envelope.entity';

export class CreateSplitRuleDto {
  @IsString()
  name: string;

  @IsEnum(SplitRuleType)
  type: SplitRuleType;

  @IsOptional()
  @IsEnum(EnvelopeCategory)
  category?: EnvelopeCategory;

  @IsObject()
  formula: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

