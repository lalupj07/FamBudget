import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';
import { NotificationService } from '../../services/notification.service';
import { Account } from '../../entities/account.entity';
import { Envelope } from '../../entities/envelope.entity';
import { Income } from '../../entities/income.entity';
import { Member } from '../../entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Envelope, Income, Member])],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}

