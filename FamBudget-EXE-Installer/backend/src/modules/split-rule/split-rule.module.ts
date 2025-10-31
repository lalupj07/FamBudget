import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SplitRuleController } from './split-rule.controller';
import { SplitRuleService } from './split-rule.service';
import { SplitRule } from '../../entities/split-rule.entity';
import { Envelope } from '../../entities/envelope.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SplitRule, Envelope])],
  controllers: [SplitRuleController],
  providers: [SplitRuleService],
  exports: [SplitRuleService],
})
export class SplitRuleModule {}

