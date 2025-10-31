import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EnvelopeService } from './envelope.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateEnvelopeDto } from './dto/create-envelope.dto';

@Controller('envelopes')
@UseGuards(JwtAuthGuard)
export class EnvelopeController {
  constructor(private readonly envelopeService: EnvelopeService) {}

  @Get()
  async findAll(@Request() req) {
    return this.envelopeService.findAll(req.user.householdId);
  }

  @Post()
  async create(@Request() req, @Body() createEnvelopeDto: CreateEnvelopeDto) {
    return this.envelopeService.create(req.user.householdId, createEnvelopeDto);
  }

  @Post('defaults')
  async createDefaults(@Request() req) {
    return this.envelopeService.createDefaultEnvelopes(req.user.householdId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.envelopeService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.envelopeService.delete(id);
  }
}

