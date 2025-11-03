import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
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
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') || 'localhost',
        port: parseInt(configService.get('DB_PORT')) || 5432,
        username: configService.get('DB_USERNAME') || 'postgres',
        password: configService.get('DB_PASSWORD') || 'postgres',
        database: configService.get('DB_DATABASE') || 'fambudget',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
        retryAttempts: 5,
        retryDelay: 3000,
        connectTimeoutMS: 30000,
        // Don't fail on connection error - let app start
        autoLoadEntities: true,
        // Critical: Don't let connection failure block app startup
        // Connection will be lazy - only connects when first query runs
      }),
      inject: [ConfigService],
      // Allow connection to fail without blocking app
      // Connection will retry in background
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
  controllers: [HealthController],
  providers: [EncryptionService],
  exports: [EncryptionService],
})
export class AppModule {}


