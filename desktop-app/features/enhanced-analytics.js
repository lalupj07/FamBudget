// Enhanced Analytics Manager
class EnhancedAnalyticsManager {
    constructor(app) {
        this.app = app;
    }

    // Get spending trends
    getSpendingTrends(periods = 6, periodType = 'month') {
        const trends = [];
        const now = new Date();

        for (let i = periods - 1; i >= 0; i--) {
            const periodStart = new Date(now);
            const periodEnd = new Date(now);

            if (periodType === 'month') {
                periodStart.setMonth(periodStart.getMonth() - i);
                periodStart.setDate(1);
                periodEnd.setMonth(periodEnd.getMonth() - i + 1);
                periodEnd.setDate(0);
            } else if (periodType === 'week') {
                periodStart.setDate(periodStart.getDate() - (i * 7));
                periodEnd.setDate(periodEnd.getDate() - ((i - 1) * 7));
            }

            const startStr = periodStart.toISOString().split('T')[0];
            const endStr = periodEnd.toISOString().split('T')[0];

            const transactions = this.app.data.transactions.filter(t =>
                t.date >= startStr && t.date <= endStr
            );

            const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
            const expenses = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
            const net = income - expenses;

            trends.push({
                period: periodType === 'month' 
                    ? `${periodStart.toLocaleString('default', { month: 'short' })} ${periodStart.getFullYear()}`
                    : `Week ${i + 1}`,
                startDate: startStr,
                endDate: endStr,
                income,
                expenses,
                net,
                savingsRate: income > 0 ? ((net / income) * 100) : 0
            });
        }

        return trends;
    }

    // Get category spending comparison
    getCategoryComparison(periods = 2) {
        const comparisons = [];
        const categories = [...new Set(this.app.data.transactions.map(t => t.category))];

        for (const category of categories) {
            const spending = [];
            const now = new Date();

            for (let i = periods - 1; i >= 0; i--) {
                const periodStart = new Date(now);
                periodStart.setMonth(periodStart.getMonth() - i);
                periodStart.setDate(1);
                const periodEnd = new Date(periodStart);
                periodEnd.setMonth(periodEnd.getMonth() + 1);
                periodEnd.setDate(0);

                const startStr = periodStart.toISOString().split('T')[0];
                const endStr = periodEnd.toISOString().split('T')[0];

                const categoryTransactions = this.app.data.transactions.filter(t =>
                    t.category === category && t.date >= startStr && t.date <= endStr && t.amount < 0
                );

                const total = Math.abs(categoryTransactions.reduce((sum, t) => sum + t.amount, 0));
                spending.push(total);
            }

            comparisons.push({
                category,
                spending,
                change: periods > 1 ? ((spending[spending.length - 1] - spending[0]) / spending[0] * 100) : 0,
                average: spending.reduce((sum, s) => sum + s, 0) / spending.length
            });
        }

        return comparisons;
    }

    // Get average spending per category
    getAverageSpendingByCategory(days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const startStr = startDate.toISOString().split('T')[0];

        const transactions = this.app.data.transactions.filter(t =>
            t.date >= startStr && t.amount < 0
        );

        const categoryTotals = {};
        const categoryCounts = {};

        for (const transaction of transactions) {
            const category = transaction.category || 'Uncategorized';
            if (!categoryTotals[category]) {
                categoryTotals[category] = 0;
                categoryCounts[category] = 0;
            }
            categoryTotals[category] += Math.abs(transaction.amount);
            categoryCounts[category]++;
        }

        const averages = [];
        for (const category in categoryTotals) {
            averages.push({
                category,
                total: categoryTotals[category],
                count: categoryCounts[category],
                average: categoryTotals[category] / categoryCounts[category],
                percentage: (categoryTotals[category] / Object.values(categoryTotals).reduce((a, b) => a + b, 0)) * 100
            });
        }

        return averages.sort((a, b) => b.total - a.total);
    }

    // Get financial health score
    getFinancialHealthScore() {
        const score = {
            total: 0,
            factors: {}
        };

        // Savings rate (0-30 points)
        const income = this.app.data.transactions.filter(t => t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = Math.abs(this.app.data.transactions.filter(t => t.amount < 0)
            .reduce((sum, t) => sum + t.amount, 0));
        const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
        score.factors.savingsRate = Math.min(30, Math.max(0, savingsRate * 0.3));
        score.total += score.factors.savingsRate;

        // Budget adherence (0-25 points)
        const budgetCategories = this.app.data.dashboard?.budgetCategories || [];
        let budgetScore = 25;
        for (const cat of budgetCategories) {
            if (cat.spent > cat.budget) {
                const overage = ((cat.spent - cat.budget) / cat.budget) * 100;
                budgetScore -= Math.min(5, overage / 10);
            }
        }
        score.factors.budgetAdherence = Math.max(0, budgetScore);
        score.total += score.factors.budgetAdherence;

        // Debt ratio (0-20 points)
        const totalDebt = this.app.debtTracker ? this.app.debtTracker.getTotalDebt() : 0;
        const debtRatio = income > 0 ? (totalDebt / income) : 0;
        score.factors.debtRatio = Math.max(0, 20 - (debtRatio * 20));
        score.total += score.factors.debtRatio;

        // Emergency fund (0-15 points)
        const totalBalance = this.app.data.accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
        const monthsOfExpenses = expenses > 0 ? totalBalance / (expenses / 30) : 0;
        score.factors.emergencyFund = Math.min(15, monthsOfExpenses * 5);
        score.total += score.factors.emergencyFund;

        // Goal progress (0-10 points)
        const goals = this.app.data.goals || [];
        if (goals.length > 0) {
            const avgProgress = goals.reduce((sum, g) => sum + (g.current / g.target), 0) / goals.length;
            score.factors.goalProgress = avgProgress * 10;
        } else {
            score.factors.goalProgress = 5; // Neutral if no goals
        }
        score.total += score.factors.goalProgress;

        score.total = Math.round(score.total);
        score.grade = this.getGrade(score.total);

        return score;
    }

    getGrade(score) {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }

    // Get spending velocity (how fast you're spending)
    getSpendingVelocity(days = 7) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const startStr = startDate.toISOString().split('T')[0];

        const transactions = this.app.data.transactions.filter(t =>
            t.date >= startStr && t.amount < 0
        );

        const totalSpent = Math.abs(transactions.reduce((sum, t) => sum + t.amount, 0));
        const dailyAverage = totalSpent / days;
        const monthlyProjection = dailyAverage * 30;

        return {
            dailyAverage,
            monthlyProjection,
            totalSpent,
            days,
            transactions: transactions.length
        };
    }
}

if (typeof window !== 'undefined') {
    window.EnhancedAnalyticsManager = EnhancedAnalyticsManager;
}
