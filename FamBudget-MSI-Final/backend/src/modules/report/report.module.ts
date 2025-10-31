import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { Transaction } from '../../entities/transaction.entity';
import { Household } from '../../entities/household.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Household])],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}

