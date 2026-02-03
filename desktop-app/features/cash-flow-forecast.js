// Cash Flow Forecasting Manager
class CashFlowForecastManager {
    constructor(app) {
        this.app = app;
    }

    // Forecast cash flow for next N days
    forecastCashFlow(days = 30, startDate = null) {
        const start = startDate ? new Date(startDate) : new Date();
        const forecast = [];
        let currentBalance = this.getCurrentTotalBalance();

        for (let i = 0; i < days; i++) {
            const date = new Date(start);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];

            // Get scheduled transactions for this date
            const scheduledIncome = this.getScheduledIncome(dateStr);
            const scheduledExpenses = this.getScheduledExpenses(dateStr);

            // Calculate projected balance
            currentBalance += scheduledIncome - scheduledExpenses;

            forecast.push({
                date: dateStr,
                income: scheduledIncome,
                expenses: scheduledExpenses,
                net: scheduledIncome - scheduledExpenses,
                projectedBalance: currentBalance,
                transactions: []
            });
        }

        return forecast;
    }

    // Get current total balance
    getCurrentTotalBalance() {
        return this.app.data.accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    }

    // Get scheduled income for a date
    getScheduledIncome(date) {
        let income = 0;

        // Check recurring transactions
        if (this.app.recurringManager) {
            const upcoming = this.app.recurringManager.getUpcomingBills(365);
            for (const item of upcoming) {
                if (item.nextDueDate === date && item.amount > 0) {
                    income += item.amount;
                }
            }
        }

        // Check income sources
        for (const incomeSource of this.app.data.incomeSources || []) {
            if (this.isIncomeDue(incomeSource, date)) {
                income += incomeSource.expectedAmount || 0;
            }
        }

        return income;
    }

    // Get scheduled expenses for a date
    getScheduledExpenses(date) {
        let expenses = 0;

        // Check recurring transactions
        if (this.app.recurringManager) {
            const upcoming = this.app.recurringManager.getUpcomingBills(365);
            for (const item of upcoming) {
                if (item.nextDueDate === date && item.amount < 0) {
                    expenses += Math.abs(item.amount);
                }
            }
        }

        return expenses;
    }

    // Check if income is due on a date
    isIncomeDue(incomeSource, date) {
        // Simple monthly check - can be enhanced
        const checkDate = new Date(date);
        const day = checkDate.getDate();
        
        // Assume monthly income on the 1st
        return day === 1;
    }

    // Get low balance predictions
    getLowBalancePredictions(days = 30, threshold = 100) {
        const forecast = this.forecastCashFlow(days);
        return forecast.filter(day => day.projectedBalance < threshold);
    }

    // Get "will I have enough" answer
    willHaveEnough(targetAmount, days = 30) {
        const forecast = this.forecastCashFlow(days);
        const maxBalance = Math.max(...forecast.map(d => d.projectedBalance));
        return {
            willHaveEnough: maxBalance >= targetAmount,
            maxBalance,
            targetAmount,
            daysNeeded: this.daysUntilAmount(targetAmount)
        };
    }

    // Days until reaching target amount
    daysUntilAmount(targetAmount) {
        const forecast = this.forecastCashFlow(365);
        for (let i = 0; i < forecast.length; i++) {
            if (forecast[i].projectedBalance >= targetAmount) {
                return i + 1;
            }
        }
        return null; // Not achievable in 365 days
    }

    // Scenario planning
    runScenario(scenario, days = 30) {
        // scenario: { additionalIncome: 0, additionalExpenses: 0, ... }
        const baseForecast = this.forecastCashFlow(days);
        
        return baseForecast.map(day => ({
            ...day,
            income: day.income + (scenario.additionalIncome || 0),
            expenses: day.expenses + (scenario.additionalExpenses || 0),
            projectedBalance: day.projectedBalance + (scenario.additionalIncome || 0) - (scenario.additionalExpenses || 0)
        }));
    }
}

if (typeof window !== 'undefined') {
    window.CashFlowForecastManager = CashFlowForecastManager;
}
