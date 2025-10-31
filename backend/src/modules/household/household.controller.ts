import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { HouseholdService } from './household.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('household')
@UseGuards(JwtAuthGuard)
export class HouseholdController {
  constructor(private readonly householdService: HouseholdService) {}

  @Get()
  async getHousehold(@Request() req) {
    return this.householdService.findOne(req.user.householdId);
  }

  @Get('dashboard')
  async getDashboard(@Request() req) {
    return this.householdService.getDashboard(req.user.householdId);
  }

  @Get('members')
  async getMembers(@Request() req) {
    return this.householdService.getMembers(req.user.householdId);
  }

  @Patch()
  async updateHousehold(@Request() req, @Body() updateData: any) {
    return this.householdService.update(req.user.householdId, updateData);
  }
}

