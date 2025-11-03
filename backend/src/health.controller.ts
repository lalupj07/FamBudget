import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  health() {
    // Simple health check - no dependencies
    // This endpoint should work even if database is not connected
    return {
      status: 'ok',
      message: 'FamBudget API is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('ready')
  ready() {
    // Readiness check - verifies app is fully ready
    return {
      status: 'ready',
      message: 'FamBudget API is ready to accept requests',
      timestamp: new Date().toISOString(),
    };
  }
}

