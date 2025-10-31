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
import { AccountService } from './account.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAccountDto } from './dto/create-account.dto';
import { TransferDto } from './dto/transfer.dto';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async findAll(@Request() req) {
    return this.accountService.findAll(req.user.householdId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.accountService.findOne(id);
  }

  @Post()
  async create(@Request() req, @Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(req.user.householdId, createAccountDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.accountService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.accountService.delete(id);
  }

  @Post('transfer')
  async transfer(@Body() transferDto: TransferDto) {
    return this.accountService.transfer(transferDto);
  }

  @Get(':id/balance')
  async getBalance(@Param('id') id: string) {
    return this.accountService.getBalance(id);
  }
}

