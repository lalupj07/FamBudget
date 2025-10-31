import { IsString, IsNumber, Min } from 'class-validator';

export class ContributeToGoalDto {
  @IsString()
  memberId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsString()
  note?: string;
}
