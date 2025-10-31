import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Account } from '../../entities/account.entity';
import { Transaction, TransactionType } from '../../entities/transaction.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private dataSource: DataSource,
  ) {}

  async findAll(householdId: string): Promise<Account[]> {
    return this.accountRepository.find({
      where: { householdId, isActive: true },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id },
      relations: ['transactions'],
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async create(
    householdId: string,
    createAccountDto: CreateAccountDto,
  ): Promise<Account> {
    const account = this.accountRepository.create({
      ...createAccountDto,
      householdId,
      isActive: true,
    });

    return this.accountRepository.save(account);
  }

  async update(id: string, updateData: Partial<Account>): Promise<Account> {
    await this.accountRepository.update(id, updateData);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    const account = await this.findOne(id);
    
    if (Number(account.balance) !== 0) {
      throw new BadRequestException(
        'Cannot delete account with non-zero balance. Please transfer funds first.',
      );
    }

    await this.accountRepository.update(id, { isActive: false });
  }

  async transfer(transferDto: TransferDto): Promise<void> {
    const { fromAccountId, toAccountId, amount, description } = transferDto;

    if (fromAccountId === toAccountId) {
      throw new BadRequestException('Cannot transfer to the same account');
    }

    if (amount <= 0) {
      throw new BadRequestException('Transfer amount must be positive');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get both accounts
      const fromAccount = await queryRunner.manager.findOne(Account, {
        where: { id: fromAccountId },
      });
      const toAccount = await queryRunner.manager.findOne(Account, {
        where: { id: toAccountId },
      });

      if (!fromAccount || !toAccount) {
        throw new NotFoundException('One or both accounts not found');
      }

      // Check sufficient balance
      if (Number(fromAccount.balance) < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      // Update balances
      fromAccount.balance = Number(fromAccount.balance) - amount;
      toAccount.balance = Number(toAccount.balance) + amount;

      await queryRunner.manager.save(fromAccount);
      await queryRunner.manager.save(toAccount);

      // Create transfer transactions
      const transferTransaction = queryRunner.manager.create(Transaction, {
        amount,
        type: TransactionType.TRANSFER,
        description: description || `Transfer to ${toAccount.name}`,
        date: new Date(),
        householdId: fromAccount.householdId,
        accountId: fromAccountId,
      });

      await queryRunner.manager.save(transferTransaction);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getBalance(id: string): Promise<{ balance: number; currency: string }> {
    const account = await this.findOne(id);
    return {
      balance: Number(account.balance),
      currency: account.currency,
    };
  }

  async deposit(
    accountId: string,
    amount: number,
    description?: string,
  ): Promise<Account> {
    const account = await this.findOne(accountId);
    account.balance = Number(account.balance) + amount;

    // Create transaction record
    const transaction = this.transactionRepository.create({
      amount,
      type: TransactionType.INCOME,
      description: description || 'Deposit',
      date: new Date(),
      householdId: account.householdId,
      accountId,
    });

    await this.transactionRepository.save(transaction);
    return this.accountRepository.save(account);
  }

  async withdraw(
    accountId: string,
    amount: number,
    description?: string,
  ): Promise<Account> {
    const account = await this.findOne(accountId);

    if (Number(account.balance) < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    account.balance = Number(account.balance) - amount;

    // Create transaction record
    const transaction = this.transactionRepository.create({
      amount,
      type: TransactionType.EXPENSE,
      description: description || 'Withdrawal',
      date: new Date(),
      householdId: account.householdId,
      accountId,
    });

    await this.transactionRepository.save(transaction);
    return this.accountRepository.save(account);
  }
}

