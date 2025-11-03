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
    // Use lazy connection - don't connect during module initialization
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const dbHost = configService.get('DB_HOST');
        const dbPort = parseInt(configService.get('DB_PORT')) || 5432;
        const dbUsername = configService.get('DB_USERNAME') || 'postgres';
        const dbPassword = configService.get('DB_PASSWORD') || 'postgres';
        const dbDatabase = configService.get('DB_DATABASE') || 'fambudget';
        
        console.log('📊 Database configuration loaded');
        console.log(`   Host: ${dbHost || '❌ NOT SET - using localhost'}:${dbPort}`);
        console.log(`   Database: ${dbDatabase}`);
        console.log(`   Username: ${dbUsername}`);
        console.log(`   Synchronize: ${configService.get('NODE_ENV') === 'development'}`);
        
        if (!dbHost) {
          console.error('❌ CRITICAL: DB_HOST environment variable is missing!');
          console.error('   The app will try to connect to localhost, which will fail.');
          console.error('   Please set DB_HOST in Railway environment variables.');
        }
        
        const config = {
          type: 'postgres' as const,
          host: dbHost || 'localhost',
          port: dbPort,
          username: dbUsername,
          password: dbPassword,
          database: dbDatabase,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get('NODE_ENV') === 'development',
          logging: configService.get('NODE_ENV') === 'development',
          // Critical: Don't fail app if DB connection fails
          // Connection will be attempted but won't crash the app
          retryAttempts: 0, // Don't retry during module init - let it fail gracefully
          connectTimeoutMS: 5000, // Shorter timeout
          autoLoadEntities: true,
        };
        
        return config;
      },
      inject: [ConfigService],
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


