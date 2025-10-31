import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { Account } from '../../entities/account.entity';
import { Transaction } from '../../entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Transaction])],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}

