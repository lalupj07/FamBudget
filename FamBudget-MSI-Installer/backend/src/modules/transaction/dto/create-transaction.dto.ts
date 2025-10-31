import {
  IsNumber,
  IsEnum,
  IsString,
  IsOptional,
  IsArray,
  IsDateString,
} from 'class-validator';
import { TransactionType } from '../../../entities/transaction.entity';
import { EnvelopeCategory } from '../../../entities/envelope.entity';

export class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsOptional()
  @IsEnum(EnvelopeCategory)
  category?: EnvelopeCategory;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsDateString()
  date: Date;

  @IsOptional()
  @IsString()
  accountId?: string;

  @IsOptional()
  @IsString()
  payerId?: string;

  @IsOptional()
  @IsString()
  splitRuleId?: string;

  @IsOptional()
  splitData?: any;
}

