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
import { SplitRuleService } from './split-rule.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSplitRuleDto } from './dto/create-split-rule.dto';
import { ApplySplitRuleDto } from './dto/apply-split-rule.dto';

@Controller('split-rules')
@UseGuards(JwtAuthGuard)
export class SplitRuleController {
  constructor(private readonly splitRuleService: SplitRuleService) {}

  @Get()
  async findAll(@Request() req) {
    return this.splitRuleService.findAll(req.user.householdId);
  }

  @Get('default')
  async getDefaultRule(@Request() req) {
    return this.splitRuleService.getDefaultRule(req.user.householdId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.splitRuleService.findOne(id);
  }

  @Post()
  async create(@Request() req, @Body() createSplitRuleDto: CreateSplitRuleDto) {
    return this.splitRuleService.create(req.user.householdId, createSplitRuleDto);
  }

  @Post('apply')
  async applySplitRule(@Request() req, @Body() applySplitRuleDto: ApplySplitRuleDto) {
    return this.splitRuleService.applySplitRule(
      req.user.householdId,
      applySplitRuleDto,
    );
  }

  @Post('income-split')
  async splitIncome(
    @Request() req,
    @Body() body: { incomeAmount: number; splitRuleId?: string },
  ) {
    return this.splitRuleService.splitIncome(
      req.user.householdId,
      body.incomeAmount,
      body.splitRuleId,
    );
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.splitRuleService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.splitRuleService.delete(id);
  }

  @Post(':id/set-default')
  async setDefault(@Request() req, @Param('id') id: string) {
    return this.splitRuleService.setAsDefault(req.user.householdId, id);
  }
}

