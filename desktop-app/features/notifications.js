// Notifications Manager
class NotificationsManager {
    constructor(app) {
        this.app = app;
        this.notifications = [];
        this.preferences = {
            budgetAlerts: true,
            billReminders: true,
            lowBalance: true,
            goalMilestones: true,
            weeklySummary: true
        };
    }

    async init() {
        await this.loadPreferences();
        this.setupNotificationChecks();
    }

    async loadPreferences() {
        const stored = localStorage.getItem('fambudget_notification_preferences');
        if (stored) {
            this.preferences = { ...this.preferences, ...JSON.parse(stored) };
        }
    }

    async savePreferences() {
        localStorage.setItem('fambudget_notification_preferences', JSON.stringify(this.preferences));
    }

    // Show notification
    showNotification(title, message, type = 'info', actions = []) {
        const notification = {
            id: Date.now(),
            title,
            message,
            type, // info, warning, error, success
            actions,
            timestamp: new Date().toISOString(),
            read: false
        };

        this.notifications.unshift(notification);
        this.saveNotifications();
        this.displayNotification(notification);
        return notification;
    }

    // Display notification in UI
    displayNotification(notification) {
        // Create notification element
        const notificationEl = document.createElement('div');
        notificationEl.className = `notification notification-${notification.type}`;
        notificationEl.innerHTML = `
            <div class="notification-content">
                <span class="material-icons">${this.getIconForType(notification.type)}</span>
                <div class="notification-text">
                    <strong>${notification.title}</strong>
                    <p>${notification.message}</p>
                </div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <span class="material-icons">close</span>
                </button>
            </div>
        `;

        // Add to notification container
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }

        container.appendChild(notificationEl);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notificationEl.parentElement) {
                notificationEl.remove();
            }
        }, 5000);
    }

    getIconForType(type) {
        const icons = {
            info: 'info',
            warning: 'warning',
            error: 'error',
            success: 'check_circle'
        };
        return icons[type] || 'info';
    }

    // Check budget warnings
    checkBudgetWarnings() {
        if (!this.preferences.budgetAlerts) return;

        const warnings = this.app.budgetWarnings || [];
        for (const warning of warnings) {
            if (warning.severity === 'high') {
                this.showNotification(
                    'Budget Exceeded',
                    `${warning.category} is ${warning.percentage}% over budget`,
                    'error'
                );
            } else if (warning.severity === 'medium') {
                this.showNotification(
                    'Budget Warning',
                    `${warning.category} is ${warning.percentage}% of budget`,
                    'warning'
                );
            }
        }
    }

    // Check low balance
    checkLowBalance() {
        if (!this.preferences.lowBalance) return;

        for (const account of this.app.data.accounts || []) {
            if (account.balance < 100 && account.balance >= 0) {
                this.showNotification(
                    'Low Balance Alert',
                    `${account.name} balance is ${this.app.formatCurrency(account.balance)}`,
                    'warning'
                );
            } else if (account.balance < 0) {
                this.showNotification(
                    'Negative Balance',
                    `${account.name} is overdrawn by ${this.app.formatCurrency(Math.abs(account.balance))}`,
                    'error'
                );
            }
        }
    }

    // Check upcoming bills
    checkUpcomingBills() {
        if (!this.preferences.billReminders) return;

        if (this.app.recurringManager) {
            const upcoming = this.app.recurringManager.getUpcomingBills(7); // Next 7 days
            for (const bill of upcoming) {
                if (bill.daysUntil <= 3) {
                    this.showNotification(
                        'Upcoming Bill',
                        `${bill.description || bill.name} due in ${bill.daysUntil} day(s)`,
                        'info'
                    );
                }
            }
        }
    }

    // Check goal milestones
    checkGoalMilestones() {
        if (!this.preferences.goalMilestones) return;

        for (const goal of this.app.data.goals || []) {
            const percentage = (goal.current / goal.target) * 100;
            const milestones = [25, 50, 75, 100];
            
            for (const milestone of milestones) {
                if (percentage >= milestone && percentage < milestone + 5) {
                    this.showNotification(
                        'Goal Milestone',
                        `${goal.name} is ${milestone}% complete!`,
                        'success'
                    );
                    break;
                }
            }
        }
    }

    // Setup periodic checks
    setupNotificationChecks() {
        // Check every hour
        setInterval(() => {
            this.checkBudgetWarnings();
            this.checkLowBalance();
            this.checkUpcomingBills();
            this.checkGoalMilestones();
        }, 60 * 60 * 1000);

        // Initial check
        setTimeout(() => {
            this.checkBudgetWarnings();
            this.checkLowBalance();
            this.checkUpcomingBills();
            this.checkGoalMilestones();
        }, 5000);
    }

    // Save notifications
    saveNotifications() {
        // Keep only last 100 notifications
        this.notifications = this.notifications.slice(0, 100);
        localStorage.setItem('fambudget_notifications', JSON.stringify(this.notifications));
    }

    // Get unread count
    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    // Mark as read
    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
        }
    }

    // Clear all notifications
    clearAll() {
        this.notifications = [];
        this.saveNotifications();
    }
}

if (typeof window !== 'undefined') {
    window.NotificationsManager = NotificationsManager;
}
