import { IsString, IsEnum, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { EnvelopeCategory } from '../../../entities/envelope.entity';

export class CreateEnvelopeDto {
  @IsString()
  name: string;

  @IsEnum(EnvelopeCategory)
  category: EnvelopeCategory;

  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;

  @IsOptional()
  @IsString()
  colorHex?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

