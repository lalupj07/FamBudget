// Debt Tracker Manager
class DebtTrackerManager {
    constructor(app) {
        this.app = app;
        this.debts = [];
    }

    async init() {
        await this.loadDebts();
    }

    async loadDebts() {
        const stored = localStorage.getItem('fambudget_debts');
        if (stored) {
            this.debts = JSON.parse(stored);
        }
    }

    async saveDebts() {
        localStorage.setItem('fambudget_debts', JSON.stringify(this.debts));
    }

    // Add debt
    async addDebt(data) {
        const debt = {
            id: Date.now(),
            name: data.name,
            type: data.type, // credit_card, loan, mortgage, other
            principal: data.principal,
            currentBalance: data.currentBalance || data.principal,
            interestRate: data.interestRate || 0,
            minimumPayment: data.minimumPayment || 0,
            dueDate: data.dueDate || null,
            startDate: data.startDate || new Date().toISOString().split('T')[0],
            endDate: data.endDate || null,
            notes: data.notes || '',
            createdAt: new Date().toISOString()
        };

        this.debts.push(debt);
        await this.saveDebts();
        return debt;
    }

    // Make payment
    async makePayment(debtId, amount, date) {
        const debt = this.debts.find(d => d.id === debtId);
        if (!debt) return null;

        debt.currentBalance = Math.max(0, debt.currentBalance - amount);
        
        // Record payment
        if (!debt.payments) debt.payments = [];
        debt.payments.push({
            amount,
            date: date || new Date().toISOString().split('T')[0],
            balanceAfter: debt.currentBalance
        });

        await this.saveDebts();
        return debt;
    }

    // Calculate payoff date
    calculatePayoffDate(debt, monthlyPayment) {
        if (monthlyPayment <= 0) return null;
        if (debt.interestRate <= 0) {
            const months = Math.ceil(debt.currentBalance / monthlyPayment);
            const date = new Date();
            date.setMonth(date.getMonth() + months);
            return date.toISOString().split('T')[0];
        }

        // Simple interest calculation
        let balance = debt.currentBalance;
        let months = 0;
        const monthlyRate = debt.interestRate / 100 / 12;

        while (balance > 0 && months < 600) { // Max 50 years
            balance = balance * (1 + monthlyRate) - monthlyPayment;
            months++;
        }

        const date = new Date();
        date.setMonth(date.getMonth() + months);
        return date.toISOString().split('T')[0];
    }

    // Get total debt
    getTotalDebt() {
        return this.debts.reduce((sum, debt) => sum + debt.currentBalance, 0);
    }

    // Get debt-free date (if paying minimums)
    getDebtFreeDate() {
        const debts = this.debts.filter(d => d.currentBalance > 0);
        if (debts.length === 0) return null;

        let maxDate = null;
        for (const debt of debts) {
            const payoffDate = this.calculatePayoffDate(debt, debt.minimumPayment);
            if (payoffDate && (!maxDate || payoffDate > maxDate)) {
                maxDate = payoffDate;
            }
        }

        return maxDate;
    }

    // Get debt summary
    getDebtSummary() {
        const total = this.getTotalDebt();
        const totalMinimumPayments = this.debts.reduce((sum, d) => sum + d.minimumPayment, 0);
        const debtFreeDate = this.getDebtFreeDate();
        const totalInterest = this.debts.reduce((sum, d) => {
            if (d.interestRate > 0 && d.currentBalance > 0) {
                return sum + (d.currentBalance * d.interestRate / 100 / 12);
            }
            return sum;
        }, 0);

        return {
            totalDebt: total,
            totalMinimumPayments,
            monthlyInterest: totalInterest,
            debtFreeDate,
            debtCount: this.debts.filter(d => d.currentBalance > 0).length
        };
    }

    // Delete debt
    async deleteDebt(id) {
        this.debts = this.debts.filter(d => d.id !== id);
        await this.saveDebts();
    }
}

if (typeof window !== 'undefined') {
    window.DebtTrackerManager = DebtTrackerManager;
}
