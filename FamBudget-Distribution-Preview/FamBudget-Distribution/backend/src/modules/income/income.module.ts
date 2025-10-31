import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from '../../entities/income.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Income])],
})
export class IncomeModule {}

