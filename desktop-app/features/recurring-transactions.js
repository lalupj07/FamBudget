// Recurring Transactions Manager
class RecurringTransactionsManager {
    constructor(app) {
        this.app = app;
        this.recurringTransactions = [];
        this.subscriptions = [];
    }

    async init() {
        await this.loadRecurringTransactions();
        await this.loadSubscriptions();
        this.setupAutoCreation();
    }

    async loadRecurringTransactions() {
        const stored = localStorage.getItem('fambudget_recurring_transactions');
        if (stored) {
            this.recurringTransactions = JSON.parse(stored);
        }
    }

    async loadSubscriptions() {
        const stored = localStorage.getItem('fambudget_subscriptions');
        if (stored) {
            this.subscriptions = JSON.parse(stored);
        }
    }

    async saveRecurringTransactions() {
        localStorage.setItem('fambudget_recurring_transactions', JSON.stringify(this.recurringTransactions));
    }

    async saveSubscriptions() {
        localStorage.setItem('fambudget_subscriptions', JSON.stringify(this.subscriptions));
    }

    // Create recurring transaction
    async createRecurringTransaction(data) {
        const recurring = {
            id: Date.now(),
            description: data.description,
            amount: data.amount,
            category: data.category,
            account: data.account,
            frequency: data.frequency, // daily, weekly, monthly, yearly
            startDate: data.startDate,
            endDate: data.endDate || null,
            nextDueDate: this.calculateNextDueDate(data.startDate, data.frequency),
            lastProcessedDate: null,
            isActive: true,
            notes: data.notes || '',
            createdAt: new Date().toISOString()
        };

        this.recurringTransactions.push(recurring);
        await this.saveRecurringTransactions();
        return recurring;
    }

    // Create subscription
    async createSubscription(data) {
        const subscription = {
            id: Date.now(),
            name: data.name,
            amount: data.amount,
            category: data.category || 'Subscriptions',
            account: data.account,
            billingCycle: data.billingCycle, // monthly, yearly
            billingDay: data.billingDay || 1, // Day of month
            startDate: data.startDate,
            isActive: true,
            notes: data.notes || '',
            createdAt: new Date().toISOString()
        };

        this.subscriptions.push(subscription);
        await this.saveSubscriptions();
        return subscription;
    }

    // Calculate next due date
    calculateNextDueDate(startDate, frequency) {
        const date = new Date(startDate);
        const now = new Date();
        
        while (date <= now) {
            switch (frequency) {
                case 'daily':
                    date.setDate(date.getDate() + 1);
                    break;
                case 'weekly':
                    date.setDate(date.getDate() + 7);
                    break;
                case 'monthly':
                    date.setMonth(date.getMonth() + 1);
                    break;
                case 'yearly':
                    date.setFullYear(date.getFullYear() + 1);
                    break;
            }
        }
        
        return date.toISOString().split('T')[0];
    }

    // Check and create due transactions
    async processRecurringTransactions() {
        const today = new Date().toISOString().split('T')[0];
        let created = 0;

        for (const recurring of this.recurringTransactions) {
            if (!recurring.isActive) continue;
            if (recurring.endDate && recurring.endDate < today) continue;
            if (recurring.nextDueDate <= today) {
                // Create transaction
                const transaction = {
                    id: Date.now() + Math.random(),
                    description: recurring.description,
                    amount: recurring.amount,
                    category: recurring.category,
                    account: recurring.account,
                    date: recurring.nextDueDate,
                    notes: recurring.notes,
                    isRecurring: true,
                    recurringId: recurring.id
                };

                // Add to app's transaction list
                this.app.data.transactions.unshift(transaction);
                
                // Save to offline storage
                if (this.app.offlineStorage) {
                    await this.app.offlineStorage.save('transactions', transaction);
                }

                // Update recurring transaction
                recurring.lastProcessedDate = recurring.nextDueDate;
                recurring.nextDueDate = this.calculateNextDueDate(recurring.nextDueDate, recurring.frequency);
                created++;
            }
        }

        if (created > 0) {
            await this.saveRecurringTransactions();
            this.app.renderTransactions();
            this.app.updatePeriodTotals();
        }

        return created;
    }

    // Setup auto-creation check (runs daily)
    setupAutoCreation() {
        // Check on app start
        this.processRecurringTransactions();
        
        // Check daily at midnight
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const msUntilMidnight = tomorrow - now;
        
        setTimeout(() => {
            this.processRecurringTransactions();
            // Then check every 24 hours
            setInterval(() => {
                this.processRecurringTransactions();
            }, 24 * 60 * 60 * 1000);
        }, msUntilMidnight);
    }

    // Get upcoming bills
    getUpcomingBills(days = 30) {
        const upcoming = [];
        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setDate(futureDate.getDate() + days);

        for (const recurring of this.recurringTransactions) {
            if (!recurring.isActive) continue;
            const dueDate = new Date(recurring.nextDueDate);
            if (dueDate <= futureDate && dueDate >= today) {
                upcoming.push({
                    ...recurring,
                    daysUntil: Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
                });
            }
        }

        for (const sub of this.subscriptions) {
            if (!sub.isActive) continue;
            const nextBill = this.getNextBillingDate(sub);
            const dueDate = new Date(nextBill);
            if (dueDate <= futureDate && dueDate >= today) {
                upcoming.push({
                    ...sub,
                    nextDueDate: nextBill,
                    daysUntil: Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
                });
            }
        }

        return upcoming.sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate));
    }

    // Get next billing date for subscription
    getNextBillingDate(subscription) {
        const today = new Date();
        const billingDay = subscription.billingDay || 1;
        let nextBill = new Date(today.getFullYear(), today.getMonth(), billingDay);

        if (nextBill < today) {
            if (subscription.billingCycle === 'monthly') {
                nextBill.setMonth(nextBill.getMonth() + 1);
            } else if (subscription.billingCycle === 'yearly') {
                nextBill.setFullYear(nextBill.getFullYear() + 1);
            }
        }

        return nextBill.toISOString().split('T')[0];
    }

    // Delete recurring transaction
    async deleteRecurringTransaction(id) {
        this.recurringTransactions = this.recurringTransactions.filter(rt => rt.id !== id);
        await this.saveRecurringTransactions();
    }

    // Delete subscription
    async deleteSubscription(id) {
        this.subscriptions = this.subscriptions.filter(sub => sub.id !== id);
        await this.saveSubscriptions();
    }

    // Toggle active status
    async toggleRecurringTransaction(id) {
        const recurring = this.recurringTransactions.find(rt => rt.id === id);
        if (recurring) {
            recurring.isActive = !recurring.isActive;
            await this.saveRecurringTransactions();
        }
    }

    async toggleSubscription(id) {
        const sub = this.subscriptions.find(s => s.id === id);
        if (sub) {
            sub.isActive = !sub.isActive;
            await this.saveSubscriptions();
        }
    }
}

if (typeof window !== 'undefined') {
    window.RecurringTransactionsManager = RecurringTransactionsManager;
}
