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
import { GoalService } from './goal.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { ContributeToGoalDto } from './dto/contribute-to-goal.dto';

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Get()
  async findAll(@Request() req) {
    return this.goalService.findAll(req.user.householdId);
  }

  @Get('stats')
  async getStats(@Request() req) {
    return this.goalService.getHouseholdGoalStats(req.user.householdId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.goalService.findOne(id);
  }

  @Get(':id/progress')
  async getProgress(@Param('id') id: string) {
    return this.goalService.getGoalProgress(id);
  }

  @Post()
  async create(@Request() req, @Body() createGoalDto: CreateGoalDto) {
    return this.goalService.create(req.user.householdId, createGoalDto);
  }

  @Post(':id/contribute')
  async contribute(@Param('id') id: string, @Body() contributeDto: ContributeToGoalDto) {
    return this.goalService.contributeToGoal(id, contributeDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    return this.goalService.update(id, updateGoalDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.goalService.delete(id);
    return { message: 'Goal deleted successfully' };
  }
}
