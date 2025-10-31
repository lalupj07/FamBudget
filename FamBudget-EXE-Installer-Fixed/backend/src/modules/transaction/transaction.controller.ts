import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async findAll(@Request() req, @Query() filters: any) {
    return this.transactionService.findAll(req.user.householdId, filters);
  }

  @Post()
  async create(@Request() req, @Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(req.user.householdId, createTransactionDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.transactionService.delete(id);
  }

  @Get('report/monthly')
  async getMonthlyReport(
    @Request() req,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return this.transactionService.getMonthlyReport(
      req.user.householdId,
      year,
      month,
    );
  }
}

