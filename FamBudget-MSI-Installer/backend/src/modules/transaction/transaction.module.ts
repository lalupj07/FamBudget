import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Transaction } from '../../entities/transaction.entity';
import { Account } from '../../entities/account.entity';
import { Envelope } from '../../entities/envelope.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Account, Envelope])],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}

