// FamBudget Desktop App JavaScript
class FamBudgetApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.data = {
            dashboard: null,
            transactions: [],
            accounts: [],
            goals: [],
            reports: null,
            income: [],
            incomeSources: []
        };
        this.isDarkTheme = false;
        this.selectedCurrency = 'USD';
        
        // Chart instances
        this.categoryChart = null;
        this.trendsChart = null;
        this.breakdownChart = null;
        
        // Currency formatting configurations
        this.currencyConfig = {
            USD: { symbol: '$', position: 'before', decimals: 2 },
            EUR: { symbol: '€', position: 'after', decimals: 2 },
            GBP: { symbol: '£', position: 'before', decimals: 2 },
            JPY: { symbol: '¥', position: 'before', decimals: 0 },
            CAD: { symbol: 'C$', position: 'before', decimals: 2 },
            AUD: { symbol: 'A$', position: 'before', decimals: 2 },
            CHF: { symbol: 'CHF', position: 'after', decimals: 2 },
            CNY: { symbol: '¥', position: 'before', decimals: 2 },
            INR: { symbol: '₹', position: 'before', decimals: 2 },
            BRL: { symbol: 'R$', position: 'before', decimals: 2 }
        };
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.loadTheme();
        this.loadCurrency();
        await this.loadData();
        this.render();
    }

    setupEventListeners() {
        // Navigation (direct bindings)
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.navigateToSection(section);
            });
        });

        // Navigation (event delegation fallback)
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.addEventListener('click', (e) => {
                const btn = e.target.closest('.nav-item');
                if (!btn) return;
                e.preventDefault();
                const section = btn.dataset.section;
                this.navigateToSection(section);
            });
        }

        // Theme toggle
        const themeToggleEl = document.getElementById('themeToggle');
        if (themeToggleEl) {
            themeToggleEl.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Currency selection
        const currencySelectEl = document.getElementById('currencySelect');
        if (currencySelectEl) {
            currencySelectEl.addEventListener('change', (e) => {
                this.changeCurrency(e.target.value);
            });
        }

        // Add transaction buttons
        const addTransactionBtnEl = document.getElementById('addTransactionBtn');
        if (addTransactionBtnEl) {
            addTransactionBtnEl.addEventListener('click', () => {
                this.showModal('transactionModal');
            });
        }

        const addTransactionBtn2El = document.getElementById('addTransactionBtn2');
        if (addTransactionBtn2El) {
            addTransactionBtn2El.addEventListener('click', () => {
                this.showModal('transactionModal');
            });
        }

        // Add account button
        const addAccountBtnEl = document.getElementById('addAccountBtn');
        if (addAccountBtnEl) {
            addAccountBtnEl.addEventListener('click', () => {
                this.showModal('accountModal');
            });
        }

        // Add goal button
        const addGoalBtnEl = document.getElementById('addGoalBtn');
        if (addGoalBtnEl) {
            addGoalBtnEl.addEventListener('click', () => {
                this.showModal('goalModal');
            });
        }

        // Add income buttons
        const addIncomeBtnEl = document.getElementById('addIncomeBtn');
        if (addIncomeBtnEl) {
            addIncomeBtnEl.addEventListener('click', () => {
                this.showModal('incomeModal');
            });
        }

        const addIncomeSourceBtnEl = document.getElementById('addIncomeSourceBtn');
        if (addIncomeSourceBtnEl) {
            addIncomeSourceBtnEl.addEventListener('click', () => {
                this.showModal('incomeSourceModal');
            });
        }

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideModal();
            });
        });

        // Modal overlay click
        const modalOverlayEl = document.getElementById('modalOverlay');
        if (modalOverlayEl) {
            modalOverlayEl.addEventListener('click', (e) => {
                if (e.target.id === 'modalOverlay') {
                    this.hideModal();
                }
            });
        }

        // Form submissions
        const transactionFormEl = document.getElementById('transactionForm');
        if (transactionFormEl) {
            transactionFormEl.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addTransaction();
            });
        }

        const accountFormEl = document.getElementById('accountForm');
        if (accountFormEl) {
            accountFormEl.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addAccount();
            });
        }

        const goalFormEl = document.getElementById('goalForm');
        if (goalFormEl) {
            goalFormEl.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addGoal();
            });
        }

        const incomeFormEl = document.getElementById('incomeForm');
        if (incomeFormEl) {
            incomeFormEl.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addIncome();
            });
        }

        const incomeSourceFormEl = document.getElementById('incomeSourceForm');
        if (incomeSourceFormEl) {
            incomeSourceFormEl.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addIncomeSource();
            });
        }

        // Cancel buttons
        const cancelTransactionEl = document.getElementById('cancelTransaction');
        if (cancelTransactionEl) {
            cancelTransactionEl.addEventListener('click', () => {
                this.hideModal();
            });
        }

        const cancelAccountEl = document.getElementById('cancelAccount');
        if (cancelAccountEl) {
            cancelAccountEl.addEventListener('click', () => {
                this.hideModal();
            });
        }

        const cancelGoalEl = document.getElementById('cancelGoal');
        if (cancelGoalEl) {
            cancelGoalEl.addEventListener('click', () => {
                this.hideModal();
            });
        }

        const cancelIncomeEl = document.getElementById('cancelIncome');
        if (cancelIncomeEl) {
            cancelIncomeEl.addEventListener('click', () => {
                this.hideModal();
            });
        }

        const cancelIncomeSourceEl = document.getElementById('cancelIncomeSource');
        if (cancelIncomeSourceEl) {
            cancelIncomeSourceEl.addEventListener('click', () => {
                this.hideModal();
            });
        }

        // Import button
        const importBtnEl = document.getElementById('importBtn');
        if (importBtnEl) {
            importBtnEl.addEventListener('click', () => {
                this.importData();
            });
        }

        // Export button
        const exportBtnEl = document.getElementById('exportBtn');
        if (exportBtnEl) {
            exportBtnEl.addEventListener('click', () => {
                this.exportData();
            });
        }

        // Date range change
        const dateRangeEl = document.getElementById('dateRange');
        if (dateRangeEl) {
            dateRangeEl.addEventListener('change', () => {
                this.loadDashboardData();
            });
        }

        // Income type change
        const incomeTypeEl = document.getElementById('incomeType');
        if (incomeTypeEl) {
            incomeTypeEl.addEventListener('change', (e) => {
                const recurringFields = document.getElementById('recurringFields');
                if (!recurringFields) return;
                if (e.target.value === 'recurring') {
                    recurringFields.style.display = 'block';
                } else {
                    recurringFields.style.display = 'none';
                }
            });
        }

        // Filters
        const accountFilterEl = document.getElementById('accountFilter');
        if (accountFilterEl) {
            accountFilterEl.addEventListener('change', () => {
                this.renderTransactions();
            });
        }

        const categoryFilterEl = document.getElementById('categoryFilter');
        if (categoryFilterEl) {
            categoryFilterEl.addEventListener('change', () => {
                this.renderTransactions();
            });
        }

        const incomeSourceFilterEl = document.getElementById('incomeSourceFilter');
        if (incomeSourceFilterEl) {
            incomeSourceFilterEl.addEventListener('change', () => {
                this.renderIncome();
            });
        }

        // Dashboard interactions
        const summaryCards = document.querySelector('.summary-cards');
        if (summaryCards) {
            summaryCards.addEventListener('click', (e) => {
                const card = e.target.closest('.summary-card');
                if (!card) return;
                if (card.classList.contains('income')) this.navigateToSection('income');
                else if (card.classList.contains('expense')) this.navigateToSection('transactions');
                else if (card.classList.contains('savings')) this.navigateToSection('reports');
                else if (card.classList.contains('rate')) this.navigateToSection('reports');
            });
        }

        const recentTxn = document.getElementById('recentTransactions');
        if (recentTxn) {
            recentTxn.addEventListener('click', (e) => {
                const item = e.target.closest('.transaction-item');
                if (!item) return;
                this.navigateToSection('transactions');
            });
        }

        const budgetCats = document.getElementById('budgetCategories');
        if (budgetCats) {
            budgetCats.addEventListener('click', (e) => {
                const item = e.target.closest('.budget-category');
                if (!item) return;
                this.navigateToSection('transactions');
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
            
            // Load income data
            await this.loadIncome();
            await this.loadIncomeSources();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    async loadDashboardData() {
        // Try to load from localStorage first
        const savedDashboard = localStorage.getItem('fambudget-dashboard');
        if (savedDashboard) {
            try {
                this.data.dashboard = JSON.parse(savedDashboard);
                this.renderDashboard();
                return;
            } catch (error) {
                console.error('Error parsing saved dashboard data:', error);
            }
        }

        // Use comprehensive demo data for visual representation (fallback)
        this.data.dashboard = {
            totalIncome: 8750,
            totalExpenses: 6230,
            netChange: 2520,
            savingsRate: 29,
            recentTransactions: [
                { id: 1, description: 'Monthly Salary - John', amount: 4500, category: 'Income', date: '2024-01-15' },
                { id: 2, description: 'Freelance Project', amount: 1200, category: 'Income', date: '2024-01-14' },
                { id: 3, description: 'Whole Foods Grocery', amount: -185, category: 'Food', date: '2024-01-14' },
                { id: 4, description: 'Electric Bill', amount: -145, category: 'Utilities', date: '2024-01-13' },
                { id: 5, description: 'Netflix Subscription', amount: -15, category: 'Entertainment', date: '2024-01-12' },
                { id: 6, description: 'Gas Station', amount: -65, category: 'Transportation', date: '2024-01-12' },
                { id: 7, description: 'Coffee Shop', amount: -8, category: 'Food', date: '2024-01-11' },
                { id: 8, description: 'Investment Dividends', amount: 245, category: 'Income', date: '2024-01-10' },
                { id: 9, description: 'Target Shopping', amount: -89, category: 'Shopping', date: '2024-01-10' },
                { id: 10, description: 'Gym Membership', amount: -45, category: 'Health & Fitness', date: '2024-01-09' }
            ],
            budgetCategories: [
                { name: 'Food & Dining', budget: 800, spent: 487, remaining: 313 },
                { name: 'Utilities', budget: 400, spent: 345, remaining: 55 },
                { name: 'Transportation', budget: 500, spent: 312, remaining: 188 },
                { name: 'Entertainment', budget: 300, spent: 189, remaining: 111 },
                { name: 'Shopping', budget: 250, spent: 156, remaining: 94 },
                { name: 'Health & Fitness', budget: 200, spent: 89, remaining: 111 },
                { name: 'Education', budget: 150, spent: 75, remaining: 75 },
                { name: 'Travel', budget: 400, spent: 0, remaining: 400 }
            ]
        };
        this.saveDashboardData();
        this.renderDashboard();
    }

    saveDashboardData() {
        try {
            // Calculate dashboard data from actual transactions and accounts
            const transactions = this.data.transactions || [];
            const totalIncome = transactions
                .filter(t => t.amount > 0)
                .reduce((sum, t) => sum + t.amount, 0);
            const totalExpenses = Math.abs(transactions
                .filter(t => t.amount < 0)
                .reduce((sum, t) => sum + t.amount, 0));
            const netChange = totalIncome - totalExpenses;
            const savingsRate = totalIncome > 0 ? Math.round((netChange / totalIncome) * 100) : 0;

            // Get recent transactions (last 10)
            const recentTransactions = [...transactions]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 10)
                .map(t => ({
                    id: t.id,
                    description: t.description,
                    amount: t.amount,
                    category: t.category,
                    date: t.date
                }));

            // Calculate budget categories from transactions
            const categorySpending = {};
            transactions.forEach(t => {
                if (t.amount < 0 && t.category) {
                    categorySpending[t.category] = (categorySpending[t.category] || 0) + Math.abs(t.amount);
                }
            });

            // Default budget amounts (can be customized later)
            const budgetDefaults = {
                'Food & Dining': 800,
                'Utilities': 400,
                'Transportation': 500,
                'Entertainment': 300,
                'Shopping': 250,
                'Health & Fitness': 200,
                'Education': 150,
                'Travel': 400
            };

            const budgetCategories = Object.keys(budgetDefaults).map(name => ({
                name,
                budget: budgetDefaults[name],
                spent: categorySpending[name] || 0,
                remaining: budgetDefaults[name] - (categorySpending[name] || 0)
            }));

            this.data.dashboard = {
                totalIncome,
                totalExpenses,
                netChange,
                savingsRate,
                recentTransactions,
                budgetCategories
            };

            localStorage.setItem('fambudget-dashboard', JSON.stringify(this.data.dashboard));
        } catch (error) {
            console.error('Error saving dashboard data:', error);
        }
    }

    async loadTransactions() {
        // Try to load from localStorage first
        const savedTransactions = localStorage.getItem('fambudget-transactions');
        if (savedTransactions) {
            try {
                this.data.transactions = JSON.parse(savedTransactions);
                this.updateCategorySelect();
                this.renderTransactions();
                return;
            } catch (error) {
                console.error('Error parsing saved transactions:', error);
            }
        }

        // Use comprehensive demo data for visual representation (fallback)
        this.data.transactions = [
            { id: 1, description: 'Monthly Salary - John', amount: 4500, category: 'Income', date: '2024-01-15', account: 'Primary Checking' },
            { id: 2, description: 'Freelance Web Design', amount: 1200, category: 'Income', date: '2024-01-14', account: 'Primary Checking' },
            { id: 3, description: 'Whole Foods Grocery', amount: -185, category: 'Food & Dining', date: '2024-01-14', account: 'Primary Checking' },
            { id: 4, description: 'Electric Bill', amount: -145, category: 'Utilities', date: '2024-01-13', account: 'Primary Checking' },
            { id: 5, description: 'Netflix Subscription', amount: -15, category: 'Entertainment', date: '2024-01-12', account: 'Primary Checking' },
            { id: 6, description: 'Shell Gas Station', amount: -65, category: 'Transportation', date: '2024-01-12', account: 'Primary Checking' },
            { id: 7, description: 'Starbucks Coffee', amount: -8, category: 'Food & Dining', date: '2024-01-11', account: 'Primary Checking' },
            { id: 8, description: 'Investment Dividends', amount: 245, category: 'Income', date: '2024-01-10', account: 'Investment Account' },
            { id: 9, description: 'Target Shopping', amount: -89, category: 'Shopping', date: '2024-01-10', account: 'Primary Checking' },
            { id: 10, description: 'Planet Fitness', amount: -45, category: 'Health & Fitness', date: '2024-01-09', account: 'Primary Checking' },
            { id: 11, description: 'Uber Ride', amount: -23, category: 'Transportation', date: '2024-01-09', account: 'Primary Checking' },
            { id: 12, description: 'Amazon Prime', amount: -12, category: 'Shopping', date: '2024-01-08', account: 'Credit Card' },
            { id: 13, description: 'Restaurant Dinner', amount: -78, category: 'Food & Dining', date: '2024-01-08', account: 'Primary Checking' },
            { id: 14, description: 'Water Bill', amount: -42, category: 'Utilities', date: '2024-01-07', account: 'Primary Checking' },
            { id: 15, description: 'Spotify Premium', amount: -10, category: 'Entertainment', date: '2024-01-07', account: 'Credit Card' },
            { id: 16, description: 'Monthly Salary - Sarah', amount: 3800, category: 'Income', date: '2024-01-06', account: 'Primary Checking' },
            { id: 17, description: 'Grocery Store', amount: -156, category: 'Food & Dining', date: '2024-01-05', account: 'Primary Checking' },
            { id: 18, description: 'Movie Theater', amount: -32, category: 'Entertainment', date: '2024-01-04', account: 'Primary Checking' },
            { id: 19, description: 'Online Course', amount: -89, category: 'Education', date: '2024-01-03', account: 'Credit Card' },
            { id: 20, description: 'Car Maintenance', amount: -245, category: 'Transportation', date: '2024-01-02', account: 'Primary Checking' }
        ];
        this.saveTransactions();
        this.updateCategorySelect();
        this.renderTransactions();
    }

    saveTransactions() {
        try {
            localStorage.setItem('fambudget-transactions', JSON.stringify(this.data.transactions));
            // Update dashboard and reports when transactions change
            this.saveDashboardData();
            this.saveReports();
        } catch (error) {
            console.error('Error saving transactions:', error);
        }
    }

    async loadAccounts() {
        // Try to load from localStorage first
        const savedAccounts = localStorage.getItem('fambudget-accounts');
        if (savedAccounts) {
            try {
                this.data.accounts = JSON.parse(savedAccounts);
                this.renderAccounts();
                this.updateAccountSelects();
                return;
            } catch (error) {
                console.error('Error parsing saved accounts:', error);
            }
        }

        // Use comprehensive demo data for visual representation (fallback)
        this.data.accounts = [
            { id: 1, name: 'Primary Checking', type: 'checking', balance: 12450, color: '#1976d2' },
            { id: 2, name: 'Emergency Savings', type: 'savings', balance: 25000, color: '#388e3c' },
            { id: 3, name: 'Vacation Fund', type: 'savings', balance: 8750, color: '#ff9800' },
            { id: 4, name: 'Investment Account', type: 'investment', balance: 45600, color: '#9c27b0' },
            { id: 5, name: 'Chase Credit Card', type: 'credit', balance: -2845, color: '#d32f2f' },
            { id: 6, name: 'Business Checking', type: 'checking', balance: 3200, color: '#00bcd4' },
            { id: 7, name: 'Retirement 401k', type: 'investment', balance: 125000, color: '#795548' },
            { id: 8, name: 'Kids College Fund', type: 'savings', balance: 15000, color: '#607d8b' }
        ];
        this.saveAccounts();
        this.renderAccounts();
        this.updateAccountSelects();
    }

    saveAccounts() {
        try {
            localStorage.setItem('fambudget-accounts', JSON.stringify(this.data.accounts));
        } catch (error) {
            console.error('Error saving accounts:', error);
        }
    }

    async loadGoals() {
        // Try to load from localStorage first
        const savedGoals = localStorage.getItem('fambudget-goals');
        if (savedGoals) {
            try {
                this.data.goals = JSON.parse(savedGoals);
                this.renderGoals();
                return;
            } catch (error) {
                console.error('Error parsing saved goals:', error);
            }
        }

        // Use comprehensive demo data for visual representation (fallback)
        this.data.goals = [
            { id: 1, name: 'Emergency Fund (6 months)', target: 30000, current: 25000, deadline: '2024-12-31', priority: 'high' },
            { id: 2, name: 'European Vacation', target: 8000, current: 5400, deadline: '2024-07-15', priority: 'high' },
            { id: 3, name: 'New Car Fund', target: 35000, current: 18900, deadline: '2025-06-30', priority: 'medium' },
            { id: 4, name: 'Home Down Payment', target: 80000, current: 45600, deadline: '2025-12-31', priority: 'high' },
            { id: 5, name: 'Kids College Fund', target: 100000, current: 15000, deadline: '2030-06-01', priority: 'medium' },
            { id: 6, name: 'Wedding Fund', target: 15000, current: 3200, deadline: '2024-09-15', priority: 'high' },
            { id: 7, name: 'Retirement Boost', target: 50000, current: 12500, deadline: '2026-12-31', priority: 'low' },
            { id: 8, name: 'Home Renovation', target: 25000, current: 8750, deadline: '2025-03-31', priority: 'medium' }
        ];
        this.saveGoals();
        this.renderGoals();
    }

    saveGoals() {
        try {
            localStorage.setItem('fambudget-goals', JSON.stringify(this.data.goals));
        } catch (error) {
            console.error('Error saving goals:', error);
        }
    }

    async loadReports() {
        // Try to load from localStorage first
        const savedReports = localStorage.getItem('fambudget-reports');
        if (savedReports) {
            try {
                this.data.reports = JSON.parse(savedReports);
                this.renderReports();
                return;
            } catch (error) {
                console.error('Error parsing saved reports:', error);
            }
        }

        // Use comprehensive demo data for visual representation (fallback)
        this.data.reports = {
            monthlyIncome: 8750,
            monthlyExpenses: 6230,
            categoryBreakdown: {
                'Food & Dining': 487,
                'Utilities': 345,
                'Transportation': 312,
                'Entertainment': 189,
                'Shopping': 156,
                'Health & Fitness': 89,
                'Education': 75,
                'Travel': 0
            },
            trends: [
                { month: 'Oct 2023', income: 8200, expenses: 5800 },
                { month: 'Nov 2023', income: 8300, expenses: 5950 },
                { month: 'Dec 2023', income: 8900, expenses: 7200 },
                { month: 'Jan 2024', income: 8750, expenses: 6230 },
                { month: 'Feb 2024', income: 8800, expenses: 6100 },
                { month: 'Mar 2024', income: 9200, expenses: 6450 }
            ]
        };
        this.saveReports();
        this.renderReports();
    }

    saveReports() {
        try {
            // Calculate reports from actual data
            const transactions = this.data.transactions || [];
            const monthlyIncome = transactions
                .filter(t => t.amount > 0)
                .reduce((sum, t) => sum + t.amount, 0);
            const monthlyExpenses = Math.abs(transactions
                .filter(t => t.amount < 0)
                .reduce((sum, t) => sum + t.amount, 0));

            // Calculate category breakdown
            const categoryBreakdown = {};
            transactions.forEach(t => {
                if (t.amount < 0 && t.category) {
                    categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + Math.abs(t.amount);
                }
            });

            // Generate trends (last 6 months)
            const trends = [];
            const now = new Date();
            for (let i = 5; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                // For demo, use actual data or estimates
                trends.push({
                    month: monthName,
                    income: monthlyIncome * (1 + (Math.random() - 0.5) * 0.1),
                    expenses: monthlyExpenses * (1 + (Math.random() - 0.5) * 0.1)
                });
            }

            this.data.reports = {
                monthlyIncome,
                monthlyExpenses,
                categoryBreakdown,
                trends
            };

            localStorage.setItem('fambudget-reports', JSON.stringify(this.data.reports));
        } catch (error) {
            console.error('Error saving reports:', error);
        }
    }

    async loadIncome() {
        // Try to load from localStorage first
        const savedIncome = localStorage.getItem('fambudget-income');
        if (savedIncome) {
            try {
                this.data.income = JSON.parse(savedIncome);
                this.renderIncome();
                return;
            } catch (error) {
                console.error('Error parsing saved income:', error);
            }
        }

        // Use comprehensive demo data for visual representation (fallback)
        this.data.income = [
            { id: 1, description: 'Monthly Salary - John', amount: 4500, source: 'Primary Job', type: 'recurring', frequency: 'monthly', date: '2024-01-15', account: 'Primary Checking' },
            { id: 2, description: 'Freelance Web Design', amount: 1200, source: 'Freelance Work', type: 'one-time', date: '2024-01-14', account: 'Business Checking' },
            { id: 3, description: 'Investment Dividends', amount: 245, source: 'Investment Portfolio', type: 'recurring', frequency: 'quarterly', date: '2024-01-10', account: 'Investment Account' },
            { id: 4, description: 'Monthly Salary - Sarah', amount: 3800, source: 'Sarah\'s Job', type: 'recurring', frequency: 'monthly', date: '2024-01-06', account: 'Primary Checking' },
            { id: 5, description: 'Rental Income', amount: 1800, source: 'Rental Property', type: 'recurring', frequency: 'monthly', date: '2024-01-01', account: 'Business Checking' },
            { id: 6, description: 'Consulting Project', amount: 2500, source: 'Consulting', type: 'one-time', date: '2023-12-28', account: 'Business Checking' },
            { id: 7, description: 'Year-end Bonus', amount: 5000, source: 'Primary Job', type: 'one-time', date: '2023-12-20', account: 'Primary Checking' },
            { id: 8, description: 'Side Business Income', amount: 850, source: 'Online Store', type: 'recurring', frequency: 'monthly', date: '2023-12-15', account: 'Business Checking' },
            { id: 9, description: 'Stock Options', amount: 3200, source: 'Investment Portfolio', type: 'one-time', date: '2023-12-10', account: 'Investment Account' },
            { id: 10, description: 'Freelance Writing', amount: 600, source: 'Freelance Work', type: 'one-time', date: '2023-12-05', account: 'Primary Checking' }
        ];
        this.saveIncome();
        this.renderIncome();
    }

    saveIncome() {
        try {
            localStorage.setItem('fambudget-income', JSON.stringify(this.data.income));
            // Update dashboard and reports when income changes
            this.saveDashboardData();
            this.saveReports();
        } catch (error) {
            console.error('Error saving income:', error);
        }
    }

    async loadIncomeSources() {
        // Try to load from localStorage first
        const savedIncomeSources = localStorage.getItem('fambudget-incomeSources');
        if (savedIncomeSources) {
            try {
                this.data.incomeSources = JSON.parse(savedIncomeSources);
                this.renderIncomeSources();
                this.updateIncomeSourceSelects();
                return;
            } catch (error) {
                console.error('Error parsing saved income sources:', error);
            }
        }

        // Use comprehensive demo data for visual representation (fallback)
        this.data.incomeSources = [
            { id: 1, name: 'Primary Job', type: 'salary', expectedAmount: 4500, color: '#4caf50' },
            { id: 2, name: 'Sarah\'s Job', type: 'salary', expectedAmount: 3800, color: '#2196f3' },
            { id: 3, name: 'Freelance Work', type: 'freelance', expectedAmount: 2500, color: '#ff9800' },
            { id: 4, name: 'Investment Portfolio', type: 'investment', expectedAmount: 800, color: '#9c27b0' },
            { id: 5, name: 'Rental Property', type: 'rental', expectedAmount: 1800, color: '#00bcd4' },
            { id: 6, name: 'Business Income', type: 'business', expectedAmount: 1200, color: '#795548' },
            { id: 7, name: 'Consulting', type: 'business', expectedAmount: 1500, color: '#607d8b' },
            { id: 8, name: 'Online Store', type: 'business', expectedAmount: 850, color: '#e91e63' }
        ];
        this.saveIncomeSources();
        this.renderIncomeSources();
        this.updateIncomeSourceSelects();
    }

    saveIncomeSources() {
        try {
            localStorage.setItem('fambudget-incomeSources', JSON.stringify(this.data.incomeSources));
        } catch (error) {
            console.error('Error saving income sources:', error);
        }
    }

    navigateToSection(section) {
        if (!section) {
            console.warn('navigateToSection called without section');
            return;
        }

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeNav = document.querySelector(`[data-section="${section}"]`);
        if (activeNav) activeNav.classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        const activeSection = document.getElementById(section);
        if (activeSection) activeSection.classList.add('active');

        // Ensure scroll to top for better UX
        window.scrollTo({ top: 0, behavior: 'smooth' });

        this.currentSection = section;
    }

    render() {
        this.renderDashboard();
        this.renderTransactions();
        this.renderAccounts();
        this.renderGoals();
        this.renderReports();
        this.renderIncome();
        this.renderIncomeSources();
    }

    renderDashboard() {
        if (!this.data.dashboard) return;

        const { totalIncome, totalExpenses, netChange, savingsRate, recentTransactions, budgetCategories } = this.data.dashboard;

        // Update summary cards
        document.getElementById('totalIncome').textContent = this.formatCurrency(totalIncome);
        document.getElementById('totalExpenses').textContent = this.formatCurrency(totalExpenses);
        document.getElementById('netChange').textContent = this.formatCurrency(netChange);
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
                    ${transaction.amount > 0 ? '+' : ''}${this.formatCurrency(transaction.amount)}
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
                            ${this.formatCurrency(category.spent)} / ${this.formatCurrency(category.budget)} (${this.formatCurrency(category.remaining)} remaining)
                        </div>
                    </div>
                    <div class="budget-progress">
                        <div class="budget-progress-bar" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                </div>
            `;
        }).join('');

        // Render category chart with delay to ensure DOM is ready
        setTimeout(() => {
            this.renderCategoryChart();
        }, 200);
    }

    renderTransactions() {
        const tbody = document.getElementById('transactionsTableBody');
        if (!tbody) return;

        // Apply account filter if present
        let transactionsToRender = this.data.transactions;
        const accountFilterValue = document.getElementById('accountFilter')?.value || '';
        if (accountFilterValue) {
            const accountName = this.data.accounts.find(acc => String(acc.id) === String(accountFilterValue))?.name;
            if (accountName) {
                transactionsToRender = transactionsToRender.filter(t => t.account === accountName);
            }
        }

        // Apply category filter if present
        const categoryFilterValue = document.getElementById('categoryFilter')?.value || '';
        if (categoryFilterValue) {
            transactionsToRender = transactionsToRender.filter(t => t.category === categoryFilterValue);
        }

        tbody.innerHTML = transactionsToRender.map(transaction => `
            <tr>
                <td>${new Date(transaction.date).toLocaleDateString()}</td>
                <td>${transaction.description}</td>
                <td>${transaction.category}</td>
                <td>${transaction.account}</td>
                <td class="${transaction.amount > 0 ? 'positive' : 'negative'}">
                    ${transaction.amount > 0 ? '+' : ''}${this.formatCurrency(transaction.amount)}
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
                    ${this.formatCurrency(account.balance)}
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
                        ${this.formatCurrency(goal.current)} / ${this.formatCurrency(goal.target)}
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

        // Render trends chart with delay to ensure DOM is ready
        setTimeout(() => {
            this.renderTrendsChart();
        }, 200);

        // Render breakdown chart with delay to ensure DOM is ready
        setTimeout(() => {
            this.renderBreakdownChart();
        }, 300);
    }

    renderIncome() {
        const tbody = document.getElementById('incomeTableBody');
        if (!tbody) return;

        // Apply income source filter if present
        let incomeToRender = this.data.income;
        const incomeSourceFilterValue = document.getElementById('incomeSourceFilter')?.value || '';
        if (incomeSourceFilterValue) {
            const sourceName = this.data.incomeSources.find(src => String(src.id) === String(incomeSourceFilterValue))?.name;
            if (sourceName) {
                incomeToRender = incomeToRender.filter(i => i.source === sourceName);
            }
        }
        
        tbody.innerHTML = incomeToRender.map(income => `
            <tr>
                <td>${new Date(income.date).toLocaleDateString()}</td>
                <td>${income.source}</td>
                <td>${income.description}</td>
                <td>
                    <span class="income-type ${income.type}">
                        ${income.type === 'recurring' ? `${income.type} (${income.frequency})` : income.type}
                    </span>
                </td>
                <td class="positive">${this.formatCurrency(income.amount)}</td>
                <td>
                    <button class="btn btn-secondary" onclick="app.editIncome(${income.id})">Edit</button>
                    <button class="btn btn-secondary" onclick="app.deleteIncome(${income.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    renderIncomeSources() {
        const sourcesGrid = document.getElementById('sourcesGrid');
        if (!sourcesGrid) return;
        
        sourcesGrid.innerHTML = this.data.incomeSources.map(source => {
            const totalIncome = this.data.income
                .filter(inc => inc.source === source.name)
                .reduce((sum, inc) => sum + inc.amount, 0);
            
            return `
                <div class="source-card" style="border-left: 4px solid ${source.color}">
                    <div class="source-header">
                        <div class="source-name">${source.name}</div>
                        <div class="source-type">${source.type}</div>
                    </div>
                    <div class="source-amount">
                        ${this.formatCurrency(totalIncome)}
                    </div>
                    <div class="source-expected">
                        Expected: ${this.formatCurrency(source.expectedAmount)}/month
                    </div>
                    <div class="source-actions">
                        <button class="btn btn-secondary" onclick="app.editIncomeSource(${source.id})">Edit</button>
                        <button class="btn btn-secondary" onclick="app.deleteIncomeSource(${source.id})">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateAccountSelects() {
        const selects = document.querySelectorAll('#transactionAccount, #accountFilter, #incomeAccount');
        selects.forEach(select => {
            select.innerHTML = '<option value="">Select Account</option>' +
                this.data.accounts.map(account => 
                    `<option value="${account.id}">${account.name}</option>`
                ).join('');
        });
    }

    updateCategorySelect() {
        const categorySelect = document.getElementById('categoryFilter');
        if (!categorySelect) return;
        const categories = Array.from(new Set(this.data.transactions.map(t => t.category))).sort();
        categorySelect.innerHTML = '<option value="">All Categories</option>' +
            categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    }

    updateIncomeSourceSelects() {
        const selects = document.querySelectorAll('#incomeSource, #incomeSourceFilter');
        selects.forEach(select => {
            select.innerHTML = '<option value="">Select Source</option>' +
                this.data.incomeSources.map(source => 
                    `<option value="${source.id}">${source.name}</option>`
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
        document.getElementById('incomeForm').reset();
        document.getElementById('incomeSourceForm').reset();
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
        this.saveTransactions();
        this.updateCategorySelect();
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
        this.saveAccounts();
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
        this.saveGoals();
        this.renderGoals();
        this.hideModal();

        // Show success message
        this.showMessage('Goal added successfully!');
    }

    async addIncome() {
        const formData = {
            description: document.getElementById('incomeDescription').value,
            amount: parseFloat(document.getElementById('incomeAmount').value),
            source: this.data.incomeSources.find(src => src.id == document.getElementById('incomeSource').value)?.name || 'Unknown',
            type: document.getElementById('incomeType').value,
            frequency: document.getElementById('incomeType').value === 'recurring' ? document.getElementById('incomeFrequency').value : null,
            date: document.getElementById('incomeDate').value,
            account: this.data.accounts.find(acc => acc.id == document.getElementById('incomeAccount').value)?.name || 'Unknown'
        };

        // Add to local data
        const newIncome = {
            id: Date.now(),
            ...formData
        };

        this.data.income.unshift(newIncome);
        this.saveIncome();
        this.renderIncome();
        this.renderIncomeSources();
        this.hideModal();

        // Show success message
        this.showMessage('Income added successfully!');
    }

    async addIncomeSource() {
        const formData = {
            name: document.getElementById('sourceName').value,
            type: document.getElementById('sourceType').value,
            expectedAmount: parseFloat(document.getElementById('expectedAmount').value) || 0,
            color: document.getElementById('sourceColor').value
        };

        // Add to local data
        const newSource = {
            id: Date.now(),
            ...formData
        };

        this.data.incomeSources.push(newSource);
        this.saveIncomeSources();
        this.renderIncomeSources();
        this.updateIncomeSourceSelects();
        this.hideModal();

        // Show success message
        this.showMessage('Income source added successfully!');
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
            this.saveTransactions();
            this.updateCategorySelect();
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
            this.saveAccounts();
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
            this.saveGoals();
            this.renderGoals();
            this.showMessage('Goal deleted successfully!');
        }
    }

    editIncome(id) {
        const income = this.data.income.find(i => i.id === id);
        if (income) {
            // Populate form and show modal
            document.getElementById('incomeDescription').value = income.description;
            document.getElementById('incomeAmount').value = income.amount;
            document.getElementById('incomeSource').value = this.data.incomeSources.find(src => src.name === income.source)?.id || '';
            document.getElementById('incomeType').value = income.type;
            if (income.frequency) {
                document.getElementById('incomeFrequency').value = income.frequency;
            }
            document.getElementById('incomeDate').value = income.date;
            document.getElementById('incomeAccount').value = this.data.accounts.find(acc => acc.name === income.account)?.id || '';
            this.showModal('incomeModal');
        }
    }

    deleteIncome(id) {
        if (confirm('Are you sure you want to delete this income record?')) {
            this.data.income = this.data.income.filter(i => i.id !== id);
            this.saveIncome();
            this.renderIncome();
            this.renderIncomeSources();
            this.showMessage('Income deleted successfully!');
        }
    }

    editIncomeSource(id) {
        const source = this.data.incomeSources.find(s => s.id === id);
        if (source) {
            // Populate form and show modal
            document.getElementById('sourceName').value = source.name;
            document.getElementById('sourceType').value = source.type;
            document.getElementById('expectedAmount').value = source.expectedAmount;
            document.getElementById('sourceColor').value = source.color;
            this.showModal('incomeSourceModal');
        }
    }

    deleteIncomeSource(id) {
        if (confirm('Are you sure you want to delete this income source? This will also delete all associated income records.')) {
            const source = this.data.incomeSources.find(s => s.id === id);
            if (source) {
                // Remove associated income records
                this.data.income = this.data.income.filter(i => i.source !== source.name);
                this.data.incomeSources = this.data.incomeSources.filter(s => s.id !== id);
                this.saveIncome();
                this.saveIncomeSources();
                this.renderIncome();
                this.renderIncomeSources();
                this.updateIncomeSourceSelects();
                this.showMessage('Income source deleted successfully!');
            }
        }
    }

    async importData() {
        // Web version - import requires desktop app
        this.showMessage('Import functionality requires the desktop app version');
    } ${config.symbol}`;
        }
    }

    changeCurrency(currency) {
        this.selectedCurrency = currency;
        localStorage.setItem('fambudget-currency', currency);
        
        // Update currency selector
        document.getElementById('currencySelect').value = currency;
        
        // Re-render all monetary displays
        this.renderDashboard();
        this.renderTransactions();
        this.renderAccounts();
        this.renderGoals();
        this.renderReports();
        
        this.showMessage(`Currency changed to ${currency}`);
    }

    loadCurrency() {
        const savedCurrency = localStorage.getItem('fambudget-currency');
        if (savedCurrency && this.currencyConfig[savedCurrency]) {
            this.selectedCurrency = savedCurrency;
            document.getElementById('currencySelect').value = savedCurrency;
        }
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

    // Chart rendering methods
    renderCategoryChart() {
        const container = document.getElementById('categoryChart');
        console.log('renderCategoryChart called', { container, dashboard: this.data.dashboard });
        
        if (!container || !this.data.dashboard || !this.data.dashboard.budgetCategories) {
            console.log('Missing container or dashboard data', { 
                container: !!container, 
                dashboard: !!this.data.dashboard,
                categories: !!(this.data.dashboard && this.data.dashboard.budgetCategories)
            });
            if (container) {
                container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No data available</div>';
            }
            return;
        }

        // Clear container content
        container.innerHTML = '';

        // Create canvas element
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        canvas.style.maxWidth = '100%';
        canvas.style.height = 'auto';
        container.appendChild(canvas);
        
        // Get the 2D context
        const ctx = canvas.getContext('2d');

        // Destroy existing chart if it exists
        if (this.categoryChart) {
            this.categoryChart.destroy();
            this.categoryChart = null;
        }

        const categories = this.data.dashboard.budgetCategories;
        console.log('Categories data:', categories);
        
        if (!categories || categories.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No budget categories available</div>';
            return;
        }

        const labels = categories.map(cat => cat.name);
        const data = categories.map(cat => cat.spent);
        console.log('Chart data:', { labels, data });
        
        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
            '#9966FF', '#FF9F40', '#4BC0C0', '#C9CBCF'
        ];

        console.log('Creating Chart.js chart, Chart available:', typeof Chart !== 'undefined');
        
        if (typeof Chart === 'undefined') {
            console.error('Chart.js not loaded');
            container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">Chart.js not loaded. Please refresh the page.</div>';
            return;
        }
        
        console.log('About to create category chart with context:', ctx);
        
        try {
            this.categoryChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors.slice(0, labels.length),
                        borderWidth: 2,
                        borderColor: this.isDarkTheme ? '#333' : '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true,
                                color: this.isDarkTheme ? '#fff' : '#333'
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const category = categories[context.dataIndex];
                                    const percentage = Math.round((category.spent / category.budget) * 100);
                                    return `${category.name}: ${this.formatCurrency(category.spent)} (${percentage}% of budget)`;
                                }
                            }
                        }
                    }
                }
            });
            console.log('Category chart created successfully:', this.categoryChart);
        } catch (error) {
            console.error('Error creating category chart:', error);
            container.innerHTML = `<div style="text-align: center; color: #666; padding: 20px;">Chart Error: ${error.message}</div>`;
        }
    }

    renderTrendsChart() {
        const container = document.getElementById('trendsChart');
        
        if (!container || !this.data.reports || !this.data.reports.trends) {
            if (container) {
                container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No trends data available</div>';
            }
            return;
        }

        // Clear container content
        container.innerHTML = '';

        // Create canvas element
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        canvas.style.maxWidth = '100%';
        canvas.style.height = 'auto';
        container.appendChild(canvas);
        
        // Get the 2D context
        const ctx = canvas.getContext('2d');

        // Destroy existing chart if it exists
        if (this.trendsChart) {
            this.trendsChart.destroy();
            this.trendsChart = null;
        }

        const trends = this.data.reports.trends;
        
        if (!trends || trends.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No trends data available</div>';
            return;
        }

        const labels = trends.map(trend => trend.month);
        const incomeData = trends.map(trend => trend.income);
        const expenseData = trends.map(trend => trend.expenses);

        if (typeof Chart === 'undefined') {
            console.error('Chart.js not loaded');
            container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">Chart.js not loaded. Please refresh the page.</div>';
            return;
        }
        
        try {
            this.trendsChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Income',
                            data: incomeData,
                            borderColor: '#4CAF50',
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Expenses',
                            data: expenseData,
                            borderColor: '#F44336',
                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                            tension: 0.4,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: this.isDarkTheme ? '#fff' : '#333'
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    return `${context.dataset.label}: ${this.formatCurrency(context.parsed.y)}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: this.isDarkTheme ? '#fff' : '#333'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value) => this.formatCurrency(value),
                                color: this.isDarkTheme ? '#fff' : '#333'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating trends chart:', error);
            container.innerHTML = `<div style="text-align: center; color: #666; padding: 20px;">Chart Error: ${error.message}</div>`;
        }
    }

    renderBreakdownChart() {
        const container = document.getElementById('breakdownChart');
        
        if (!container || !this.data.reports || !this.data.reports.categoryBreakdown) {
            if (container) {
                container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No breakdown data available</div>';
            }
            return;
        }

        // Clear container content
        container.innerHTML = '';

        // Create canvas element
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        canvas.style.maxWidth = '100%';
        canvas.style.height = 'auto';
        container.appendChild(canvas);
        
        // Get the 2D context
        const ctx = canvas.getContext('2d');

        // Destroy existing chart if it exists
        if (this.breakdownChart) {
            this.breakdownChart.destroy();
            this.breakdownChart = null;
        }

        const breakdown = this.data.reports.categoryBreakdown;
        
        if (!breakdown || Object.keys(breakdown).length === 0) {
            container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No breakdown data available</div>';
            return;
        }

        const labels = Object.keys(breakdown);
        const data = Object.values(breakdown);
        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
            '#9966FF', '#FF9F40', '#4BC0C0', '#C9CBCF'
        ];

        if (typeof Chart === 'undefined') {
            console.error('Chart.js not loaded');
            container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">Chart.js not loaded. Please refresh the page.</div>';
            return;
        }
        
        try {
            this.breakdownChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Spending by Category',
                        data: data,
                        backgroundColor: colors.slice(0, labels.length),
                        borderColor: colors.slice(0, labels.length),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    return `${context.label}: ${this.formatCurrency(context.parsed.y)}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: this.isDarkTheme ? '#fff' : '#333'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value) => this.formatCurrency(value),
                                color: this.isDarkTheme ? '#fff' : '#333'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating breakdown chart:', error);
            container.innerHTML = `<div style="text-align: center; color: #666; padding: 20px;">Chart Error: ${error.message}</div>`;
        }
    }
}

// Initialize the app when DOM is loaded
(function() {
    'use strict';
    
    function initializeApp() {
        try {
            console.log('Initializing FamBudget app...');
            window.app = new FamBudgetApp();
            console.log('FamBudget app initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
            alert('Error initializing app: ' + error.message);
        }
    }
    
    function loadChartJs() {
        return new Promise((resolve, reject) => {
            if (typeof Chart !== 'undefined') {
                console.log('Chart.js already loaded');
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js';
            script.onload = () => {
                if (typeof Chart !== 'undefined') {
                    console.log('Chart.js loaded successfully from CDN');
                    // Re-render charts now that Chart.js is available
                    if (window.app && window.app.data && window.app.data.dashboard) {
                        setTimeout(() => {
                            try {
                                if (window.app.renderCategoryChart) window.app.renderCategoryChart();
                                if (window.app.renderTrendsChart) window.app.renderTrendsChart();
                                if (window.app.renderBreakdownChart) window.app.renderBreakdownChart();
                            } catch (err) {
                                console.warn('Error rendering charts:', err);
                            }
                        }, 100);
                    }
                    resolve();
                } else {
                    reject(new Error('Chart.js not available after loading'));
                }
            };
            script.onerror = () => {
                console.warn('Failed to load Chart.js from CDN - charts will not work');
                reject(new Error('Failed to load Chart.js from CDN'));
            };
            document.head.appendChild(script);
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        // DOM already loaded
        initializeApp();
    }
    
    // Load Chart.js in background (non-blocking)
    loadChartJs().catch(() => {
        console.warn('Charts will not be available');
    });
})();

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
