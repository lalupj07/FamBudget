// FamBudget Desktop App JavaScript
class FamBudgetApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.data = {
            dashboard: null,
            transactions: [],
            accounts: [],
            goals: [],
            reports: null
        };
        this.isDarkTheme = false;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.loadTheme();
        await this.loadData();
        this.render();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.navigateToSection(section);
            });
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Add transaction buttons
        document.getElementById('addTransactionBtn').addEventListener('click', () => {
            this.showModal('transactionModal');
        });

        document.getElementById('addTransactionBtn2').addEventListener('click', () => {
            this.showModal('transactionModal');
        });

        // Add account button
        document.getElementById('addAccountBtn').addEventListener('click', () => {
            this.showModal('accountModal');
        });

        // Add goal button
        document.getElementById('addGoalBtn').addEventListener('click', () => {
            this.showModal('goalModal');
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideModal();
            });
        });

        // Modal overlay click
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'modalOverlay') {
                this.hideModal();
            }
        });

        // Form submissions
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });

        document.getElementById('accountForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addAccount();
        });

        document.getElementById('goalForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addGoal();
        });

        // Cancel buttons
        document.getElementById('cancelTransaction').addEventListener('click', () => {
            this.hideModal();
        });

        document.getElementById('cancelAccount').addEventListener('click', () => {
            this.hideModal();
        });

        document.getElementById('cancelGoal').addEventListener('click', () => {
            this.hideModal();
        });

        // Import button
        document.getElementById('importBtn').addEventListener('click', () => {
            this.importData();
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });

        // Date range change
        document.getElementById('dateRange').addEventListener('change', () => {
            this.loadDashboardData();
        });

        // Electron menu events
        if (window.electronAPI) {
            window.electronAPI.onMenuNewTransaction(() => {
                this.showModal('transactionModal');
            });

            window.electronAPI.onMenuImportData((event, filePath) => {
                this.importDataFromFile(filePath);
            });
        }
    }

    async loadData() {
        try {
            // Load dashboard data
            await this.loadDashboardData();
            
            // Load transactions
            await this.loadTransactions();
            
            // Load accounts
            await this.loadAccounts();
            
            // Load goals
            await this.loadGoals();
            
            // Load reports
            await this.loadReports();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    async loadDashboardData() {
        try {
            const response = await fetch('http://localhost:3001/api/dashboard');
            this.data.dashboard = await response.json();
            this.renderDashboard();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            // Use mock data if API fails
            this.data.dashboard = {
                totalIncome: 5000,
                totalExpenses: 3200,
                netChange: 1800,
                savingsRate: 36,
                recentTransactions: [
                    { id: 1, description: 'Grocery Shopping', amount: -150, category: 'Food', date: '2024-01-15' },
                    { id: 2, description: 'Salary', amount: 5000, category: 'Income', date: '2024-01-14' },
                    { id: 3, description: 'Gas Bill', amount: -80, category: 'Utilities', date: '2024-01-13' }
                ],
                budgetCategories: [
                    { name: 'Food', budget: 800, spent: 450, remaining: 350 },
                    { name: 'Utilities', budget: 300, spent: 280, remaining: 20 },
                    { name: 'Entertainment', budget: 200, spent: 120, remaining: 80 }
                ]
            };
            this.renderDashboard();
        }
    }

    async loadTransactions() {
        try {
            const response = await fetch('http://localhost:3001/api/transactions');
            this.data.transactions = await response.json();
            this.renderTransactions();
        } catch (error) {
            console.error('Error loading transactions:', error);
            // Use mock data if API fails
            this.data.transactions = [
                { id: 1, description: 'Grocery Shopping', amount: -150, category: 'Food', date: '2024-01-15', account: 'Checking' },
                { id: 2, description: 'Salary', amount: 5000, category: 'Income', date: '2024-01-14', account: 'Checking' },
                { id: 3, description: 'Gas Bill', amount: -80, category: 'Utilities', date: '2024-01-13', account: 'Checking' },
                { id: 4, description: 'Movie Tickets', amount: -25, category: 'Entertainment', date: '2024-01-12', account: 'Checking' },
                { id: 5, description: 'Coffee', amount: -5, category: 'Food', date: '2024-01-11', account: 'Checking' }
            ];
            this.renderTransactions();
        }
    }

    async loadAccounts() {
        try {
            const response = await fetch('http://localhost:3001/api/accounts');
            this.data.accounts = await response.json();
            this.renderAccounts();
            this.updateAccountSelects();
        } catch (error) {
            console.error('Error loading accounts:', error);
            // Use mock data if API fails
            this.data.accounts = [
                { id: 1, name: 'Checking Account', type: 'checking', balance: 2500, color: '#1976d2' },
                { id: 2, name: 'Savings Account', type: 'savings', balance: 15000, color: '#388e3c' },
                { id: 3, name: 'Credit Card', type: 'credit', balance: -800, color: '#d32f2f' }
            ];
            this.renderAccounts();
            this.updateAccountSelects();
        }
    }

    async loadGoals() {
        try {
            const response = await fetch('http://localhost:3001/api/goals');
            this.data.goals = await response.json();
            this.renderGoals();
        } catch (error) {
            console.error('Error loading goals:', error);
            // Use mock data if API fails
            this.data.goals = [
                { id: 1, name: 'Emergency Fund', target: 10000, current: 7500, deadline: '2024-12-31', priority: 'high' },
                { id: 2, name: 'Vacation', target: 3000, current: 1200, deadline: '2024-06-30', priority: 'medium' },
                { id: 3, name: 'New Car', target: 25000, current: 5000, deadline: '2025-03-31', priority: 'low' }
            ];
            this.renderGoals();
        }
    }

    async loadReports() {
        try {
            const response = await fetch('http://localhost:3001/api/reports');
            this.data.reports = await response.json();
            this.renderReports();
        } catch (error) {
            console.error('Error loading reports:', error);
            // Use mock data if API fails
            this.data.reports = {
                monthlyIncome: 5000,
                monthlyExpenses: 3200,
                categoryBreakdown: {
                    'Food': 450,
                    'Utilities': 280,
                    'Entertainment': 120,
                    'Transportation': 200,
                    'Healthcare': 150
                },
                trends: [
                    { month: 'Jan', income: 5000, expenses: 3200 },
                    { month: 'Feb', income: 5000, expenses: 3100 },
                    { month: 'Mar', income: 5000, expenses: 3300 }
                ]
            };
            this.renderReports();
        }
    }

    navigateToSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        this.currentSection = section;
    }

    render() {
        this.renderDashboard();
        this.renderTransactions();
        this.renderAccounts();
        this.renderGoals();
        this.renderReports();
    }

    renderDashboard() {
        if (!this.data.dashboard) return;

        const { totalIncome, totalExpenses, netChange, savingsRate, recentTransactions, budgetCategories } = this.data.dashboard;

        // Update summary cards
        document.getElementById('totalIncome').textContent = `$${totalIncome.toLocaleString()}`;
        document.getElementById('totalExpenses').textContent = `$${totalExpenses.toLocaleString()}`;
        document.getElementById('netChange').textContent = `$${netChange.toLocaleString()}`;
        document.getElementById('savingsRate').textContent = `${savingsRate}%`;

        // Render recent transactions
        const recentTransactionsContainer = document.getElementById('recentTransactions');
        recentTransactionsContainer.innerHTML = recentTransactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-category">${transaction.category}</div>
                </div>
                <div class="transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}">
                    ${transaction.amount > 0 ? '+' : ''}$${Math.abs(transaction.amount)}
                </div>
            </div>
        `).join('');

        // Render budget categories
        const budgetCategoriesContainer = document.getElementById('budgetCategories');
        budgetCategoriesContainer.innerHTML = budgetCategories.map(category => {
            const percentage = (category.spent / category.budget) * 100;
            return `
                <div class="budget-category">
                    <div class="budget-category-info">
                        <div class="budget-category-name">${category.name}</div>
                        <div class="budget-category-amounts">
                            $${category.spent} / $${category.budget} ($${category.remaining} remaining)
                        </div>
                    </div>
                    <div class="budget-progress">
                        <div class="budget-progress-bar" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                </div>
            `;
        }).join('');

        // Render category chart (placeholder)
        const categoryChart = document.getElementById('categoryChart');
        categoryChart.innerHTML = '<div style="text-align: center; color: #666;">Category Chart<br><small>Visual representation of spending by category</small></div>';
    }

    renderTransactions() {
        const tbody = document.getElementById('transactionsTableBody');
        tbody.innerHTML = this.data.transactions.map(transaction => `
            <tr>
                <td>${new Date(transaction.date).toLocaleDateString()}</td>
                <td>${transaction.description}</td>
                <td>${transaction.category}</td>
                <td>${transaction.account}</td>
                <td class="${transaction.amount > 0 ? 'positive' : 'negative'}">
                    ${transaction.amount > 0 ? '+' : ''}$${Math.abs(transaction.amount)}
                </td>
                <td>
                    <button class="btn btn-secondary" onclick="app.editTransaction(${transaction.id})">Edit</button>
                    <button class="btn btn-secondary" onclick="app.deleteTransaction(${transaction.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    renderAccounts() {
        const accountsGrid = document.getElementById('accountsGrid');
        accountsGrid.innerHTML = this.data.accounts.map(account => `
            <div class="account-card">
                <div class="account-header">
                    <div class="account-name">${account.name}</div>
                    <div class="account-type">${account.type}</div>
                </div>
                <div class="account-balance ${account.balance >= 0 ? 'positive' : 'negative'}">
                    $${Math.abs(account.balance).toLocaleString()}
                </div>
                <div class="account-actions">
                    <button class="btn btn-secondary" onclick="app.editAccount(${account.id})">Edit</button>
                    <button class="btn btn-secondary" onclick="app.deleteAccount(${account.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    renderGoals() {
        const goalsGrid = document.getElementById('goalsGrid');
        goalsGrid.innerHTML = this.data.goals.map(goal => {
            const percentage = (goal.current / goal.target) * 100;
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            return `
                <div class="goal-card">
                    <div class="goal-header">
                        <div class="goal-name">${goal.name}</div>
                        <div class="goal-priority ${goal.priority}">${goal.priority}</div>
                    </div>
                    <div class="goal-amount">
                        $${goal.current.toLocaleString()} / $${goal.target.toLocaleString()}
                    </div>
                    <div class="goal-progress">
                        <div class="goal-progress-bar">
                            <div class="goal-progress-fill" style="width: ${Math.min(percentage, 100)}%"></div>
                        </div>
                        <div class="goal-progress-text">
                            ${percentage.toFixed(1)}% complete • ${daysLeft} days left
                        </div>
                    </div>
                    <div class="goal-actions">
                        <button class="btn btn-secondary" onclick="app.editGoal(${goal.id})">Edit</button>
                        <button class="btn btn-secondary" onclick="app.deleteGoal(${goal.id})">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderReports() {
        if (!this.data.reports) return;

        // Render trends chart (placeholder)
        const trendsChart = document.getElementById('trendsChart');
        trendsChart.innerHTML = '<div style="text-align: center; color: #666;">Monthly Trends Chart<br><small>Income vs Expenses over time</small></div>';

        // Render breakdown chart (placeholder)
        const breakdownChart = document.getElementById('breakdownChart');
        breakdownChart.innerHTML = '<div style="text-align: center; color: #666;">Category Breakdown Chart<br><small>Spending by category</small></div>';
    }

    updateAccountSelects() {
        const selects = document.querySelectorAll('#transactionAccount, #accountFilter');
        selects.forEach(select => {
            select.innerHTML = '<option value="">Select Account</option>' +
                this.data.accounts.map(account => 
                    `<option value="${account.id}">${account.name}</option>`
                ).join('');
        });
    }

    showModal(modalId) {
        document.getElementById('modalOverlay').classList.add('active');
        document.getElementById(modalId).style.display = 'block';
        
        // Set today's date for date inputs
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('transactionDate').value = today;
        document.getElementById('goalDeadline').value = today;
    }

    hideModal() {
        document.getElementById('modalOverlay').classList.remove('active');
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        
        // Reset forms
        document.getElementById('transactionForm').reset();
        document.getElementById('accountForm').reset();
        document.getElementById('goalForm').reset();
    }

    async addTransaction() {
        const formData = {
            description: document.getElementById('transactionDescription').value,
            amount: parseFloat(document.getElementById('transactionAmount').value),
            category: document.getElementById('transactionCategory').value,
            account: document.getElementById('transactionAccount').value,
            date: document.getElementById('transactionDate').value
        };

        // Add to local data
        const newTransaction = {
            id: Date.now(),
            ...formData,
            account: this.data.accounts.find(acc => acc.id == formData.account)?.name || 'Unknown'
        };

        this.data.transactions.unshift(newTransaction);
        this.renderTransactions();
        this.hideModal();

        // Show success message
        this.showMessage('Transaction added successfully!');
    }

    async addAccount() {
        const formData = {
            name: document.getElementById('accountName').value,
            type: document.getElementById('accountType').value,
            balance: parseFloat(document.getElementById('accountBalance').value),
            color: document.getElementById('accountColor').value
        };

        // Add to local data
        const newAccount = {
            id: Date.now(),
            ...formData
        };

        this.data.accounts.push(newAccount);
        this.renderAccounts();
        this.updateAccountSelects();
        this.hideModal();

        // Show success message
        this.showMessage('Account added successfully!');
    }

    async addGoal() {
        const formData = {
            name: document.getElementById('goalName').value,
            target: parseFloat(document.getElementById('goalTarget').value),
            current: parseFloat(document.getElementById('goalCurrent').value),
            deadline: document.getElementById('goalDeadline').value,
            priority: document.getElementById('goalPriority').value
        };

        // Add to local data
        const newGoal = {
            id: Date.now(),
            ...formData
        };

        this.data.goals.push(newGoal);
        this.renderGoals();
        this.hideModal();

        // Show success message
        this.showMessage('Goal added successfully!');
    }

    editTransaction(id) {
        const transaction = this.data.transactions.find(t => t.id === id);
        if (transaction) {
            // Populate form and show modal
            document.getElementById('transactionDescription').value = transaction.description;
            document.getElementById('transactionAmount').value = Math.abs(transaction.amount);
            document.getElementById('transactionCategory').value = transaction.category;
            document.getElementById('transactionDate').value = transaction.date;
            this.showModal('transactionModal');
        }
    }

    deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.data.transactions = this.data.transactions.filter(t => t.id !== id);
            this.renderTransactions();
            this.showMessage('Transaction deleted successfully!');
        }
    }

    editAccount(id) {
        const account = this.data.accounts.find(a => a.id === id);
        if (account) {
            // Populate form and show modal
            document.getElementById('accountName').value = account.name;
            document.getElementById('accountType').value = account.type;
            document.getElementById('accountBalance').value = account.balance;
            document.getElementById('accountColor').value = account.color;
            this.showModal('accountModal');
        }
    }

    deleteAccount(id) {
        if (confirm('Are you sure you want to delete this account?')) {
            this.data.accounts = this.data.accounts.filter(a => a.id !== id);
            this.renderAccounts();
            this.updateAccountSelects();
            this.showMessage('Account deleted successfully!');
        }
    }

    editGoal(id) {
        const goal = this.data.goals.find(g => g.id === id);
        if (goal) {
            // Populate form and show modal
            document.getElementById('goalName').value = goal.name;
            document.getElementById('goalTarget').value = goal.target;
            document.getElementById('goalCurrent').value = goal.current;
            document.getElementById('goalDeadline').value = goal.deadline;
            document.getElementById('goalPriority').value = goal.priority;
            this.showModal('goalModal');
        }
    }

    deleteGoal(id) {
        if (confirm('Are you sure you want to delete this goal?')) {
            this.data.goals = this.data.goals.filter(g => g.id !== id);
            this.renderGoals();
            this.showMessage('Goal deleted successfully!');
        }
    }

    async importData() {
        if (window.electronAPI) {
            const result = await window.electronAPI.showOpenDialog({
                properties: ['openFile'],
                filters: [
                    { name: 'CSV Files', extensions: ['csv'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });

            if (!result.canceled) {
                this.importDataFromFile(result.filePaths[0]);
            }
        } else {
            this.showMessage('Import functionality requires the desktop app');
        }
    }

    importDataFromFile(filePath) {
        // Mock import functionality
        this.showMessage(`Importing data from: ${filePath}`);
    }

    async exportData() {
        if (window.electronAPI) {
            const result = await window.electronAPI.showSaveDialog({
                defaultPath: 'fambudget-export.csv',
                filters: [
                    { name: 'CSV Files', extensions: ['csv'] },
                    { name: 'JSON Files', extensions: ['json'] }
                ]
            });

            if (!result.canceled) {
                // Mock export functionality
                this.showMessage(`Exporting data to: ${result.filePath}`);
            }
        } else {
            this.showMessage('Export functionality requires the desktop app');
        }
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        document.body.classList.toggle('dark-theme', this.isDarkTheme);
        localStorage.setItem('fambudget-theme', this.isDarkTheme ? 'dark' : 'light');
        
        // Update theme toggle icon
        const themeIcon = document.querySelector('#themeToggle .material-icons');
        themeIcon.textContent = this.isDarkTheme ? 'light_mode' : 'dark_mode';
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('fambudget-theme');
        this.isDarkTheme = savedTheme === 'dark';
        document.body.classList.toggle('dark-theme', this.isDarkTheme);
        
        // Update theme toggle icon
        const themeIcon = document.querySelector('#themeToggle .material-icons');
        themeIcon.textContent = this.isDarkTheme ? 'light_mode' : 'dark_mode';
    }

    showMessage(message) {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 3000;
            animation: slideIn 0.3s ease-out;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FamBudgetApp();
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .transaction-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #eee;
    }
    
    .transaction-item:last-child {
        border-bottom: none;
    }
    
    .transaction-info {
        flex: 1;
    }
    
    .transaction-description {
        font-weight: 500;
        color: #333;
    }
    
    .transaction-category {
        font-size: 12px;
        color: #666;
        margin-top: 2px;
    }
    
    .transaction-amount {
        font-weight: 600;
    }
    
    .transaction-amount.positive {
        color: #4caf50;
    }
    
    .transaction-amount.negative {
        color: #f44336;
    }
    
    .account-actions,
    .goal-actions {
        margin-top: 16px;
        display: flex;
        gap: 8px;
    }
    
    body.dark-theme .transaction-description {
        color: #fff;
    }
    
    body.dark-theme .transaction-category {
        color: #ccc;
    }
    
    body.dark-theme .transaction-item {
        border-bottom-color: #555;
    }
`;
document.head.appendChild(style);
