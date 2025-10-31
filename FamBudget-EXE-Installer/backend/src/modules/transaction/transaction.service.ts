import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction, TransactionType } from '../../entities/transaction.entity';
import { Account } from '../../entities/account.entity';
import { Envelope } from '../../entities/envelope.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Envelope)
    private envelopeRepository: Repository<Envelope>,
  ) {}

  async findAll(householdId: string, filters?: any): Promise<Transaction[]> {
    const query: any = { householdId };

    if (filters?.startDate && filters?.endDate) {
      query.date = Between(new Date(filters.startDate), new Date(filters.endDate));
    }

    if (filters?.category) {
      query.category = filters.category;
    }

    if (filters?.payerId) {
      query.payerId = filters.payerId;
    }

    return this.transactionRepository.find({
      where: query,
      relations: ['account', 'payer', 'splitRule'],
      order: { date: 'DESC' },
    });
  }

  async create(
    householdId: string,
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      householdId,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    // Update account balance
    if (createTransactionDto.accountId) {
      await this.updateAccountBalance(
        createTransactionDto.accountId,
        createTransactionDto.amount,
        createTransactionDto.type,
      );
    }

    // Update envelope spent amount
    if (createTransactionDto.category) {
      await this.updateEnvelopeSpent(
        householdId,
        createTransactionDto.category,
        createTransactionDto.amount,
      );
    }

    return savedTransaction;
  }

  async delete(id: string): Promise<void> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });

    if (transaction) {
      // Reverse account balance update
      if (transaction.accountId) {
        await this.updateAccountBalance(
          transaction.accountId,
          -Number(transaction.amount),
          transaction.type,
        );
      }

      // Reverse envelope spent update
      if (transaction.category) {
        await this.updateEnvelopeSpent(
          transaction.householdId,
          transaction.category,
          -Number(transaction.amount),
        );
      }

      await this.transactionRepository.delete(id);
    }
  }

  private async updateAccountBalance(
    accountId: string,
    amount: number,
    type: TransactionType,
  ): Promise<void> {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });

    if (account) {
      if (type === TransactionType.EXPENSE) {
        account.balance = Number(account.balance) - amount;
      } else if (type === TransactionType.INCOME) {
        account.balance = Number(account.balance) + amount;
      }
      await this.accountRepository.save(account);
    }
  }

  private async updateEnvelopeSpent(
    householdId: string,
    category: string,
    amount: number,
  ): Promise<void> {
    const envelope = await this.envelopeRepository.findOne({
      where: { householdId, category: category as any },
    });

    if (envelope) {
      envelope.spentAmount = Number(envelope.spentAmount) + amount;
      await this.envelopeRepository.save(envelope);
    }
  }

  async getMonthlyReport(householdId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const transactions = await this.findAll(householdId, {
      startDate,
      endDate,
    });

    const totalIncome = transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const byCategory = transactions.reduce((acc, t) => {
      if (t.category) {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      transactions,
      totalIncome,
      totalExpense,
      netChange: totalIncome - totalExpense,
      byCategory,
    };
  }
}

