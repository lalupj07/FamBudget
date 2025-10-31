import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Household } from '../entities/household.entity';
import { Member, MemberRole } from '../entities/member.entity';
import { Account, AccountType } from '../entities/account.entity';
import { Envelope, EnvelopeCategory } from '../entities/envelope.entity';
import { Transaction, TransactionType } from '../entities/transaction.entity';
import { Income, IncomeFrequency } from '../entities/income.entity';

export async function seedDatabase(dataSource: DataSource) {
  console.log('🌱 Seeding database...');

  const householdRepo = dataSource.getRepository(Household);
  const memberRepo = dataSource.getRepository(Member);
  const accountRepo = dataSource.getRepository(Account);
  const envelopeRepo = dataSource.getRepository(Envelope);
  const transactionRepo = dataSource.getRepository(Transaction);
  const incomeRepo = dataSource.getRepository(Income);

  // Create Demo Household
  const household = householdRepo.create({
    name: 'Demo Family',
    currency: 'USD',
    timezone: 'America/New_York',
  });
  await householdRepo.save(household);
  console.log('✅ Created household: Demo Family');

  // Create Primary Member
  const passwordHash = await bcrypt.hash('demo123456', 10);
  const primaryMember = memberRepo.create({
    name: 'Alex Demo',
    email: 'alex@demofamily.com',
    passwordHash,
    role: MemberRole.PRIMARY,
    household,
    householdId: household.id,
    isActive: true,
    shares: 50,
  });
  await memberRepo.save(primaryMember);
  console.log('✅ Created primary member: Alex Demo (alex@demofamily.com / demo123456)');

  // Create Partner
  const partnerMember = memberRepo.create({
    name: 'Jordan Demo',
    email: 'jordan@demofamily.com',
    passwordHash,
    role: MemberRole.PARTNER,
    household,
    householdId: household.id,
    isActive: true,
    shares: 50,
  });
  await memberRepo.save(partnerMember);
  console.log('✅ Created partner: Jordan Demo');

  // Create Accounts
  const jointAccount = accountRepo.create({
    name: 'Joint Checking',
    type: AccountType.JOINT,
    balance: 5420.50,
    household,
    householdId: household.id,
    isActive: true,
  });
  await accountRepo.save(jointAccount);

  const personalAccount = accountRepo.create({
    name: 'Alex Personal',
    type: AccountType.PERSONAL,
    balance: 1250.00,
    household,
    householdId: household.id,
    isActive: true,
  });
  await accountRepo.save(personalAccount);
  console.log('✅ Created accounts');

  // Create Income Sources
  const alexIncome = incomeRepo.create({
    name: 'Software Engineer Salary',
    grossAmount: 8000,
    netAmount: 6000,
    frequency: IncomeFrequency.MONTHLY,
    nextPayDate: new Date('2025-11-01'),
    member: primaryMember,
    memberId: primaryMember.id,
    isActive: true,
  });
  await incomeRepo.save(alexIncome);

  const jordanIncome = incomeRepo.create({
    name: 'Designer Salary',
    grossAmount: 6500,
    netAmount: 5000,
    frequency: IncomeFrequency.MONTHLY,
    nextPayDate: new Date('2025-11-01'),
    member: partnerMember,
    memberId: partnerMember.id,
    isActive: true,
  });
  await incomeRepo.save(jordanIncome);
  console.log('✅ Created income sources');

  // Create Envelopes
  const totalIncome = 11000; // Combined monthly income
  const envelopes = [
    {
      name: 'Household',
      category: EnvelopeCategory.HOUSEHOLD,
      percentage: 40,
      colorHex: '#1565C0',
      sortOrder: 1,
    },
    {
      name: 'Bills',
      category: EnvelopeCategory.BILLS,
      percentage: 20,
      colorHex: '#FF9800',
      sortOrder: 2,
    },
    {
      name: 'Groceries',
      category: EnvelopeCategory.GROCERIES,
      percentage: 15,
      colorHex: '#8BC34A',
      sortOrder: 3,
    },
    {
      name: 'Personal',
      category: EnvelopeCategory.PERSONAL,
      percentage: 15,
      colorHex: '#9C27B0',
      sortOrder: 4,
    },
    {
      name: 'Savings',
      category: EnvelopeCategory.SAVINGS,
      percentage: 10,
      colorHex: '#00ACC1',
      sortOrder: 5,
    },
  ];

  const createdEnvelopes = [];
  for (const env of envelopes) {
    const allocatedAmount = (totalIncome * env.percentage) / 100;
    const envelope = envelopeRepo.create({
      ...env,
      household,
      householdId: household.id,
      allocatedAmount,
      spentAmount: 0,
      isActive: true,
    });
    await envelopeRepo.save(envelope);
    createdEnvelopes.push(envelope);
  }
  console.log('✅ Created budget envelopes');

  // Create Sample Transactions
  const transactions = [
    {
      amount: 1200,
      type: TransactionType.EXPENSE,
      category: EnvelopeCategory.BILLS,
      description: 'Rent',
      date: new Date('2025-10-01'),
      payer: primaryMember,
      account: jointAccount,
    },
    {
      amount: 156.32,
      type: TransactionType.EXPENSE,
      category: EnvelopeCategory.GROCERIES,
      description: 'Whole Foods',
      date: new Date('2025-10-05'),
      payer: partnerMember,
      account: jointAccount,
    },
    {
      amount: 85.50,
      type: TransactionType.EXPENSE,
      category: EnvelopeCategory.BILLS,
      description: 'Internet & Phone',
      date: new Date('2025-10-08'),
      payer: primaryMember,
      account: jointAccount,
    },
    {
      amount: 42.15,
      type: TransactionType.EXPENSE,
      category: EnvelopeCategory.PERSONAL,
      description: 'Coffee & Lunch',
      date: new Date('2025-10-10'),
      payer: primaryMember,
      account: personalAccount,
    },
    {
      amount: 220.00,
      type: TransactionType.EXPENSE,
      category: EnvelopeCategory.GROCERIES,
      description: 'Costco Shopping',
      date: new Date('2025-10-12'),
      payer: partnerMember,
      account: jointAccount,
    },
  ];

  for (const txn of transactions) {
    const transaction = transactionRepo.create({
      ...txn,
      household,
      householdId: household.id,
      payerId: txn.payer.id,
      accountId: txn.account.id,
    });
    await transactionRepo.save(transaction);

    // Update envelope spent amount
    const envelope = createdEnvelopes.find((e) => e.category === txn.category);
    if (envelope) {
      envelope.spentAmount = Number(envelope.spentAmount) + txn.amount;
      await envelopeRepo.save(envelope);
    }

    // Update account balance
    txn.account.balance = Number(txn.account.balance) - txn.amount;
    await accountRepo.save(txn.account);
  }
  console.log('✅ Created sample transactions');

  console.log('\n🎉 Seeding complete!\n');
  console.log('📧 Login credentials:');
  console.log('   Email: alex@demofamily.com');
  console.log('   Password: demo123456');
  console.log('\n💡 You can also login as Jordan:');
  console.log('   Email: jordan@demofamily.com');
  console.log('   Password: demo123456\n');
}

