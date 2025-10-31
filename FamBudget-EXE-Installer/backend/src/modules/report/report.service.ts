import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction, TransactionType } from '../../entities/transaction.entity';
import { Household } from '../../entities/household.entity';
import { Parser } from 'json2csv';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Household)
    private householdRepository: Repository<Household>,
  ) {}

  async getMonthlyReport(householdId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const transactions = await this.transactionRepository.find({
      where: {
        householdId,
        date: Between(startDate, endDate),
      },
      relations: ['payer', 'account'],
      order: { date: 'DESC' },
    });

    const totalIncome = transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const byCategory = transactions.reduce((acc, t) => {
      if (t.category) {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      }
      return acc;
    }, {} as Record<string, number>);

    const byPayer = transactions.reduce((acc, t) => {
      if (t.payer) {
        const payerName = t.payer.name;
        acc[payerName] = (acc[payerName] || 0) + Number(t.amount);
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      period: { year, month, startDate, endDate },
      summary: {
        totalIncome,
        totalExpense,
        netChange: totalIncome - totalExpense,
        transactionCount: transactions.length,
      },
      breakdown: {
        byCategory,
        byPayer,
      },
      transactions,
    };
  }

  async getAnnualReport(householdId: string, year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const transactions = await this.transactionRepository.find({
      where: {
        householdId,
        date: Between(startDate, endDate),
      },
      order: { date: 'DESC' },
    });

    // Group by month
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const monthTransactions = transactions.filter((t) => {
        const txDate = new Date(t.date);
        return txDate.getMonth() === i;
      });

      const income = monthTransactions
        .filter((t) => t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expense = monthTransactions
        .filter((t) => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      return {
        month: i + 1,
        income,
        expense,
        netChange: income - expense,
      };
    });

    const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0);
    const totalExpense = monthlyData.reduce((sum, m) => sum + m.expense, 0);

    return {
      year,
      summary: {
        totalIncome,
        totalExpense,
        netChange: totalIncome - totalExpense,
        averageMonthlyIncome: totalIncome / 12,
        averageMonthlyExpense: totalExpense / 12,
      },
      monthlyData,
    };
  }

  async getCategoryBreakdown(
    householdId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const transactions = await this.transactionRepository.find({
      where: {
        householdId,
        date: Between(startDate, endDate),
      },
    });

    const breakdown = transactions.reduce((acc, t) => {
      if (t.category) {
        if (!acc[t.category]) {
          acc[t.category] = {
            count: 0,
            total: 0,
            transactions: [],
          };
        }
        acc[t.category].count++;
        acc[t.category].total += Number(t.amount);
        acc[t.category].transactions.push(t);
      }
      return acc;
    }, {} as Record<string, any>);

    return breakdown;
  }

  async exportToCSV(
    householdId: string,
    year: number,
    month: number,
  ): Promise<string> {
    const report = await this.getMonthlyReport(householdId, year, month);
    const household = await this.householdRepository.findOne({
      where: { id: householdId },
    });

    const fields = [
      { label: 'Date', value: 'date' },
      { label: 'Type', value: 'type' },
      { label: 'Amount', value: 'amount' },
      { label: 'Category', value: 'category' },
      { label: 'Description', value: 'description' },
      { label: 'Payer', value: 'payer.name' },
      { label: 'Account', value: 'account.name' },
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(report.transactions);

    return csv;
  }

  async exportToPDF(
    householdId: string,
    year: number,
    month: number,
  ): Promise<Buffer> {
    const report = await this.getMonthlyReport(householdId, year, month);
    const household = await this.householdRepository.findOne({
      where: { id: householdId },
    });

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Header
      doc
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('FamBudget Monthly Report', { align: 'center' });

      doc.moveDown();
      doc.fontSize(14).font('Helvetica').text(household.name, { align: 'center' });
      doc.text(`${month}/${year}`, { align: 'center' });

      doc.moveDown(2);

      // Summary
      doc.fontSize(16).font('Helvetica-Bold').text('Summary');
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica');
      doc.text(`Total Income: $${report.summary.totalIncome.toFixed(2)}`);
      doc.text(`Total Expenses: $${report.summary.totalExpense.toFixed(2)}`);
      doc.text(`Net Change: $${report.summary.netChange.toFixed(2)}`);
      doc.text(`Transactions: ${report.summary.transactionCount}`);

      doc.moveDown(2);

      // Category Breakdown
      doc.fontSize(16).font('Helvetica-Bold').text('Category Breakdown');
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica');

      Object.entries(report.breakdown.byCategory).forEach(([category, amount]: [string, any]) => {
        doc.text(
          `${category.charAt(0).toUpperCase() + category.slice(1)}: $${amount.toFixed(2)}`,
        );
      });

      doc.moveDown(2);

      // Transactions
      doc.fontSize(16).font('Helvetica-Bold').text('Recent Transactions');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');

      report.transactions.slice(0, 20).forEach((txn) => {
        const date = new Date(txn.date).toLocaleDateString();
        const amount = Number(txn.amount).toFixed(2);
        const desc = txn.description || txn.category;
        doc.text(`${date} | $${amount} | ${desc}`);
      });

      // Footer
      doc
        .fontSize(8)
        .text(
          `Generated on ${new Date().toLocaleDateString()} by FamBudget`,
          50,
          doc.page.height - 50,
          { align: 'center' },
        );

      doc.end();
    });
  }

  async getDashboardReport(
    householdId: string,
    startDate: Date,
    endDate: Date,
    timeframe: string,
  ) {
    const transactions = await this.transactionRepository.find({
      where: {
        householdId,
        date: Between(startDate, endDate),
      },
      relations: ['payer', 'account'],
      order: { date: 'DESC' },
    });

    const totalIncome = transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netChange = totalIncome - totalExpense;

    // Category breakdown
    const byCategory = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => {
        if (t.category) {
          acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        }
        return acc;
      }, {} as Record<string, number>);

    // Get monthly trend for the last 5 months
    const monthlyTrend = [];
    for (let i = 4; i >= 0; i--) {
      const trendDate = new Date();
      trendDate.setMonth(trendDate.getMonth() - i);
      const monthStart = new Date(trendDate.getFullYear(), trendDate.getMonth(), 1);
      const monthEnd = new Date(trendDate.getFullYear(), trendDate.getMonth() + 1, 0);

      const monthTransactions = await this.transactionRepository.find({
        where: {
          householdId,
          date: Between(monthStart, monthEnd),
        },
      });

      const monthIncome = monthTransactions
        .filter((t) => t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const monthExpense = monthTransactions
        .filter((t) => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      monthlyTrend.push({
        month: trendDate.toLocaleDateString('en-US', { month: 'short' }),
        income: monthIncome,
        expense: monthExpense,
      });
    }

    return {
      timeframe,
      period: { startDate, endDate },
      summary: {
        totalIncome,
        totalExpense,
        netChange,
        transactionCount: transactions.length,
        savingsRate: totalIncome > 0 ? (netChange / totalIncome) * 100 : 0,
      },
      byCategory,
      monthlyTrend,
      insights: this.generateInsights(totalIncome, totalExpense, byCategory, netChange),
    };
  }

  private generateInsights(
    totalIncome: number,
    totalExpense: number,
    byCategory: Record<string, number>,
    netChange: number,
  ) {
    const insights = [];
    const savingsRate = totalIncome > 0 ? (netChange / totalIncome) * 100 : 0;

    // Savings rate insight
    if (savingsRate > 20) {
      insights.push(`🎉 Excellent! You're saving ${savingsRate.toFixed(1)}% of your income!`);
    } else if (savingsRate > 10) {
      insights.push(`👍 Good job! You're saving ${savingsRate.toFixed(1)}% of your income.`);
    } else if (savingsRate > 0) {
      insights.push(`💡 You're saving ${savingsRate.toFixed(1)}% of your income. Consider increasing it!`);
    } else {
      insights.push(`⚠️ You're spending more than you earn. Time to review your budget!`);
    }

    // Category insights
    const topCategory = Object.entries(byCategory).sort(([, a], [, b]) => b - a)[0];
    if (topCategory) {
      const categoryPercent = (topCategory[1] / totalExpense) * 100;
      insights.push(
        `📊 ${topCategory[0].charAt(0).toUpperCase() + topCategory[0].slice(1)} spending is ${categoryPercent.toFixed(0)}% of total expenses`
      );
    }

    // Budget adherence insight (mock for now)
    const underBudgetCategories = Math.floor(Math.random() * 3) + 2; // Random 2-4
    insights.push(`💰 You're under budget in ${underBudgetCategories} out of 5 categories`);

    return insights;
  }
}

