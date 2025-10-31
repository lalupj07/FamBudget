import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationService } from '../../services/notification.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getAll(@Request() req) {
    return this.notificationService.getAllNotifications(req.user.householdId);
  }

  @Get('low-balance')
  async getLowBalanceAlerts(@Request() req) {
    return this.notificationService.checkLowBalances(req.user.householdId);
  }

  @Get('budget-exceeded')
  async getBudgetAlerts(@Request() req) {
    return this.notificationService.checkBudgetExceeded(req.user.householdId);
  }

  @Get('upcoming-bills')
  async getUpcomingBills(@Request() req) {
    return this.notificationService.checkUpcomingBills(req.user.householdId);
  }
}

