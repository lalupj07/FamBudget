import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HouseholdController } from './household.controller';
import { HouseholdService } from './household.service';
import { Household } from '../../entities/household.entity';
import { Member } from '../../entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Household, Member])],
  controllers: [HouseholdController],
  providers: [HouseholdService],
  exports: [HouseholdService],
})
export class HouseholdModule {}

