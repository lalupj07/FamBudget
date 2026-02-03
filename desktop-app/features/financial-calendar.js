// Financial Calendar Manager
class FinancialCalendarManager {
    constructor(app) {
        this.app = app;
    }

    // Get transactions for a specific month
    getTransactionsForMonth(year, month) {
        const startDate = new Date(year, month, 1).toISOString().split('T')[0];
        const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
        
        return this.app.data.transactions.filter(t => 
            t.date >= startDate && t.date <= endDate
        );
    }

    // Get transactions for a specific date
    getTransactionsForDate(date) {
        return this.app.data.transactions.filter(t => t.date === date);
    }

    // Get calendar data for a month
    getCalendarData(year, month) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const calendar = [];

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            calendar.push({ date: null, transactions: [], income: 0, expenses: 0 });
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day).toISOString().split('T')[0];
            const transactions = this.getTransactionsForDate(date);
            const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
            const expenses = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));

            calendar.push({
                date,
                day,
                transactions,
                income,
                expenses,
                net: income - expenses
            });
        }

        return calendar;
    }

    // Get upcoming bills for calendar
    getUpcomingBillsForCalendar(year, month) {
        if (!this.app.recurringManager) return [];
        
        const bills = this.app.recurringManager.getUpcomingBills(60);
        const startDate = new Date(year, month, 1).toISOString().split('T')[0];
        const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
        
        return bills.filter(bill => 
            bill.nextDueDate >= startDate && bill.nextDueDate <= endDate
        );
    }

    // Get heatmap data (spending intensity)
    getSpendingHeatmap(year, month) {
        const calendar = this.getCalendarData(year, month);
        const maxSpending = Math.max(...calendar.map(day => day.expenses || 0));
        
        return calendar.map(day => ({
            ...day,
            intensity: maxSpending > 0 ? (day.expenses / maxSpending) : 0
        }));
    }
}

if (typeof window !== 'undefined') {
    window.FinancialCalendarManager = FinancialCalendarManager;
}
