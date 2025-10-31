import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ReportService } from './report.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('monthly')
  async getMonthlyReport(
    @Request() req,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return this.reportService.getMonthlyReport(
      req.user.householdId,
      year,
      month,
    );
  }

  @Get('export/csv')
  async exportToCsv(
    @Request() req,
    @Res() res: Response,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    const csv = await this.reportService.exportToCSV(
      req.user.householdId,
      year,
      month,
    );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=fambudget-${year}-${month}.csv`,
    );
    res.status(HttpStatus.OK).send(csv);
  }

  @Get('export/pdf')
  async exportToPdf(
    @Request() req,
    @Res() res: Response,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    const pdf = await this.reportService.exportToPDF(
      req.user.householdId,
      year,
      month,
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=fambudget-${year}-${month}.pdf`,
    );
    res.status(HttpStatus.OK).send(pdf);
  }

  @Get('annual')
  async getAnnualReport(@Request() req, @Query('year') year: number) {
    return this.reportService.getAnnualReport(req.user.householdId, year);
  }

  @Get('category-breakdown')
  async getCategoryBreakdown(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportService.getCategoryBreakdown(
      req.user.householdId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('dashboard')
  async getDashboardReport(
    @Request() req,
    @Query('timeframe') timeframe: string = 'month',
  ) {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (timeframe) {
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        endDate = now;
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
    }

    return this.reportService.getDashboardReport(
      req.user.householdId,
      startDate,
      endDate,
      timeframe,
    );
  }
}

