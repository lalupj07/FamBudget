import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvelopeController } from './envelope.controller';
import { EnvelopeService } from './envelope.service';
import { Envelope } from '../../entities/envelope.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Envelope])],
  controllers: [EnvelopeController],
  providers: [EnvelopeService],
  exports: [EnvelopeService],
})
export class EnvelopeModule {}

