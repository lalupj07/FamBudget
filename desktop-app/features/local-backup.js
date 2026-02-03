// Local Backup Manager (No Cloud)
class LocalBackupManager {
    constructor(app) {
        this.app = app;
        this.backupSchedule = null;
    }

    async init() {
        await this.loadBackupSchedule();
        this.setupScheduledBackups();
    }

    async loadBackupSchedule() {
        const stored = localStorage.getItem('fambudget_backup_schedule');
        if (stored) {
            this.backupSchedule = JSON.parse(stored);
        } else {
            this.backupSchedule = {
                enabled: false,
                frequency: 'daily', // daily, weekly, monthly
                time: '02:00',
                lastBackup: null,
                keepBackups: 30 // Keep last 30 backups
            };
        }
    }

    async saveBackupSchedule() {
        localStorage.setItem('fambudget_backup_schedule', JSON.stringify(this.backupSchedule));
    }

    // Create backup
    async createBackup() {
        try {
            const backupData = {
                transactions: this.app.data.transactions,
                accounts: this.app.data.accounts,
                goals: this.app.data.goals,
                income: this.app.data.income,
                incomeSources: this.app.data.incomeSources,
                recurringTransactions: this.app.recurringManager?.recurringTransactions || [],
                subscriptions: this.app.recurringManager?.subscriptions || [],
                templates: this.app.templatesManager?.templates || [],
                debts: this.app.debtTracker?.debts || [],
                budgetTemplates: this.app.budgetTemplatesManager?.templates || [],
                timestamp: new Date().toISOString(),
                version: '1.0'
            };

            const backupJson = JSON.stringify(backupData, null, 2);
            const blob = new Blob([backupJson], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `fambudget-backup-${new Date().toISOString().split('T')[0]}-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Save backup info
            this.backupSchedule.lastBackup = new Date().toISOString();
            await this.saveBackupSchedule();

            // Store backup metadata
            const backups = this.getBackupList();
            backups.push({
                filename: a.download,
                date: this.backupSchedule.lastBackup,
                size: blob.size
            });
            localStorage.setItem('fambudget_backup_list', JSON.stringify(backups.slice(-this.backupSchedule.keepBackups)));

            return true;
        } catch (error) {
            console.error('Backup error:', error);
            return false;
        }
    }

    // Get list of backups
    getBackupList() {
        const stored = localStorage.getItem('fambudget_backup_list');
        return stored ? JSON.parse(stored) : [];
    }

    // Setup scheduled backups
    setupScheduledBackups() {
        if (!this.backupSchedule.enabled) return;

        const now = new Date();
        const [hours, minutes] = this.backupSchedule.time.split(':');
        const backupTime = new Date();
        backupTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        if (backupTime <= now) {
            // If time has passed today, schedule for tomorrow
            backupTime.setDate(backupTime.getDate() + 1);
        }

        const msUntilBackup = backupTime - now;

        setTimeout(() => {
            this.createBackup();
            // Schedule next backup
            this.scheduleNextBackup();
        }, msUntilBackup);
    }

    scheduleNextBackup() {
        if (!this.backupSchedule.enabled) return;

        let interval;
        switch (this.backupSchedule.frequency) {
            case 'daily':
                interval = 24 * 60 * 60 * 1000;
                break;
            case 'weekly':
                interval = 7 * 24 * 60 * 60 * 1000;
                break;
            case 'monthly':
                interval = 30 * 24 * 60 * 60 * 1000;
                break;
            default:
                interval = 24 * 60 * 60 * 1000;
        }

        setInterval(() => {
            this.createBackup();
        }, interval);
    }

    // Enable/disable scheduled backups
    async setSchedule(enabled, frequency, time) {
        this.backupSchedule.enabled = enabled;
        this.backupSchedule.frequency = frequency;
        this.backupSchedule.time = time;
        await this.saveBackupSchedule();
        
        if (enabled) {
            this.setupScheduledBackups();
        }
    }
}

if (typeof window !== 'undefined') {
    window.LocalBackupManager = LocalBackupManager;
}
