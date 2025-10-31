import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { HouseholdModule } from './modules/household/household.module';
import { MemberModule } from './modules/member/member.module';
import { AccountModule } from './modules/account/account.module';
import { IncomeModule } from './modules/income/income.module';
import { EnvelopeModule } from './modules/envelope/envelope.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { GoalModule } from './modules/goal/goal.module';
import { SplitRuleModule } from './modules/split-rule/split-rule.module';
import { ReportModule } from './modules/report/report.module';
import { NotificationModule } from './modules/notification/notification.module';
import { EncryptionService } from './services/encryption.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'fambudget',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    HouseholdModule,
    MemberModule,
    AccountModule,
    IncomeModule,
    EnvelopeModule,
    TransactionModule,
    GoalModule,
    SplitRuleModule,
    ReportModule,
    NotificationModule,
  ],
  providers: [EncryptionService],
  exports: [EncryptionService],
})
export class AppModule {}


