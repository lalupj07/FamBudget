import { IsString, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { AccountType } from '../../../entities/account.entity';

export class CreateAccountDto {
  @IsString()
  name: string;

  @IsEnum(AccountType)
  type: AccountType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  balance?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  linkedBankId?: string;

  @IsOptional()
  @IsString()
  linkedBankName?: string;
}

