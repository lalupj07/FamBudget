import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Account } from '../entities/account.entity';
import { Transaction } from '../entities/transaction.entity';
import { Envelope } from '../entities/envelope.entity';
import { Income } from '../entities/income.entity';
import { Member } from '../entities/member.entity';

export interface Notification {
  id: string;
  type: 'low_balance' | 'budget_exceeded' | 'bill_due' | 'goal_milestone' | 'approval_needed';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  householdId: string;
  memberId?: string;
  relatedId?: string;
  createdAt: Date;
  read: boolean;
}

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Envelope)
    private envelopeRepository: Repository<Envelope>,
    @InjectRepository(Income)
    private incomeRepository: Repository<Income>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  /**
   * Check for low balance accounts
   */
  async checkLowBalances(householdId: string): Promise<Notification[]> {
    const notifications: Notification[] = [];
    const lowBalanceThreshold = 100; // $100

    const accounts = await this.accountRepository.find({
      where: { householdId, isActive: true },
    });

    for (const account of accounts) {
      if (Number(account.balance) < lowBalanceThreshold && Number(account.balance) > 0) {
        notifications.push({
          id: this.generateId(),
          type: 'low_balance',
          title: 'Low Balance Alert',
          message: `${account.name} balance is low: $${Number(account.balance).toFixed(2)}`,
          severity: 'warning',
          householdId,
          relatedId: account.id,
          createdAt: new Date(),
          read: false,
        });
      }
    }

    return notifications;
  }

  /**
   * Check for budget overruns
   */
  async checkBudgetExceeded(householdId: string): Promise<Notification[]> {
    const notifications: Notification[] = [];

    const envelopes = await this.envelopeRepository.find({
      where: { householdId, isActive: true },
    });

    for (const envelope of envelopes) {
      const spent = Number(envelope.spentAmount);
      const allocated = Number(envelope.allocatedAmount);

      if (spent > allocated) {
        const over = spent - allocated;
        notifications.push({
          id: this.generateId(),
          type: 'budget_exceeded',
          title: 'Budget Exceeded',
          message: `${envelope.name} is over budget by $${over.toFixed(2)}`,
          severity: 'error',
          householdId,
          relatedId: envelope.id,
          createdAt: new Date(),
          read: false,
        });
      } else if (spent > allocated * 0.9) {
        // 90% threshold warning
        const remaining = allocated - spent;
        notifications.push({
          id: this.generateId(),
          type: 'budget_exceeded',
          title: 'Approaching Budget Limit',
          message: `${envelope.name} has $${remaining.toFixed(2)} remaining (90% used)`,
          severity: 'warning',
          householdId,
          relatedId: envelope.id,
          createdAt: new Date(),
          read: false,
        });
      }
    }

    return notifications;
  }

  /**
   * Check for upcoming bills (income pay dates)
   */
  async checkUpcomingBills(householdId: string): Promise<Notification[]> {
    const notifications: Notification[] = [];
    const daysAhead = 7;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const members = await this.memberRepository.find({
      where: { householdId },
      relations: ['incomes'],
    });

    for (const member of members) {
      for (const income of member.incomes || []) {
        if (income.nextPayDate && income.isActive) {
          const payDate = new Date(income.nextPayDate);
          const daysUntil = Math.ceil(
            (payDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
          );

          if (daysUntil >= 0 && daysUntil <= daysAhead) {
            notifications.push({
              id: this.generateId(),
              type: 'bill_due',
              title: 'Upcoming Income',
              message: `${member.name}'s ${income.name} in ${daysUntil} day(s)`,
              severity: 'info',
              householdId,
              memberId: member.id,
              relatedId: income.id,
              createdAt: new Date(),
              read: false,
            });
          }
        }
      }
    }

    return notifications;
  }

  /**
   * Get all notifications for a household
   */
  async getAllNotifications(householdId: string): Promise<Notification[]> {
    const lowBalance = await this.checkLowBalances(householdId);
    const budgetExceeded = await this.checkBudgetExceeded(householdId);
    const upcomingBills = await this.checkUpcomingBills(householdId);

    return [...lowBalance, ...budgetExceeded, ...upcomingBills].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  /**
   * Create custom notification
   */
  createNotification(
    householdId: string,
    type: Notification['type'],
    title: string,
    message: string,
    severity: Notification['severity'] = 'info',
    memberId?: string,
    relatedId?: string,
  ): Notification {
    return {
      id: this.generateId(),
      type,
      title,
      message,
      severity,
      householdId,
      memberId,
      relatedId,
      createdAt: new Date(),
      read: false,
    };
  }

  /**
   * Check goal milestones
   */
  async checkGoalMilestones(
    householdId: string,
    goalId: string,
    currentAmount: number,
    targetAmount: number,
  ): Promise<Notification | null> {
    const percentage = (currentAmount / targetAmount) * 100;

    // Milestone notifications at 25%, 50%, 75%, 100%
    const milestones = [25, 50, 75, 100];
    const achievedMilestone = milestones.find(
      (m) => percentage >= m && percentage < m + 5,
    );

    if (achievedMilestone) {
      return this.createNotification(
        householdId,
        'goal_milestone',
        `${achievedMilestone}% Goal Achieved! 🎉`,
        `You've reached ${achievedMilestone}% of your goal!`,
        'success',
        undefined,
        goalId,
      );
    }

    return null;
  }

  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

