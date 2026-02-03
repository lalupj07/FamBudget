// FamBudget Desktop App JavaScript
class FamBudgetApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentPeriod = 'monthly'; // daily, monthly, yearly
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
        this.budgetWarnings = [];
        this.tempProfilePhoto = null; // Temporary storage for photo before save
        this.editingAccountId = null; // When set, addAccount() updates instead of adding
        this.editingGoalId = null; // When set, addGoal() updates instead of adding
        this.editingIncomeId = null; // When set, addIncome() updates instead of adding
        this.editingIncomeSourceId = null; // When set, addIncomeSource() updates instead of adding
        
        // Chart instances
        this.categoryChart = null;
        this.trendsChart = null;
        this.breakdownChart = null;
        
        // Offline storage
        this.offlineStorage = null;
        this.searchTimeout = null;
        
        // Feature managers
        this.recurringManager = null;
        this.templatesManager = null;
        this.splitManager = null;
        this.notificationsManager = null;
        
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
        // PIN system removed - using lockscreen system instead
        // Continue with app initialization
        
        // CRITICAL: Ensure dashboard section is visible immediately
        // Don't wait for anything else - show dashboard first
        const dashboardSection = document.getElementById('dashboard');
        if (dashboardSection) {
            dashboardSection.classList.add('active');
            // Remove active from other sections
            document.querySelectorAll('.content-section').forEach(sec => {
                if (sec.id !== 'dashboard') {
                    sec.classList.remove('active');
                }
            });
            console.log('Dashboard section forced active on init');
        }
        
        // Initialize offline storage
        try {
            this.offlineStorage = new OfflineStorage();
            await this.offlineStorage.init();
            console.log('Offline storage initialized');
        } catch (error) {
            console.error('Failed to initialize offline storage:', error);
        }

        // Initialize feature managers
        try {
            this.recurringManager = new RecurringTransactionsManager(this);
            await this.recurringManager.init();
            
            this.templatesManager = new TransactionTemplatesManager(this);
            await this.templatesManager.init();
            
            this.splitManager = new SplitTransactionsManager(this);
            
            this.notificationsManager = new NotificationsManager(this);
            await this.notificationsManager.init();
            
            this.receiptManager = new ReceiptManager(this);
            await this.receiptManager.init();
            
            this.filtersManager = new AdvancedFiltersManager(this);
            await this.filtersManager.init();
            
            this.calendarManager = new FinancialCalendarManager(this);
            
            this.budgetTemplatesManager = new BudgetTemplatesManager(this);
            await this.budgetTemplatesManager.init();
            
            this.debtTracker = new DebtTrackerManager(this);
            await this.debtTracker.init();
            
            this.forecastManager = new CashFlowForecastManager(this);
            
            this.analyticsManager = new EnhancedAnalyticsManager(this);
            
            this.exportManager = new ExportManager(this);
            
            this.currencyConverter = new CurrencyConverterManager(this);
            await this.currencyConverter.init();
            
            this.quickActions = new QuickActionsManager(this);
            this.quickActions.init();
            window.quickActionsManager = this.quickActions;
            
            this.encryptionManager = new DataEncryptionManager(this);
            await this.encryptionManager.init();
            
            this.backupManager = new LocalBackupManager(this);
            await this.backupManager.init();
            
            this.dashboardCustomization = new DashboardCustomizationManager(this);
            await this.dashboardCustomization.init();
            
            this.onboardingManager = new OnboardingManager(this);
            await this.onboardingManager.init();
            window.onboardingManager = this.onboardingManager;
            
            this.visualizationManager = new EnhancedVisualizationManager(this);
            this.visualizationManager.init();
            
            this.accessibilityManager = new AccessibilityManager(this);
            await this.accessibilityManager.init();
            
            // Check if onboarding is needed
            if (this.onboardingManager.needsOnboarding()) {
                setTimeout(() => {
                    if (confirm('Welcome to FamBudget! Would you like to take a quick tour?')) {
                        this.onboardingManager.startTour();
                    }
                }, 1000);
            }
            
            console.log('Feature managers initialized');
        } catch (error) {
            console.error('Failed to initialize feature managers:', error);
        }
        
        // Backend authentication is optional (for cloud sync)
        // App works offline with PIN-only access

        // Add entrance animation class
        document.body.classList.add('app-loaded');

        this.setupEventListeners();
        this.loadTheme();
        this.loadCurrency();
        
        // CRITICAL: Ensure dashboard is active before any rendering
        const dashboardEl = document.getElementById('dashboard');
        if (dashboardEl) {
            dashboardEl.classList.add('active');
            // Hide other sections
            document.querySelectorAll('.content-section').forEach(sec => {
                if (sec.id !== 'dashboard') {
                    sec.classList.remove('active');
                }
            });
            this.currentSection = 'dashboard';
            console.log('Dashboard section ensured active');
        }
        
        await this.loadData();
        await this.loadProfile();
        this.updateProfilePhotoDisplay(); // Ensure photo is displayed on load
        this.setupOfflineFeatures();
        
        // Render after data is loaded and section is shown
        this.render();
        
        // Final check - ensure dashboard is still visible
        setTimeout(() => {
            const dashEl = document.getElementById('dashboard');
            if (dashEl && !dashEl.classList.contains('active')) {
                console.warn('Dashboard lost active class, restoring...');
                dashEl.classList.add('active');
            }
        }, 500);
        
        // Apply accessibility settings after render
        if (this.accessibilityManager) {
            this.accessibilityManager.applySettings();
        }
        
        // Trigger entrance animations
        setTimeout(() => {
            const appEl = document.getElementById('app');
            if (appEl) {
                appEl.classList.add('animate-in');
            }
        }, 100);
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

        // Period tabs
        document.querySelectorAll('.period-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.period-tab').forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.currentPeriod = e.currentTarget.dataset.period;
                this.updatePeriodTotals();
            });
        });

        // Add transaction buttons
        const addTransactionBtnEl = document.getElementById('addTransactionBtn');
        if (addTransactionBtnEl) {
            addTransactionBtnEl.addEventListener('click', () => {
                this.showModal('transactionModal');
            });
        }

        const addTransactionBtn2El = document.getElementById('addTransactionBtn2');
        if (addTransactionBtn2El) {
            // Remove any existing listeners and add fresh one
            const newBtn2 = addTransactionBtn2El.cloneNode(true);
            addTransactionBtn2El.parentNode.replaceChild(newBtn2, addTransactionBtn2El);
            newBtn2.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Add Transaction button clicked');
                this.showModal('transactionModal');
            });
        }
        
        // Add event listeners for template and recurring buttons (they use inline onclick)
        const templateBtn = document.querySelector('button[onclick*="templateModal"]');
        if (templateBtn) {
            const newTemplateBtn = templateBtn.cloneNode(true);
            templateBtn.parentNode.replaceChild(newTemplateBtn, templateBtn);
            newTemplateBtn.removeAttribute('onclick');
            newTemplateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Template button clicked');
                this.showModal('templateModal');
            });
        }
        
        const recurringBtn = document.querySelector('button[onclick*="recurringTransactionModal"]');
        if (recurringBtn) {
            const newRecurringBtn = recurringBtn.cloneNode(true);
            recurringBtn.parentNode.replaceChild(newRecurringBtn, recurringBtn);
            newRecurringBtn.removeAttribute('onclick');
            newRecurringBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Recurring button clicked');
                this.showModal('recurringTransactionModal');
            });
        }

        // Header feature buttons - single delegated listener (same code path for all 6 buttons)
        const headerFeaturesEl = document.getElementById('headerFeatures');
        if (headerFeaturesEl) {
            headerFeaturesEl.addEventListener('click', (e) => {
                const btn = e.target.closest('.header-feature-btn');
                if (!btn) return;
                const modalId = btn.getAttribute('data-modal');
                if (modalId) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showModal(modalId);
                }
            });
        }

        // Add account button
        const addAccountBtnEl = document.getElementById('addAccountBtn');
        if (addAccountBtnEl) {
            addAccountBtnEl.addEventListener('click', () => {
                this.editingAccountId = null;
                document.getElementById('accountForm')?.reset();
                const titleEl = document.querySelector('#accountModal .modal-header h3');
                if (titleEl) titleEl.textContent = 'Add Account';
                this.showModal('accountModal');
            });
        }

        // Account card Edit/Delete - delegated so it works after renderAccounts()
        const accountsGridEl = document.getElementById('accountsGrid');
        if (accountsGridEl) {
            accountsGridEl.addEventListener('click', (e) => {
                const editBtn = e.target.closest('.account-edit-btn');
                const deleteBtn = e.target.closest('.account-delete-btn');
                if (editBtn) {
                    e.preventDefault();
                    const id = editBtn.getAttribute('data-account-id');
                    if (id != null) this.editAccount(id === '' ? undefined : (Number(id) || id));
                } else if (deleteBtn) {
                    e.preventDefault();
                    const id = deleteBtn.getAttribute('data-account-id');
                    if (id != null) this.deleteAccount(id === '' ? undefined : (Number(id) || id));
                }
            });
        }

        // Add goal button
        const addGoalBtnEl = document.getElementById('addGoalBtn');
        if (addGoalBtnEl) {
            addGoalBtnEl.addEventListener('click', () => {
                this.editingGoalId = null; // Reset editing flag for new goal
                this.showModal('goalModal');
            });
        }

        // Add income buttons
        const addIncomeBtnEl = document.getElementById('addIncomeBtn');
        if (addIncomeBtnEl) {
            addIncomeBtnEl.addEventListener('click', () => {
                this.editingIncomeId = null; // Reset editing flag for new income
                this.showModal('incomeModal');
            });
        }

        const addIncomeSourceBtnEl = document.getElementById('addIncomeSourceBtn');
        if (addIncomeSourceBtnEl) {
            addIncomeSourceBtnEl.addEventListener('click', () => {
                this.editingIncomeSourceId = null; // Reset editing flag for new income source
                this.showModal('incomeSourceModal');
            });
        }

        // Modal close buttons - use event delegation to handle dynamically added buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
                const modal = e.target.closest('.modal-overlay, .modal');
                if (modal) {
                    this.hideModal(modal.id);
                } else {
                    this.hideModal();
                }
            }
        });

        // Modal overlay: close when clicking the backdrop (not when clicking inside the modal)
        document.addEventListener('click', (e) => {
            if (e.target.id === 'modalOverlayBackdrop' || e.target.classList.contains('modal-overlay-backdrop')) {
                this.hideModal('modalOverlay');
            } else if (e.target.id === 'modalOverlay' || e.target.classList.contains('modal-overlay')) {
                this.hideModal('modalOverlay');
            }
        });
        
        // When user clicks inside a form modal (label or empty area), focus first input so typing works after edit
        document.addEventListener('mousedown', (e) => {
            const modal = e.target.closest('#accountModal, #transactionModal, #goalModal, #incomeModal, #incomeSourceModal');
            if (!modal || !modal.offsetParent) return;
            const form = modal.querySelector('form');
            if (!form || !form.contains(e.target)) return;
            if (e.target.matches('input, select, textarea') || e.target.closest('.form-actions')) return;
            const firstInput = modal.querySelector('input:not([type="hidden"]):not([type="color"]), select, textarea');
            if (firstInput && typeof firstInput.focus === 'function') {
                setTimeout(() => firstInput.focus(), 0);
            }
        });

        // Profile edit button
        const editProfileBtnEl = document.getElementById('editProfileBtn');
        if (editProfileBtnEl) {
            editProfileBtnEl.addEventListener('click', () => {
                this.showProfileModal();
            });
        }

        // Profile modal close
        const closeProfileModalEl = document.getElementById('closeProfileModal');
        if (closeProfileModalEl) {
            closeProfileModalEl.addEventListener('click', () => {
                this.hideProfileModal();
            });
        }

        const cancelProfileEditEl = document.getElementById('cancelProfileEdit');
        if (cancelProfileEditEl) {
            cancelProfileEditEl.addEventListener('click', () => {
                this.hideProfileModal();
            });
        }

        // Profile photo selection
        const selectPhotoBtnEl = document.getElementById('selectPhotoBtn');
        const profilePhotoInputEl = document.getElementById('profilePhotoInput');
        const removePhotoBtnEl = document.getElementById('removePhotoBtn');
        const profilePhotoPreviewEl = document.getElementById('profilePhotoPreview');

        if (selectPhotoBtnEl && profilePhotoInputEl) {
            selectPhotoBtnEl.addEventListener('click', () => {
                profilePhotoInputEl.click();
            });

            profilePhotoPreviewEl?.addEventListener('click', () => {
                profilePhotoInputEl.click();
            });
        }

        if (profilePhotoInputEl) {
            profilePhotoInputEl.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleProfilePhotoSelect(file);
                }
            });
        }

        if (removePhotoBtnEl) {
            removePhotoBtnEl.addEventListener('click', () => {
                this.removeProfilePhoto();
            });
        }

        // Profile form submission
        const profileFormEl = document.getElementById('profileForm');
        if (profileFormEl) {
            profileFormEl.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfile();
            });
        }

        // Logout button
        const logoutBtnEl = document.getElementById('logoutBtn');
        if (logoutBtnEl) {
            logoutBtnEl.addEventListener('click', () => {
                this.logout();
            });
        }

        // Dark mode toggle in settings
        const darkModeToggleEl = document.getElementById('darkModeToggle');
        if (darkModeToggleEl) {
            darkModeToggleEl.addEventListener('change', (e) => {
                this.toggleTheme();
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

        // Transaction search
        const transactionSearchEl = document.getElementById('transactionSearch');
        if (transactionSearchEl) {
            transactionSearchEl.addEventListener('input', (e) => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.searchTransactions(e.target.value);
                }, 300);
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
                this.editingAccountId = null;
                const titleEl = document.querySelector('#accountModal .modal-header h3');
                if (titleEl) titleEl.textContent = 'Add Account';
                this.hideModal('accountModal');
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
            // Remove any existing listeners and add fresh one
            const newImportBtn = importBtnEl.cloneNode(true);
            importBtnEl.parentNode.replaceChild(newImportBtn, importBtnEl);
            newImportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Import button clicked');
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
            console.log('Loading all data...');
            
            // Load transactions FIRST (needed for dashboard calculations)
            await this.loadTransactions();
            
            // Load accounts
            await this.loadAccounts();
            
            // Load goals
            await this.loadGoals();
            
            // Load income data
            await this.loadIncome();
            await this.loadIncomeSources();
            
            // Load dashboard data (uses transactions to calculate)
            await this.loadDashboardData();
            
            // Load reports (uses dashboard data)
            await this.loadReports();
            
            // Sync all data - recalculate totals and categories
            this.syncAllData();
            
            console.log('All data loaded and synced');
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }
    
    // Sync all data - recalculate everything from transactions
    syncAllData() {
        console.log('Syncing all data...');
        
        // Recalculate dashboard totals from transactions
        if (this.data.transactions && this.data.transactions.length > 0) {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
            
            const monthlyTransactions = this.data.transactions.filter(t => {
                const transactionDate = new Date(t.date);
                return transactionDate >= startOfMonth && transactionDate <= endOfMonth;
            });
            
            const totalIncome = monthlyTransactions
                .filter(t => t.amount > 0)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);
            
            const totalExpenses = monthlyTransactions
                .filter(t => t.amount < 0)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);
            
            const netChange = totalIncome - totalExpenses;
            const savingsRate = totalIncome > 0 ? Math.round((netChange / totalIncome) * 100) : 0;
            
            // Update dashboard totals
            if (this.data.dashboard) {
                this.data.dashboard.totalIncome = totalIncome;
                this.data.dashboard.totalExpenses = totalExpenses;
                this.data.dashboard.netChange = netChange;
                this.data.dashboard.savingsRate = savingsRate;
                
                // Recalculate category spent amounts
                const categorySpent = {};
                monthlyTransactions.forEach(t => {
                    if (t.amount < 0 && t.category) {
                        const categoryName = t.category;
                        categorySpent[categoryName] = (categorySpent[categoryName] || 0) + Math.abs(t.amount);
                    }
                });
                
                // Update budget categories
                if (this.data.dashboard.budgetCategories) {
                    this.data.dashboard.budgetCategories = this.data.dashboard.budgetCategories.map(cat => ({
                        ...cat,
                        spent: categorySpent[cat.name] || 0,
                        remaining: cat.budget - (categorySpent[cat.name] || 0)
                    }));
                }
            }
        }
        
        // Re-render dashboard to show updated data
        if (this.currentSection === 'dashboard') {
            setTimeout(() => {
                this.renderDashboard();
                // Force chart rendering after sync
                setTimeout(() => {
                    if (typeof Chart !== 'undefined' && this.data.dashboard && this.data.dashboard.budgetCategories) {
                        console.log('Force rendering chart after sync...');
                        this.renderCategoryChart();
                    }
                }, 500);
            }, 100);
        }
        
        console.log('Data sync completed');
    }

    async loadDashboardData() {
        console.log('loadDashboardData called');
        
        // Check if user has cleared demo data
        const dataCleared = localStorage.getItem('fambudget_data_cleared') === 'true';
        
        // First, ensure transactions are loaded to calculate accurate totals
        if (!this.data.transactions || this.data.transactions.length === 0) {
            await this.loadTransactions();
        }
        
        // Calculate totals from transactions
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        
        const monthlyTransactions = this.data.transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate >= startOfMonth && transactionDate <= endOfMonth;
        });
        
        const totalIncome = monthlyTransactions
            .filter(t => t.amount > 0)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        const totalExpenses = monthlyTransactions
            .filter(t => t.amount < 0)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        const netChange = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? Math.round((netChange / totalIncome) * 100) : 0;
        
        // Get recent transactions (last 10)
        const recentTransactions = monthlyTransactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);
        
        // Calculate spent amounts per category from transactions
        const categorySpent = {};
        monthlyTransactions.forEach(t => {
            if (t.amount < 0 && t.category) {
                const categoryName = t.category;
                categorySpent[categoryName] = (categorySpent[categoryName] || 0) + Math.abs(t.amount);
            }
        });
        
        // Define budget categories with budgets
        const budgetCategories = [
            { name: 'Food & Dining', budget: 800 },
            { name: 'Utilities', budget: 400 },
            { name: 'Transportation', budget: 500 },
            { name: 'Entertainment', budget: 300 },
            { name: 'Shopping', budget: 250 },
            { name: 'Health & Fitness', budget: 200 },
            { name: 'Education', budget: 150 },
            { name: 'Travel', budget: 400 },
            { name: 'Home & Garden', budget: 300 },
            { name: 'Personal Care', budget: 150 }
        ].map(cat => ({
            ...cat,
            spent: categorySpent[cat.name] || 0,
            remaining: cat.budget - (categorySpent[cat.name] || 0)
        }));
        
        // If data was cleared, use zeros and empty arrays - no fallback demo data
        if (dataCleared) {
            this.data.dashboard = {
                totalIncome: totalIncome,
                totalExpenses: totalExpenses,
                netChange: netChange,
                savingsRate: savingsRate,
                recentTransactions: recentTransactions,
                budgetCategories: budgetCategories
            };
        } else {
            // Use demo data as fallback only if data wasn't cleared
            this.data.dashboard = {
                totalIncome: totalIncome || 8750,
                totalExpenses: totalExpenses || 6230,
                netChange: netChange || 2520,
                savingsRate: savingsRate || 29,
                recentTransactions: recentTransactions.length > 0 ? recentTransactions : [
                    { id: 1, description: 'Monthly Salary - John', amount: 4500, category: 'Income', date: '2024-01-15' },
                    { id: 2, description: 'Freelance Project', amount: 1200, category: 'Income', date: '2024-01-14' },
                    { id: 3, description: 'Whole Foods Grocery', amount: -185, category: 'Food & Dining', date: '2024-01-14' },
                    { id: 4, description: 'Electric Bill', amount: -145, category: 'Utilities', date: '2024-01-13' },
                    { id: 5, description: 'Netflix Subscription', amount: -15, category: 'Entertainment', date: '2024-01-12' },
                    { id: 6, description: 'Gas Station', amount: -65, category: 'Transportation', date: '2024-01-12' },
                    { id: 7, description: 'Coffee Shop', amount: -8, category: 'Food & Dining', date: '2024-01-11' },
                    { id: 8, description: 'Investment Dividends', amount: 245, category: 'Income', date: '2024-01-10' },
                    { id: 9, description: 'Target Shopping', amount: -89, category: 'Shopping', date: '2024-01-10' },
                    { id: 10, description: 'Gym Membership', amount: -45, category: 'Health & Fitness', date: '2024-01-09' }
                ],
                budgetCategories: budgetCategories
            };
        }
        
        console.log('Dashboard data loaded:', this.data.dashboard);
        console.log('Budget categories with spent amounts:', budgetCategories);
        
        // Ensure dashboard section is visible before rendering
        const dashboardSection = document.getElementById('dashboard');
        if (dashboardSection && !dashboardSection.classList.contains('active')) {
            console.log('Dashboard section not active, activating before render...');
            this.navigateToSection('dashboard');
        }
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            this.renderDashboard();
        }, 50);
    }

    async loadTransactions() {
        // Check if user has cleared demo data - if so, use empty array
        const dataCleared = localStorage.getItem('fambudget_data_cleared') === 'true';
        if (dataCleared) {
            this.data.transactions = [];
            console.log('Data was cleared - using empty transactions');
            this.updateCategorySelect();
            this.renderTransactions();
            return;
        }
        
        // Check localStorage first
        const savedTransactions = localStorage.getItem('fambudget_transactions');
        if (savedTransactions) {
            try {
                this.data.transactions = JSON.parse(savedTransactions);
                console.log(`Loaded ${this.data.transactions.length} transactions from localStorage`);
                this.updateCategorySelect();
                this.renderTransactions();
                return;
            } catch (e) {
                console.error('Error parsing saved transactions:', e);
            }
        }
        
        // Generate comprehensive random demo data only if no saved data
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        // Categories for expenses
        const expenseCategories = [
            'Food & Dining', 'Utilities', 'Transportation', 'Entertainment', 
            'Shopping', 'Health & Fitness', 'Education', 'Travel', 
            'Home & Garden', 'Personal Care'
        ];
        
        // Generate random transactions for current month
        const transactions = [];
        let transactionId = 1;
        
        // Add income transactions
        const incomeSources = ['Primary Job', 'Freelance Work', 'Investment Dividends', 'Rental Income', 'Side Business'];
        const incomeAmounts = [3800, 4500, 1200, 1800, 245, 850, 600];
        
        for (let day = 1; day <= 28; day++) {
            // Random income (2-3 per month)
            if (Math.random() > 0.9) {
                transactions.push({
                    id: transactionId++,
                    description: `${incomeSources[Math.floor(Math.random() * incomeSources.length)]} - ${day < 10 ? '0' + day : day}/${currentMonth + 1 < 10 ? '0' + (currentMonth + 1) : currentMonth + 1}`,
                    amount: incomeAmounts[Math.floor(Math.random() * incomeAmounts.length)],
                    category: 'Income',
                    date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                    account: 'Primary Checking'
                });
            }
            
            // Random expenses (3-5 per day)
            const numExpenses = Math.floor(Math.random() * 3) + 2;
            for (let i = 0; i < numExpenses; i++) {
                const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
                const amounts = {
                    'Food & Dining': [8, 15, 25, 45, 78, 120, 185],
                    'Utilities': [42, 65, 85, 120, 145, 180],
                    'Transportation': [12, 23, 35, 45, 65, 89, 120, 245],
                    'Entertainment': [10, 15, 25, 32, 45, 65],
                    'Shopping': [12, 25, 45, 65, 89, 125, 180],
                    'Health & Fitness': [15, 25, 45, 65, 89],
                    'Education': [45, 75, 89, 120, 180],
                    'Travel': [150, 250, 350, 500, 800],
                    'Home & Garden': [25, 45, 65, 95, 150],
                    'Personal Care': [15, 25, 35, 55, 85]
                };
                
                const categoryAmounts = amounts[category] || [25, 50, 75];
                const amount = -categoryAmounts[Math.floor(Math.random() * categoryAmounts.length)];
                
                const descriptions = {
                    'Food & Dining': ['Grocery Store', 'Restaurant', 'Coffee Shop', 'Fast Food', 'Whole Foods', 'Target Grocery'],
                    'Utilities': ['Electric Bill', 'Water Bill', 'Gas Bill', 'Internet Bill', 'Phone Bill'],
                    'Transportation': ['Gas Station', 'Uber Ride', 'Parking', 'Public Transit', 'Car Maintenance', 'Toll Fee'],
                    'Entertainment': ['Netflix', 'Spotify', 'Movie Theater', 'Concert', 'Video Games', 'Books'],
                    'Shopping': ['Amazon', 'Target', 'Walmart', 'Online Store', 'Clothing Store'],
                    'Health & Fitness': ['Gym Membership', 'Yoga Class', 'Supplements', 'Doctor Visit', 'Pharmacy'],
                    'Education': ['Online Course', 'Books', 'Workshop', 'Tuition', 'School Supplies'],
                    'Travel': ['Flight Ticket', 'Hotel', 'Car Rental', 'Travel Insurance', 'Vacation'],
                    'Home & Garden': ['Home Depot', 'Furniture', 'Tools', 'Plants', 'Decor'],
                    'Personal Care': ['Haircut', 'Spa', 'Cosmetics', 'Skincare', 'Salon']
                };
                
                const categoryDescriptions = descriptions[category] || ['Purchase'];
                const description = categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
                
                transactions.push({
                    id: transactionId++,
                    description: description,
                    amount: amount,
                    category: category,
                    date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                    account: Math.random() > 0.7 ? 'Credit Card' : 'Primary Checking'
                });
            }
        }
        
        // Sort by date (newest first)
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        this.data.transactions = transactions;
        // Save to localStorage so clearing works
        localStorage.setItem('fambudget_transactions', JSON.stringify(transactions));
        console.log(`Generated and saved ${transactions.length} demo transactions`);
        this.updateCategorySelect();
        this.renderTransactions();
    }

    async loadAccounts() {
        // Check if user has cleared demo data - if so, use empty array
        const dataCleared = localStorage.getItem('fambudget_data_cleared') === 'true';
        if (dataCleared) {
            this.data.accounts = [];
            console.log('Data was cleared - using empty accounts');
            this.renderAccounts();
            this.updateAccountSelects();
            return;
        }
        
        // Check localStorage first
        const savedAccounts = localStorage.getItem('fambudget_accounts');
        if (savedAccounts) {
            try {
                this.data.accounts = JSON.parse(savedAccounts);
                console.log(`Loaded ${this.data.accounts.length} accounts from localStorage`);
                this.renderAccounts();
                this.updateAccountSelects();
                return;
            } catch (e) {
                console.error('Error parsing saved accounts:', e);
            }
        }
        
        // Use comprehensive demo data for visual representation only if no saved data
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
        // Save to localStorage so clearing works
        localStorage.setItem('fambudget_accounts', JSON.stringify(this.data.accounts));
        this.renderAccounts();
        this.updateAccountSelects();
    }

    async loadGoals() {
        // Check if user has cleared demo data - if so, use empty array
        const dataCleared = localStorage.getItem('fambudget_data_cleared') === 'true';
        if (dataCleared) {
            this.data.goals = [];
            console.log('Data was cleared - using empty goals');
            this.renderGoals();
            return;
        }
        
        // Check localStorage first
        const savedGoals = localStorage.getItem('fambudget_goals');
        if (savedGoals) {
            try {
                this.data.goals = JSON.parse(savedGoals);
                console.log(`Loaded ${this.data.goals.length} goals from localStorage`);
                this.renderGoals();
                return;
            } catch (e) {
                console.error('Error parsing saved goals:', e);
            }
        }
        
        // Use comprehensive demo data for visual representation only if no saved data
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
        // Save to localStorage so clearing works
        localStorage.setItem('fambudget_goals', JSON.stringify(this.data.goals));
        this.renderGoals();
    }

    async loadReports() {
        // Use comprehensive demo data for visual representation
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
        this.renderReports();
    }

    async loadIncome() {
        // Check if user has cleared demo data - if so, use empty array
        const dataCleared = localStorage.getItem('fambudget_data_cleared') === 'true';
        if (dataCleared) {
            this.data.income = [];
            console.log('Data was cleared - using empty income');
            this.renderIncome();
            return;
        }
        
        // Check localStorage first
        const savedIncome = localStorage.getItem('fambudget_income');
        if (savedIncome) {
            try {
                this.data.income = JSON.parse(savedIncome);
                console.log(`Loaded ${this.data.income.length} income entries from localStorage`);
                this.renderIncome();
                return;
            } catch (e) {
                console.error('Error parsing saved income:', e);
            }
        }
        
        // Use comprehensive demo data for visual representation only if no saved data
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
        // Save to localStorage so clearing works
        localStorage.setItem('fambudget_income', JSON.stringify(this.data.income));
        this.renderIncome();
    }

    async loadIncomeSources() {
        // Check if user has cleared demo data - if so, use empty array
        const dataCleared = localStorage.getItem('fambudget_data_cleared') === 'true';
        if (dataCleared) {
            this.data.incomeSources = [];
            console.log('Data was cleared - using empty income sources');
            this.renderIncomeSources();
            this.updateIncomeSourceSelects();
            return;
        }
        
        // Check localStorage first
        const savedIncomeSources = localStorage.getItem('fambudget_income_sources');
        if (savedIncomeSources) {
            try {
                this.data.incomeSources = JSON.parse(savedIncomeSources);
                console.log(`Loaded ${this.data.incomeSources.length} income sources from localStorage`);
                this.renderIncomeSources();
                return;
            } catch (e) {
                console.error('Error parsing saved income sources:', e);
            }
        }
        
        // Use comprehensive demo data for visual representation only if no saved data
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
        // Save to localStorage so clearing works
        localStorage.setItem('fambudget_income_sources', JSON.stringify(this.data.incomeSources));
        this.renderIncomeSources();
        this.updateIncomeSourceSelects();
    }

    navigateToSection(section) {
        if (!section) {
            console.warn('navigateToSection called without section');
            return;
        }

        console.log('Navigating to section:', section);

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeNav = document.querySelector(`[data-section="${section}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
        } else {
            console.warn('Navigation item not found for section:', section);
        }

        // Update content - ensure we find the section before removing active classes
        const targetSection = document.getElementById(section);
        if (!targetSection) {
            console.error('Content section not found:', section);
            // If dashboard is missing, try to find it and show it
            if (section === 'dashboard') {
                const dashEl = document.querySelector('#dashboard');
                if (dashEl) {
                    dashEl.classList.add('active');
                    console.log('Dashboard found and activated via fallback');
                }
            }
            return;
        }

        // Remove active from all sections EXCEPT the target
        document.querySelectorAll('.content-section').forEach(sec => {
            if (sec.id !== section) {
                sec.classList.remove('active');
                // Force hide other sections
                sec.style.display = 'none';
                sec.style.opacity = '0';
            }
        });
        
        // Add active to target section AND force visibility
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
        targetSection.style.opacity = '1';
        targetSection.style.visibility = 'visible';
        this.currentSection = section;
        console.log('Section activated:', section, 'Element:', targetSection, 'Has active class:', targetSection.classList.contains('active'));
        
        // Force a reflow to ensure CSS applies
        void targetSection.offsetHeight;
        
        // Double-check the section is visible
        const computedStyle = window.getComputedStyle(targetSection);
        console.log('Section display style:', computedStyle.display, 'Opacity:', computedStyle.opacity, 'Visibility:', computedStyle.visibility);
        
        // Render the appropriate content for the section IMMEDIATELY
        try {
            switch(section) {
                case 'dashboard':
                    if (this.data.dashboard) {
                        this.renderDashboard();
                    } else {
                        // Load dashboard data if not already loaded
                        this.loadDashboardData();
                    }
                    break;
                case 'transactions':
                    console.log('Rendering transactions section...');
                    if (!this.data.transactions || this.data.transactions.length === 0) {
                        console.log('No transactions data, loading...');
                        this.loadTransactions();
                    }
                    this.renderTransactions();
                    break;
                case 'accounts':
                    console.log('Rendering accounts section...');
                    if (!this.data.accounts || this.data.accounts.length === 0) {
                        console.log('No accounts data, loading...');
                        this.loadAccounts();
                    }
                    this.renderAccounts();
                    break;
                case 'income':
                    console.log('Rendering income section...');
                    if (!this.data.income || this.data.income.length === 0) {
                        console.log('No income data, loading...');
                        this.loadIncome();
                    }
                    if (!this.data.incomeSources || this.data.incomeSources.length === 0) {
                        this.loadIncomeSources();
                    }
                    this.renderIncome();
                    this.renderIncomeSources();
                    break;
                case 'goals':
                    console.log('Rendering goals section...');
                    if (!this.data.goals || this.data.goals.length === 0) {
                        console.log('No goals data, loading...');
                        this.loadGoals();
                    }
                    this.renderGoals();
                    break;
                case 'reports':
                    console.log('Rendering reports section...');
                    if (!this.data.reports) {
                        console.log('No reports data, loading...');
                        this.loadReports();
                    }
                    this.renderReports();
                    break;
                case 'settings':
                    console.log('Settings section - no rendering needed');
                    // Settings doesn't need rendering
                    break;
            }
        } catch (error) {
            console.error(`Error rendering section ${section}:`, error);
            console.error('Error stack:', error.stack);
        }

        // Ensure scroll to top for better UX
        window.scrollTo({ top: 0, behavior: 'smooth' });

        this.currentSection = section;

        // Render the appropriate content for the section
        setTimeout(() => {
            switch(section) {
                case 'dashboard':
                    if (this.data.dashboard) {
                        this.renderDashboard();
                    } else {
                        // Load dashboard data if not already loaded
                        this.loadDashboardData();
                    }
                    break;
                case 'transactions':
                    this.renderTransactions();
                    break;
                case 'accounts':
                    this.renderAccounts();
                    break;
                case 'income':
                    this.renderIncome();
                    this.renderIncomeSources();
                    break;
                case 'goals':
                    this.renderGoals();
                    break;
                case 'reports':
                    if (this.data.reports) {
                        this.renderReports();
                    }
                    break;
                case 'settings':
                    // Settings doesn't need rendering
                    break;
            }
        }, 100);
    }

    async loadProfile() {
        try {
            const userStr = localStorage.getItem('fambudget_user');
            const householdStr = localStorage.getItem('fambudget_household');
            
            if (userStr) {
                let user = null;
                try {
                    user = JSON.parse(userStr);
                    const profileNameEl = document.getElementById('profileName');
                    const profileEmailEl = document.getElementById('profileEmail');
                    if (profileNameEl) profileNameEl.textContent = user.name || 'User';
                    if (profileEmailEl) profileEmailEl.textContent = user.email || '';
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    const profileNameEl = document.getElementById('profileName');
                    const profileEmailEl = document.getElementById('profileEmail');
                    if (profileNameEl) profileNameEl.textContent = 'User';
                    if (profileEmailEl) profileEmailEl.textContent = '';
                }
                
                // Update avatar with photo, initials, or icon
                const avatarIcon = document.getElementById('profileAvatarIcon');
                if (avatarIcon) {
                    const photoData = localStorage.getItem('fambudget_profile_photo');
                    if (photoData) {
                        avatarIcon.innerHTML = `<img src="${photoData}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
                    } else if (user && user.name) {
                        const initials = user.name.substring(0, 2).toUpperCase();
                        avatarIcon.innerHTML = `<div style="font-size: 48px; font-weight: 300; color: white; font-family: 'Roboto', sans-serif;">${initials}</div>`;
                    }
                }
            }
            
            if (householdStr) {
                try {
                    const household = JSON.parse(householdStr);
                    const profileHouseholdEl = document.getElementById('profileHousehold');
                    if (profileHouseholdEl) profileHouseholdEl.textContent = household.name || '';
                } catch (error) {
                    console.error('Error parsing household data:', error);
                    const profileHouseholdEl = document.getElementById('profileHousehold');
                    if (profileHouseholdEl) profileHouseholdEl.textContent = '';
                }
            }

            // Update dark mode toggle state
            const darkModeToggle = document.getElementById('darkModeToggle');
            if (darkModeToggle) {
                darkModeToggle.checked = this.isDarkTheme;
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }

    showProfileModal() {
        const userStr = localStorage.getItem('fambudget_user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                const editProfileNameEl = document.getElementById('editProfileName');
                const editProfileEmailEl = document.getElementById('editProfileEmail');
                if (editProfileNameEl) editProfileNameEl.value = user.name || '';
                if (editProfileEmailEl) editProfileEmailEl.value = user.email || '';
                
                // Load profile photo if exists
                this.loadProfilePhotoPreview();
            } catch (error) {
                console.error('Error parsing user data in profile modal:', error);
                const editProfileNameEl = document.getElementById('editProfileName');
                const editProfileEmailEl = document.getElementById('editProfileEmail');
                if (editProfileNameEl) editProfileNameEl.value = '';
                if (editProfileEmailEl) editProfileEmailEl.value = '';
            }
        }
        const profileModalEl = document.getElementById('profileModal');
        if (profileModalEl) profileModalEl.style.display = 'flex';
    }

    loadProfilePhotoPreview() {
        const photoData = localStorage.getItem('fambudget_profile_photo');
        const previewEl = document.getElementById('profilePhotoPreview');
        const removeBtn = document.getElementById('removePhotoBtn');
        const userStr = localStorage.getItem('fambudget_user');
        
        if (photoData && previewEl) {
            previewEl.innerHTML = `<img src="${photoData}" alt="Profile Photo">`;
            if (removeBtn) removeBtn.style.display = 'inline-flex';
        } else if (previewEl && userStr) {
            try {
                const user = JSON.parse(userStr);
                const initials = (user.name || 'U').substring(0, 2).toUpperCase();
                previewEl.innerHTML = `<div class="initials">${initials}</div>`;
                if (removeBtn) removeBtn.style.display = 'none';
            } catch (e) {
                previewEl.innerHTML = '<span class="material-icons" id="photoPreviewIcon">account_circle</span>';
                if (removeBtn) removeBtn.style.display = 'none';
            }
        }
    }

    handleProfilePhotoSelect(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Image size should be less than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const photoData = e.target.result;
            const previewEl = document.getElementById('profilePhotoPreview');
            const removeBtn = document.getElementById('removePhotoBtn');
            
            if (previewEl) {
                previewEl.innerHTML = `<img src="${photoData}" alt="Profile Photo">`;
            }
            
            if (removeBtn) {
                removeBtn.style.display = 'inline-flex';
            }
            
            // Store temporarily for save
            this.tempProfilePhoto = photoData;
        };
        
        reader.readAsDataURL(file);
    }

    removeProfilePhoto() {
        const previewEl = document.getElementById('profilePhotoPreview');
        const removeBtn = document.getElementById('removePhotoBtn');
        const photoInput = document.getElementById('profilePhotoInput');
        const userStr = localStorage.getItem('fambudget_user');
        
        // Clear photo data
        this.tempProfilePhoto = null;
        localStorage.removeItem('fambudget_profile_photo');
        
        if (photoInput) {
            photoInput.value = '';
        }
        
        if (previewEl) {
            try {
                const user = JSON.parse(userStr);
                const initials = (user.name || 'U').substring(0, 2).toUpperCase();
                previewEl.innerHTML = `<div class="initials">${initials}</div>`;
            } catch (e) {
                previewEl.innerHTML = '<span class="material-icons" id="photoPreviewIcon">account_circle</span>';
            }
        }
        
        if (removeBtn) {
            removeBtn.style.display = 'none';
        }
        
        // Update display immediately
        this.updateProfilePhotoDisplay();
    }

    hideProfileModal() {
        document.getElementById('profileModal').style.display = 'none';
        // Reset temp photo if modal closed without saving
        this.tempProfilePhoto = null;
    }

    async saveProfile() {
        const name = document.getElementById('editProfileName').value.trim();
        const email = document.getElementById('editProfileEmail').value.trim();

        if (!name) {
            alert('Name cannot be empty');
            return;
        }

        try {
            const apiService = new ApiService();
            const response = await apiService.request('/members/profile', {
                method: 'PATCH',
                body: { name, email }
            });

            // Update localStorage
            const userStr = localStorage.getItem('fambudget_user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    user.name = name;
                    user.email = email;
                    localStorage.setItem('fambudget_user', JSON.stringify(user));
                } catch (error) {
                    console.error('Error parsing user data during save:', error);
                    // Create new user object if parsing fails
                    const newUser = { name, email };
                    localStorage.setItem('fambudget_user', JSON.stringify(newUser));
                }
            }

            // Save profile photo if selected
            if (this.tempProfilePhoto) {
                localStorage.setItem('fambudget_profile_photo', this.tempProfilePhoto);
                this.tempProfilePhoto = null;
            }

            // Update UI
            await this.loadProfile();
            this.updateProfilePhotoDisplay();
            this.hideProfileModal();
            
            // Show success with animation
            this.showMessage('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.response?.data?.message || 'Failed to update profile');
        }
    }

    updateProfilePhotoDisplay() {
        const photoData = localStorage.getItem('fambudget_profile_photo');
        const userStr = localStorage.getItem('fambudget_user');
        
        // Update settings profile avatar
        const settingsAvatar = document.getElementById('profileAvatarIcon');
        if (settingsAvatar) {
            if (photoData) {
                settingsAvatar.innerHTML = `<img src="${photoData}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
            } else if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    const initials = (user.name || 'U').substring(0, 2).toUpperCase();
                    settingsAvatar.innerHTML = `<div style="font-size: 48px; font-weight: 300; color: white; font-family: 'Roboto', sans-serif; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">${initials}</div>`;
                } catch (e) {
                    settingsAvatar.innerHTML = '<span class="material-icons">account_circle</span>';
                }
            }
        }
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('fambudget_token');
            localStorage.removeItem('fambudget_user');
            localStorage.removeItem('fambudget_household');
            // Reload the app instead of redirecting to non-existent login page
            window.location.reload();
        }
    }

    render() {
        console.log('render() called, currentSection:', this.currentSection);
        console.log('Dashboard data:', this.data.dashboard);
        
        // Only render dashboard if it's the current section or if no section is set
        if (this.currentSection === 'dashboard' || !this.currentSection) {
            this.renderDashboard();
        }
        
        // Render other sections only if they're active
        if (this.currentSection === 'transactions') {
            this.renderTransactions();
        }
        if (this.currentSection === 'accounts') {
            this.renderAccounts();
        }
        if (this.currentSection === 'goals') {
            this.renderGoals();
        }
        if (this.currentSection === 'reports') {
            this.renderReports();
        }
        if (this.currentSection === 'income') {
            this.renderIncome();
            this.renderIncomeSources();
        }
    }

    // Calculate totals for different periods
    calculatePeriodTotals(period) {
        const now = new Date();
        let startDate, endDate;
        
        switch(period) {
            case 'daily':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                break;
            case 'monthly':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
                break;
            case 'yearly':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        }

        const transactions = this.data.transactions || [];
        const filteredTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate >= startDate && transactionDate <= endDate;
        });

        const totalIncome = filteredTransactions
            .filter(t => t.amount > 0)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        const totalExpenses = filteredTransactions
            .filter(t => t.amount < 0)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        const netChange = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? Math.round((netChange / totalIncome) * 100) : 0;

        return { totalIncome, totalExpenses, netChange, savingsRate };
    }

    updatePeriodTotals() {
        const totals = this.calculatePeriodTotals(this.currentPeriod);
        const periodLabels = {
            daily: 'Today',
            monthly: 'This Month',
            yearly: 'This Year'
        };

        const totalIncomeEl = document.getElementById('totalIncome');
        const totalExpensesEl = document.getElementById('totalExpenses');
        const netChangeEl = document.getElementById('netChange');
        const savingsRateEl = document.getElementById('savingsRate');
        const incomePeriodLabelEl = document.getElementById('incomePeriodLabel');
        const expensePeriodLabelEl = document.getElementById('expensePeriodLabel');
        const netChangePeriodLabelEl = document.getElementById('netChangePeriodLabel');

        // Update elements if they exist
        if (totalIncomeEl) totalIncomeEl.textContent = this.formatCurrency(totals.totalIncome);
        if (totalExpensesEl) totalExpensesEl.textContent = this.formatCurrency(totals.totalExpenses);
        if (netChangeEl) netChangeEl.textContent = this.formatCurrency(totals.netChange);
        if (savingsRateEl) savingsRateEl.textContent = totals.savingsRate + '%';
        if (incomePeriodLabelEl) incomePeriodLabelEl.textContent = periodLabels[this.currentPeriod];
        if (expensePeriodLabelEl) expensePeriodLabelEl.textContent = periodLabels[this.currentPeriod];
        if (netChangePeriodLabelEl) netChangePeriodLabelEl.textContent = periodLabels[this.currentPeriod];
    }

    // Update budget categories with actual spent amounts
    updateBudgetCategories() {
        if (!this.data.dashboard || !this.data.dashboard.budgetCategories) return;
        
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const monthlyTransactions = (this.data.transactions || []).filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate >= startOfMonth && transactionDate <= endOfMonth;
        });

        const categorySpent = {};
        monthlyTransactions.forEach(t => {
            if (t.amount < 0 && t.category) {
                categorySpent[t.category] = (categorySpent[t.category] || 0) + Math.abs(t.amount);
            }
        });

        // Update budget categories
        this.data.dashboard.budgetCategories = this.data.dashboard.budgetCategories.map(category => {
            const spent = categorySpent[category.name] || 0;
            return {
                ...category,
                spent: spent,
                remaining: category.budget - spent
            };
        });
    }

    // Check budget warnings
    checkBudgetWarnings() {
        this.budgetWarnings = []; // Reset warnings array
        
        if (!this.data.dashboard || !this.data.dashboard.budgetCategories) {
            this.renderBudgetWarnings();
            return;
        }
        
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        // Get transactions for current month
        const monthlyTransactions = (this.data.transactions || []).filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate >= startOfMonth && transactionDate <= endOfMonth;
        });

        // Calculate spent per category
        const categorySpent = {};
        monthlyTransactions.forEach(t => {
            if (t.amount < 0 && t.category) {
                categorySpent[t.category] = (categorySpent[t.category] || 0) + Math.abs(t.amount);
            }
        });

        // Check against budget categories
        const budgetCategories = this.data.dashboard?.budgetCategories || [];
        budgetCategories.forEach(category => {
            const spent = categorySpent[category.name] || 0;
            const percentage = (spent / category.budget) * 100;
            const remaining = category.budget - spent;

            if (percentage >= 100) {
                // Over budget
                this.budgetWarnings.push({
                    category: category.name,
                    type: 'over',
                    message: `${category.name} is over budget by ${this.formatCurrency(spent - category.budget)}`,
                    percentage: percentage,
                    severity: 'high'
                });
            } else if (percentage >= 90) {
                // Near budget limit
                this.budgetWarnings.push({
                    category: category.name,
                    type: 'warning',
                    message: `${category.name} is at ${Math.round(percentage)}% of budget (${this.formatCurrency(remaining)} remaining)`,
                    percentage: percentage,
                    severity: 'medium'
                });
            } else if (percentage >= 75) {
                // Approaching budget
                this.budgetWarnings.push({
                    category: category.name,
                    type: 'info',
                    message: `${category.name} is at ${Math.round(percentage)}% of budget (${this.formatCurrency(remaining)} remaining)`,
                    percentage: percentage,
                    severity: 'low'
                });
            }
        });

        this.renderBudgetWarnings();
    }

    renderBudgetWarnings() {
        const warningsContainer = document.getElementById('budgetWarnings');
        const warningsList = document.getElementById('warningsList');

        // Check if elements exist
        if (!warningsContainer || !warningsList) {
            console.warn('Budget warnings container elements not found');
            return;
        }

        if (this.budgetWarnings.length === 0) {
            warningsContainer.style.display = 'none';
            return;
        }

        warningsContainer.style.display = 'block';
        
        // Sort by severity (high first)
        const severityOrder = { high: 3, medium: 2, low: 1 };
        const sortedWarnings = this.budgetWarnings.sort((a, b) => 
            severityOrder[b.severity] - severityOrder[a.severity]
        );

        warningsList.innerHTML = sortedWarnings.map(warning => {
            const icon = warning.type === 'over' ? 'error' : warning.type === 'warning' ? 'warning' : 'info';
            const colorClass = warning.severity === 'high' ? 'warning-high' : 
                              warning.severity === 'medium' ? 'warning-medium' : 'warning-low';
            
            return `
                <div class="warning-item ${colorClass}">
                    <span class="material-icons">${icon}</span>
                    <div class="warning-content">
                        <div class="warning-message">${warning.message}</div>
                        <div class="warning-progress">
                            <div class="warning-progress-bar" style="width: ${Math.min(warning.percentage, 100)}%"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderDashboard() {
        console.log('renderDashboard called');
        
        // Ensure dashboard section is visible FIRST
        const dashboardSection = document.getElementById('dashboard');
        if (!dashboardSection) {
            console.error('Dashboard section element not found!');
            return;
        }
        
        if (!dashboardSection.classList.contains('active')) {
            console.log('Dashboard section not active, activating...');
            this.navigateToSection('dashboard');
        }
        
        // Ensure dashboard data exists, if not load it
        if (!this.data.dashboard) {
            console.log('Dashboard data not loaded, loading now...');
            this.loadDashboardData();
            return;
        }

        console.log('Dashboard data exists, rendering...', this.data.dashboard);

        const { totalIncome, totalExpenses, netChange, savingsRate, recentTransactions, budgetCategories } = this.data.dashboard;

        // Update budget categories first
        this.updateBudgetCategories();
        
        // Update period totals
        try {
            this.updatePeriodTotals();
        } catch (error) {
            console.error('Error updating period totals:', error);
        }

        // Check budget warnings
        try {
            this.checkBudgetWarnings();
        } catch (error) {
            console.error('Error checking budget warnings:', error);
        }
        
        // Update budget categories spent amounts based on transactions
        try {
            this.updateBudgetCategories();
        } catch (error) {
            console.error('Error updating budget categories:', error);
        }

        // Render recent transactions
        const recentTransactionsContainer = document.getElementById('recentTransactions');
        console.log('Recent transactions container:', recentTransactionsContainer, 'Data:', recentTransactions);
        if (recentTransactionsContainer && recentTransactions) {
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
        }

        // Render budget categories
        const budgetCategoriesContainer = document.getElementById('budgetCategories');
        console.log('Budget categories container:', budgetCategoriesContainer, 'Data:', budgetCategories);
        if (budgetCategoriesContainer && budgetCategories) {
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
        }

        // Render category chart - try multiple times to ensure it renders
        const maxAttempts = 10;
        const renderChartWithRetry = (attempts = 0) => {
            try {
                console.log(`Attempting to render category chart (attempt ${attempts + 1}/${maxAttempts})...`);
                
                if (typeof Chart === 'undefined') {
                    console.warn('Chart.js not loaded yet, waiting...');
                    if (attempts < maxAttempts) {
                        setTimeout(() => renderChartWithRetry(attempts + 1), 500);
                    } else {
                        console.error('Chart.js still not loaded after all attempts');
                        const container = document.getElementById('categoryChart');
                        if (container) {
                            container.innerHTML = '<div style="text-align: center; color: #f44336; padding: 20px; border: 2px solid #f44336; border-radius: 8px;"><strong>Chart.js Failed to Load</strong><br>Please refresh the page or check your internet connection.</div>';
                        }
                    }
                    return;
                }
                
                // Chart.js is loaded, verify data exists
                if (!this.data.dashboard || !this.data.dashboard.budgetCategories || this.data.dashboard.budgetCategories.length === 0) {
                    console.warn('No budget categories data available yet');
                    if (attempts < maxAttempts) {
                        setTimeout(() => renderChartWithRetry(attempts + 1), 300);
                    }
                    return;
                }
                
                // Chart.js is loaded and data exists, render the chart
                console.log('Rendering chart now with data:', this.data.dashboard.budgetCategories);
                this.renderCategoryChart();
            } catch (error) {
                console.error('Error rendering category chart:', error);
                console.error('Error stack:', error.stack);
                if (attempts < maxAttempts) {
                    setTimeout(() => renderChartWithRetry(attempts + 1), 300);
                }
            }
        };
        
        // Start rendering with retry
        setTimeout(() => renderChartWithRetry(), 500);
        
        // Apply dashboard customization
        if (this.dashboardCustomization) {
            try {
                this.dashboardCustomization.renderDashboard();
            } catch (error) {
                console.error('Error applying dashboard customization:', error);
            }
        }
        
        console.log('renderDashboard completed');
    }

    renderTransactions(transactions = null) {
        console.log('renderTransactions called');
        // Ensure transactions section is visible
        const transactionsSection = document.getElementById('transactions');
        if (transactionsSection && !transactionsSection.classList.contains('active')) {
            console.log('Transactions section not active, but rendering anyway');
        }
        
        const tbody = document.getElementById('transactionsTableBody');
        if (!tbody) {
            console.error('transactionsTableBody not found');
            return;
        }

        // Use provided transactions or default to all transactions
        let transactionsToRender = transactions || this.data.transactions;

        // Apply account filter if present (only if not using search results)
        if (!transactions) {
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
        }

        if (transactionsToRender.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #666;">
                        No transactions found. ${transactions ? 'Try adjusting your filters.' : 'Add your first transaction to get started!'}
                    </td>
                </tr>
            `;
        } else {
            // Sort transactions by date (newest first)
            transactionsToRender.sort((a, b) => new Date(b.date) - new Date(a.date));
            
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
                        <button class="btn btn-secondary" onclick="app.splitTransaction(${transaction.id})">Split</button>
                        <button class="btn btn-secondary" onclick="app.deleteTransaction(${transaction.id})">Delete</button>
                    </td>
                </tr>
            `).join('');
        }
        
        // Update transaction count display
        const transactionCountEl = document.getElementById('transactionCount');
        if (transactionCountEl) {
            const totalCount = this.data.transactions.length;
            const filteredCount = transactionsToRender.length;
            if (filteredCount < totalCount) {
                transactionCountEl.textContent = `(${filteredCount} of ${totalCount})`;
            } else {
                transactionCountEl.textContent = `(${totalCount})`;
            }
        }
        
        console.log(`Rendered ${transactionsToRender.length} transactions`);
    }

    renderAccounts() {
        console.log('renderAccounts called');
        // Ensure accounts section is visible
        const accountsSection = document.getElementById('accounts');
        if (accountsSection && !accountsSection.classList.contains('active')) {
            console.log('Accounts section not active, but rendering anyway');
        }
        
        const accountsGrid = document.getElementById('accountsGrid');
        if (!accountsGrid) {
            console.error('accountsGrid not found');
            return;
        }
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
                    <button type="button" class="btn btn-secondary account-edit-btn" data-account-id="${account.id}">Edit</button>
                    <button type="button" class="btn btn-secondary account-delete-btn" data-account-id="${account.id}">Delete</button>
                </div>
            </div>
        `).join('');
        
        // CRITICAL FIX: Re-apply input field fixes after DOM changes
        setTimeout(() => this.reapplyInputFixes(), 50);
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
        console.log('renderReports called');
        // Ensure reports section is visible
        const reportsSection = document.getElementById('reports');
        if (reportsSection && !reportsSection.classList.contains('active')) {
            console.log('Reports section not active, but rendering anyway');
        }
        
        if (!this.data.reports) {
            console.log('No reports data available');
            return;
        }

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
        console.log('renderIncome called');
        // Ensure income section is visible
        const incomeSection = document.getElementById('income');
        if (incomeSection && !incomeSection.classList.contains('active')) {
            console.log('Income section not active, but rendering anyway');
        }
        
        const tbody = document.getElementById('incomeTableBody');
        if (!tbody) {
            console.error('incomeTableBody not found');
            return;
        }

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
        console.log('renderIncomeSources called');
        const sourcesGrid = document.getElementById('sourcesGrid');
        if (!sourcesGrid) {
            console.error('sourcesGrid not found');
            return;
        }
        
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
        const selects = document.querySelectorAll('#transactionAccount, #accountFilter, #incomeAccount, #recurringAccount');
        selects.forEach(select => {
            select.innerHTML = '<option value="">Select Account</option>' +
                this.data.accounts.map(account => 
                    `<option value="${account.name}">${account.name}</option>`
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
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error('Modal not found:', modalId);
            return;
        }
        
        const formModalIds = ['accountModal', 'transactionModal', 'goalModal', 'incomeModal', 'incomeSourceModal'];
        const isFormModal = formModalIds.includes(modalId);
        
        // Before showing: release focus
        if (isFormModal && document.activeElement && document.activeElement !== document.body) {
            document.activeElement.blur();
        }
        
        const overlay = document.getElementById('modalOverlay');
        const isInsideOverlay = overlay && modal.parentElement === overlay;
        
        // TELEPORT: For form modals, move modal to body so inputs get focus in Electron (no overlay in between)
        if (isFormModal && isInsideOverlay) {
            const existingBackdrop = document.getElementById('modalTeleportBackdrop');
            const existingWrap = document.getElementById('modalTeleportWrap');
            if (existingBackdrop) existingBackdrop.remove();
            if (existingWrap) existingWrap.remove();
            modal.remove();
            const backdrop = document.createElement('div');
            backdrop.id = 'modalTeleportBackdrop';
            backdrop.className = 'modal-teleport-backdrop';
            backdrop.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9998;';
            backdrop.onclick = () => this.hideModal(modalId);
            const wrap = document.createElement('div');
            wrap.id = 'modalTeleportWrap';
            wrap.className = 'modal-teleport-wrap';
            wrap.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:9999;pointer-events:none;';
            modal.style.pointerEvents = 'auto';
            wrap.appendChild(modal);
            document.body.appendChild(backdrop);
            document.body.appendChild(wrap);
        } else if (isInsideOverlay) {
            overlay.classList.add('active');
            overlay.style.display = 'flex';
            overlay.style.visibility = 'visible';
            overlay.style.opacity = '1';
            overlay.style.zIndex = '10000';
            overlay.querySelectorAll('.modal-overlay-content, .modal').forEach(child => {
                if (child.id === 'modalOverlayBackdrop') return;
                child.style.display = child.id === modalId ? 'block' : 'none';
                child.style.visibility = child.id === modalId ? 'visible' : 'hidden';
            });
        }
        
        modal.classList.add('active');
        modal.style.display = 'block';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        modal.style.zIndex = isFormModal && modal.parentElement && modal.parentElement.id === 'modalTeleportWrap' ? '1' : (isInsideOverlay ? '1' : '10000');
        modal.style.pointerEvents = 'auto';
        
        const today = new Date().toISOString().split('T')[0];
        modal.querySelectorAll('input[type="date"]').forEach(input => {
            if (!input.value) input.value = today;
        });
        
        if (isFormModal) {
            const firstInput = modal.querySelector('input:not([type="hidden"]):not([type="color"]), select, textarea');
            
            // CRITICAL FIX: Ensure all input fields are properly enabled for text input
            modal.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="url"], input[type="tel"], input:not([type]), textarea').forEach(input => {
                input.style.webkitUserSelect = 'text';
                input.style.mozUserSelect = 'text';
                input.style.msUserSelect = 'text';
                input.style.userSelect = 'text';
                input.style.pointerEvents = 'auto';
                input.style.imeMode = 'auto';
                input.style.webkitImeMode = 'auto';
                input.style.mozImeMode = 'auto';
                input.style.msImeMode = 'auto';
                input.style.cursor = 'text';
                input.setAttribute('autocomplete', 'off');
                input.setAttribute('autocorrect', 'off');
                input.setAttribute('autocapitalize', 'off');
                input.setAttribute('spellcheck', 'false');
            });
            
            const tryFocus = () => {
                if (firstInput && typeof firstInput.focus === 'function') {
                    firstInput.focus({ preventScroll: false });
                    // Additional focus fix for Electron
                    firstInput.click();
                    firstInput.select();
                }
            };
            if (typeof window.electronAPI !== 'undefined' && typeof window.electronAPI.focusWindow === 'function') {
                window.electronAPI.focusWindow().then(() => {
                    tryFocus();
                    [50, 150, 350, 700, 1200].forEach(ms => setTimeout(tryFocus, ms));
                }).catch(() => {
                    tryFocus();
                    [50, 150, 350, 700, 1200].forEach(ms => setTimeout(tryFocus, ms));
                });
            } else {
                requestAnimationFrame(tryFocus);
                [0, 50, 150, 350, 700, 1200].forEach(ms => setTimeout(tryFocus, ms));
            }
        }
        
        // Initialize modal-specific content
        if (modalId === 'calendarModal' && this.initCalendarModal) {
            this.initCalendarModal();
        } else if (modalId === 'recurringTransactionModal' && this.initRecurringModal) {
            this.initRecurringModal();
        } else if (modalId === 'templateModal' && this.initTemplateModal) {
            this.initTemplateModal();
        } else if (modalId === 'debtModal' && this.initDebtModal) {
            this.initDebtModal();
        } else if (modalId === 'forecastModal' && this.initForecastModal) {
            this.initForecastModal();
        } else if (modalId === 'enhancedSettingsModal' && this.initEnhancedSettings) {
            this.initEnhancedSettings();
        }
    }

    hideModal(modalId) {
        if (modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                if (document.activeElement && modal.contains(document.activeElement)) {
                    document.activeElement.blur();
                }
                // If modal was teleported to body, move it back to overlay and remove teleport elements
                const wrap = document.getElementById('modalTeleportWrap');
                if (wrap && modal.parentElement === wrap) {
                    const overlay = document.getElementById('modalOverlay');
                    if (overlay) {
                        overlay.appendChild(modal);
                    }
                    document.getElementById('modalTeleportBackdrop')?.remove();
                    wrap.remove();
                }
                modal.classList.remove('active');
                modal.style.display = 'none';
                modal.style.visibility = 'hidden';
                modal.style.opacity = '0';
                const overlay = document.getElementById('modalOverlay');
                if (overlay && modal.parentElement === overlay) {
                    overlay.classList.remove('active');
                    overlay.style.display = 'none';
                    overlay.style.visibility = 'hidden';
                    overlay.style.opacity = '0';
                }
            }
            if (modalId === 'modalOverlay') {
                const overlay = document.getElementById('modalOverlay');
                if (overlay) {
                    overlay.classList.remove('active');
                    overlay.style.display = 'none';
                    overlay.style.visibility = 'hidden';
                    overlay.style.opacity = '0';
                }
                document.getElementById('modalTeleportBackdrop')?.remove();
                document.getElementById('modalTeleportWrap')?.remove();
            }
        } else {
            document.querySelectorAll('.modal-overlay').forEach(el => {
                el.classList.remove('active');
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                el.style.opacity = '0';
            });
            const overlay = document.getElementById('modalOverlay');
            if (overlay) {
                overlay.classList.remove('active');
                overlay.style.display = 'none';
                overlay.style.visibility = 'hidden';
                overlay.style.opacity = '0';
            }
            document.getElementById('modalTeleportBackdrop')?.remove();
            const wrap = document.getElementById('modalTeleportWrap');
            if (wrap) {
                const modal = wrap.querySelector('.modal');
                if (modal && document.getElementById('modalOverlay')) {
                    document.getElementById('modalOverlay').appendChild(modal);
                }
                wrap.remove();
            }
        }
    }

    async createRecurringTransaction() {
        if (!this.recurringManager) return;
        
        const recurring = {
            description: document.getElementById('recurringDescription').value,
            amount: parseFloat(document.getElementById('recurringAmount').value),
            category: document.getElementById('recurringCategory').value,
            account: document.getElementById('recurringAccount').value,
            frequency: document.getElementById('recurringFrequency').value,
            startDate: document.getElementById('recurringStartDate').value,
            endDate: document.getElementById('recurringEndDate').value || null,
            notes: document.getElementById('recurringNotes').value || ''
        };
        
        await this.recurringManager.createRecurringTransaction(recurring);
        this.hideModal('recurringTransactionModal');
        this.showMessage('Recurring transaction created successfully!');
    }

    async addTransaction() {
        const formData = {
            description: document.getElementById('transactionDescription').value,
            amount: parseFloat(document.getElementById('transactionAmount').value),
            category: document.getElementById('transactionCategory').value,
            account: document.getElementById('transactionAccount').value,
            date: document.getElementById('transactionDate').value
        };

        // Validate form data
        if (!formData.description || !formData.amount || !formData.category || !formData.account || !formData.date) {
            this.showMessage('Please fill in all required fields correctly!', 'error');
            return;
        }

        // Check if editing existing transaction (stored in data attribute)
        const editingId = document.getElementById('transactionForm').dataset.editingId;
        
        if (editingId) {
            // Update existing transaction
            const transactionIndex = this.data.transactions.findIndex(t => t.id == editingId);
            if (transactionIndex !== -1) {
                this.data.transactions[transactionIndex] = {
                    ...this.data.transactions[transactionIndex],
                    ...formData,
                    account: this.data.accounts.find(acc => acc.id == formData.account)?.name || 'Unknown'
                };
            }
            delete document.getElementById('transactionForm').dataset.editingId;
            this.showMessage('Transaction updated successfully!');
        } else {
            // Add new transaction
            const newTransaction = {
                id: Date.now(),
                ...formData,
                account: this.data.accounts.find(acc => acc.id == formData.account)?.name || 'Unknown'
            };
            this.data.transactions.unshift(newTransaction);
            
            // Save to offline storage
            if (this.offlineStorage) {
                await this.offlineStorage.save('transactions', newTransaction);
                await this.offlineStorage.addToSyncQueue('create', 'transactions', newTransaction);
            }
            
            this.showMessage('Transaction added successfully!');
        }

        this.updateCategorySelect();
        this.updatePeriodTotals();
        this.checkBudgetWarnings();
        this.renderTransactions();
        this.updateStorageStats();
        this.renderDashboard();
        this.hideModal('transactionModal');
    }

    async addAccount() {
        const formData = {
            name: document.getElementById('accountName').value,
            type: document.getElementById('accountType').value,
            balance: parseFloat(document.getElementById('accountBalance').value),
            color: document.getElementById('accountColor').value
        };

        // Validate form data
        if (!formData.name || !formData.type || isNaN(formData.balance)) {
            this.showMessage('Please fill in all required fields correctly!', 'error');
            return;
        }

        if (this.editingAccountId != null) {
            const account = this.data.accounts.find(a => a.id === this.editingAccountId);
            if (account) {
                Object.assign(account, formData);
                this.renderAccounts();
                this.updateAccountSelects();
                this.showMessage('Account updated successfully!');
            }
            this.editingAccountId = null;
            document.querySelector('#accountModal .modal-header h3').textContent = 'Add Account';
        } else {
            const newAccount = { id: Date.now(), ...formData };
            this.data.accounts.push(newAccount);
            this.renderAccounts();
            this.updateAccountSelects();
            this.showMessage('Account added successfully!');
        }
        this.hideModal('accountModal');
    }

    async addGoal() {
        const formData = {
            name: document.getElementById('goalName').value,
            target: parseFloat(document.getElementById('goalTarget').value),
            current: parseFloat(document.getElementById('goalCurrent').value),
            deadline: document.getElementById('goalDeadline').value,
            priority: document.getElementById('goalPriority').value
        };

        // Validate form data
        if (!formData.name || !formData.target || !formData.deadline || !formData.priority) {
            this.showMessage('Please fill in all required fields correctly!', 'error');
            return;
        }

        if (this.editingGoalId) {
            // Update existing goal
            const goalIndex = this.data.goals.findIndex(g => g.id === this.editingGoalId);
            if (goalIndex !== -1) {
                this.data.goals[goalIndex] = {
                    id: this.editingGoalId,
                    ...formData
                };
                this.showMessage('Goal updated successfully!');
            }
            this.editingGoalId = null; // Reset editing flag
        } else {
            // Add new goal
            const newGoal = {
                id: Date.now(),
                ...formData
            };
            this.data.goals.push(newGoal);
            this.showMessage('Goal added successfully!');
        }

        this.renderGoals();
        this.hideModal('goalModal');
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

        // Validate form data
        if (!formData.description || !formData.amount || !formData.date) {
            this.showMessage('Please fill in all required fields correctly!', 'error');
            return;
        }

        if (this.editingIncomeId) {
            // Update existing income
            const incomeIndex = this.data.income.findIndex(i => i.id === this.editingIncomeId);
            if (incomeIndex !== -1) {
                this.data.income[incomeIndex] = {
                    id: this.editingIncomeId,
                    ...formData
                };
                this.showMessage('Income updated successfully!');
            }
            this.editingIncomeId = null; // Reset editing flag
        } else {
            // Add new income
            const newIncome = {
                id: Date.now(),
                ...formData
            };
            this.data.income.unshift(newIncome);
            this.showMessage('Income added successfully!');
        }

        this.renderIncome();
        this.renderIncomeSources();
        this.hideModal('incomeModal');
    }

    async addIncomeSource() {
        const formData = {
            name: document.getElementById('sourceName').value,
            type: document.getElementById('sourceType').value,
            expectedAmount: parseFloat(document.getElementById('expectedAmount').value) || 0,
            color: document.getElementById('sourceColor').value
        };

        // Validate form data
        if (!formData.name || !formData.type) {
            this.showMessage('Please fill in all required fields correctly!', 'error');
            return;
        }

        if (this.editingIncomeSourceId) {
            // Update existing income source
            const sourceIndex = this.data.incomeSources.findIndex(s => s.id === this.editingIncomeSourceId);
            if (sourceIndex !== -1) {
                this.data.incomeSources[sourceIndex] = {
                    id: this.editingIncomeSourceId,
                    ...formData
                };
                this.showMessage('Income source updated successfully!');
            }
            this.editingIncomeSourceId = null; // Reset editing flag
        } else {
            // Add new income source
            const newSource = {
                id: Date.now(),
                ...formData
            };
            this.data.incomeSources.push(newSource);
            this.showMessage('Income source added successfully!');
        }

        this.renderIncomeSources();
        this.updateIncomeSourceSelects();
        this.hideModal('incomeSourceModal');
    }

    editTransaction(id) {
        const transaction = this.data.transactions.find(t => t.id === id);
        if (transaction) {
            // Populate form and show modal
            document.getElementById('transactionDescription').value = transaction.description;
            document.getElementById('transactionAmount').value = Math.abs(transaction.amount);
            document.getElementById('transactionCategory').value = transaction.category;
            document.getElementById('transactionDate').value = transaction.date;
            
            // Set editing ID
            document.getElementById('transactionForm').dataset.editingId = id;
            
            // Find account ID for select
            const account = this.data.accounts.find(acc => acc.name === transaction.account);
            if (account) {
                document.getElementById('transactionAccount').value = account.id;
            }
            
            this.showModal('transactionModal');
        }
    }

    // CRITICAL FIX: Function to re-apply input field fixes after DOM changes
    reapplyInputFixes() {
        // Re-apply input field fixes to all input elements
        document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="url"], input[type="tel"], input:not([type]), textarea').forEach(input => {
            input.style.webkitUserSelect = 'text';
            input.style.mozUserSelect = 'text';
            input.style.msUserSelect = 'text';
            input.style.userSelect = 'text';
            input.style.pointerEvents = 'auto';
            input.style.imeMode = 'auto';
            input.style.webkitImeMode = 'auto';
            input.style.mozImeMode = 'auto';
            input.style.msImeMode = 'auto';
            input.style.cursor = 'text';
            input.setAttribute('autocomplete', 'off');
            input.setAttribute('autocorrect', 'off');
            input.setAttribute('autocapitalize', 'off');
            input.setAttribute('spellcheck', 'false');
        });
    }

    deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            // Reset editing state if deleting the item being edited
            const editingId = document.getElementById('transactionForm')?.dataset?.editingId;
            if (editingId == id) {
                delete document.getElementById('transactionForm').dataset.editingId;
            }
            
            this.data.transactions = this.data.transactions.filter(t => t.id !== id);
            this.updateCategorySelect();
            this.updatePeriodTotals();
            this.checkBudgetWarnings();
            this.renderTransactions();
            this.renderDashboard();
            
            // CRITICAL FIX: Re-apply input field fixes after DOM changes
            setTimeout(() => this.reapplyInputFixes(), 100);
            
            this.showMessage('Transaction deleted successfully!');
        }
    }

    editAccount(id) {
        const account = this.data.accounts.find(a => a.id === id);
        if (account) {
            this.editingAccountId = id;
            document.getElementById('accountName').value = account.name;
            document.getElementById('accountType').value = account.type;
            document.getElementById('accountBalance').value = account.balance;
            document.getElementById('accountColor').value = account.color || '#1976d2';
            document.querySelector('#accountModal .modal-header h3').textContent = 'Edit Account';
            this.showModal('accountModal');
        }
    }

    deleteAccount(id) {
        if (confirm('Are you sure you want to delete this account?')) {
            // Reset editing state if deleting the account being edited
            if (this.editingAccountId == id) {
                this.editingAccountId = null;
            }
            
            this.data.accounts = this.data.accounts.filter(a => a.id !== id);
            this.renderAccounts();
            this.updateAccountSelects();
            
            // CRITICAL FIX: Re-apply input field fixes after DOM changes
            setTimeout(() => this.reapplyInputFixes(), 100);
            
            this.showMessage('Account deleted successfully!');
        }
    }

    editGoal(id) {
        const goal = this.data.goals.find(g => g.id === id);
        if (goal) {
            // Set editing flag
            this.editingGoalId = id;
            
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
            // Reset editing state if deleting the goal being edited
            if (this.editingGoalId == id) {
                this.editingGoalId = null;
            }
            
            this.data.goals = this.data.goals.filter(g => g.id !== id);
            this.renderGoals();
            
            // CRITICAL FIX: Re-apply input field fixes after DOM changes
            setTimeout(() => this.reapplyInputFixes(), 100);
            
            this.showMessage('Goal deleted successfully!');
        }
    }

    editIncome(id) {
        const income = this.data.income.find(i => i.id === id);
        if (income) {
            // Set editing flag
            this.editingIncomeId = id;
            
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
            // Reset editing state if deleting the income being edited
            if (this.editingIncomeId == id) {
                this.editingIncomeId = null;
            }
            
            this.data.income = this.data.income.filter(i => i.id !== id);
            this.renderIncome();
            this.renderIncomeSources();
            
            // CRITICAL FIX: Re-apply input field fixes after DOM changes
            setTimeout(() => this.reapplyInputFixes(), 100);
            
            this.showMessage('Income deleted successfully!');
        }
    }

    editIncomeSource(id) {
        const source = this.data.incomeSources.find(s => s.id === id);
        if (source) {
            // Set editing flag
            this.editingIncomeSourceId = id;
            
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
                // Reset editing state if deleting the source being edited
                if (this.editingIncomeSourceId == id) {
                    this.editingIncomeSourceId = null;
                }
                
                // Remove associated income records
                this.data.income = this.data.income.filter(i => i.source !== source.name);
                this.data.incomeSources = this.data.incomeSources.filter(s => s.id !== id);
                this.renderIncome();
                this.renderIncomeSources();
                this.updateIncomeSourceSelects();
                
                // CRITICAL FIX: Re-apply input field fixes after DOM changes
                setTimeout(() => this.reapplyInputFixes(), 100);
                
                this.showMessage('Income source deleted successfully!');
            }
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
        
        // Re-render charts with new theme
        setTimeout(() => {
            if (this.data.dashboard) {
                this.renderCategoryChart();
            }
            if (this.data.reports) {
                this.renderTrendsChart();
                this.renderBreakdownChart();
            }
        }, 100);
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('fambudget-theme');
        this.isDarkTheme = savedTheme === 'dark';
        document.body.classList.toggle('dark-theme', this.isDarkTheme);
        
        // Update theme toggle icon
        const themeIcon = document.querySelector('#themeToggle .material-icons');
        themeIcon.textContent = this.isDarkTheme ? 'light_mode' : 'dark_mode';
    }

    // Currency formatting methods
    formatCurrency(amount, currency = this.selectedCurrency) {
        const config = this.currencyConfig[currency] || this.currencyConfig.USD;
        const formattedAmount = Math.abs(amount).toLocaleString('en-US', {
            minimumFractionDigits: config.decimals,
            maximumFractionDigits: config.decimals
        });
        
        if (config.position === 'before') {
            return `${config.symbol}${formattedAmount}`;
        } else {
            return `${formattedAmount} ${config.symbol}`;
        }
    }

    changeCurrency(currency) {
        this.selectedCurrency = currency;
        localStorage.setItem('fambudget-currency', currency);
        
        // Update currency selector
        document.getElementById('currencySelect').value = currency;
        
        // Re-render all monetary displays
        this.updatePeriodTotals();
        this.renderDashboard();
        this.renderTransactions();
        this.renderAccounts();
        this.checkBudgetWarnings();
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
        console.log('renderCategoryChart called');
        const container = document.getElementById('categoryChart');
        console.log('Chart container:', container);
        console.log('Dashboard data:', this.data.dashboard);
        console.log('Budget categories:', this.data.dashboard?.budgetCategories);
        console.log('Chart.js available:', typeof Chart !== 'undefined');
        console.log('VisualizationManager:', this.visualizationManager);
        
        if (!container) {
            console.error('categoryChart container not found!');
            return;
        }
        
        if (!this.data.dashboard || !this.data.dashboard.budgetCategories) {
            console.warn('No dashboard data or budget categories available');
            container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No data available</div>';
            return;
        }
        
        const categories = this.data.dashboard.budgetCategories;
        const labels = categories.map(cat => cat.name);
        const data = categories.map(cat => cat.spent);
        console.log('Chart data - Labels:', labels, 'Data:', data);
        console.log('Total spent across all categories:', data.reduce((a, b) => a + b, 0));
        
        // Filter out categories with zero spending for better visualization
        const categoriesWithSpending = categories.filter(cat => cat.spent > 0);
        const filteredLabels = categoriesWithSpending.map(cat => cat.name);
        const filteredData = categoriesWithSpending.map(cat => cat.spent);
        
        console.log('Filtered chart data - Labels:', filteredLabels, 'Data:', filteredData);
        
        // Use filtered data if we have spending, otherwise use all categories
        const chartLabels = filteredLabels.length > 0 ? filteredLabels : labels;
        const chartData = filteredData.length > 0 ? filteredData : data;
        
        // Check if Chart.js is loaded
        if (typeof Chart === 'undefined') {
            console.error('Chart.js not loaded! Attempting to load from CDN...');
            // Try to load Chart.js from CDN immediately
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js';
            script.onload = () => {
                if (typeof Chart !== 'undefined') {
                    console.log('Chart.js loaded from CDN, retrying chart render...');
                    setTimeout(() => this.renderCategoryChart(), 100);
                }
            };
            document.head.appendChild(script);
            container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">Loading Chart.js...</div>';
            return;
        }
        
        console.log('Chart.js is available, creating chart...');
        
        // Clear container but preserve structure
        const existingCanvas = container.querySelector('canvas');
        if (existingCanvas) {
            existingCanvas.remove();
        }
        container.innerHTML = ''; // Clear any error messages
        
        const canvas = document.createElement('canvas');
        canvas.id = 'categoryChartCanvas';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.maxWidth = '100%';
        canvas.style.display = 'block';
        container.appendChild(canvas);
        
        // Ensure container has proper height
        const containerStyle = window.getComputedStyle(container);
        const parentStyle = window.getComputedStyle(container.parentElement);
        console.log('Container styles:', {
            height: containerStyle.height,
            width: containerStyle.width,
            display: containerStyle.display,
            parentHeight: parentStyle.height
        });
        
        if (!containerStyle.height || containerStyle.height === '0px' || containerStyle.height === 'auto') {
            container.style.height = '700px';
            container.style.minHeight = '600px';
        }
        
        // Ensure canvas has dimensions - use larger defaults for bigger chart
        if (!canvas.width || canvas.width === 0) {
            canvas.width = container.clientWidth || 700;
        }
        if (!canvas.height || canvas.height === 0) {
            canvas.height = container.clientHeight || 700;
        }
        
        console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get canvas context');
            container.innerHTML = '<div style="text-align: center; color: #f44336; padding: 20px;">Failed to initialize canvas. Your browser may not support canvas.</div>';
            return;
        }
        
        // Destroy existing chart if it exists
        if (this.categoryChart) {
            try {
                this.categoryChart.destroy();
            } catch (e) {
                console.warn('Error destroying existing chart:', e);
            }
            this.categoryChart = null;
        }

        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ];
        
        try {
            // Detect dark mode from DOM so legend/tooltip colors match current theme
            const isDark = document.body.classList.contains('dark-theme');
            const legendColor = isDark ? '#ffffff' : '#1c1b1f';
            
            console.log('Creating Chart.js chart with data:', { labels, data, colors: colors.slice(0, labels.length), isDark, legendColor });
            
            // Validate data
            if (!chartData || chartData.length === 0 || chartData.every(d => d === 0)) {
                console.warn('No data to display in chart - chartData:', chartData);
                container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No spending data available yet. Add some transactions to see your spending breakdown.</div>';
                return;
            }
            
            console.log('Chart will display:', chartLabels.length, 'categories with total spending:', chartData.reduce((a, b) => a + b, 0));
            
            const chartConfig = {
                type: 'doughnut',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        label: 'Spending by Category',
                        data: chartData,
                        backgroundColor: colors.slice(0, chartLabels.length),
                        borderWidth: 2,
                        borderColor: isDark ? '#333' : '#fff',
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 1.0,
                    layout: {
                        padding: {
                            top: 20,
                            bottom: 20,
                            left: 20,
                            right: 20
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true,
                                pointStyle: 'circle',
                                color: legendColor,
                                font: {
                                    size: 14,
                                    family: "'Roboto', sans-serif",
                                    weight: isDark ? '500' : '400'
                                },
                                generateLabels: (chart) => {
                                    const cData = chart.data;
                                    if (cData.labels.length && cData.datasets.length) {
                                        const total = cData.datasets[0].data.reduce((a, b) => a + b, 0);
                                        return cData.labels.map((label, i) => {
                                            const value = cData.datasets[0].data[i];
                                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                            return {
                                                text: `${label} (${percentage}%)`,
                                                fillStyle: cData.datasets[0].backgroundColor[i],
                                                strokeStyle: cData.datasets[0].borderColor,
                                                lineWidth: cData.datasets[0].borderWidth,
                                                hidden: false,
                                                index: i,
                                                fontColor: legendColor
                                            };
                                        });
                                    }
                                    return [];
                                }
                            }
                        },
                        tooltip: {
                            enabled: true,
                            backgroundColor: isDark ? 'rgba(30, 30, 33, 0.95)' : 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#ffffff',
                            bodyColor: isDark ? '#e8eaed' : '#ffffff',
                            padding: 12,
                            titleFont: {
                                size: 16,
                                weight: 'bold'
                            },
                            bodyFont: {
                                size: 14
                            },
                            callbacks: {
                                label: (context) => {
                                    const labelIndex = chartLabels.indexOf(context.label);
                                    const category = categoriesWithSpending[labelIndex] || categories.find(c => c.name === context.label);
                                    if (!category) return context.label;
                                    
                                    const percentage = category.budget > 0 ? Math.round((category.spent / category.budget) * 100) : 0;
                                    const total = chartData.reduce((a, b) => a + b, 0);
                                    const valuePercentage = total > 0 ? Math.round((context.parsed / total) * 100) : 0;
                                    return [
                                        `${category.name}: ${this.formatCurrency(category.spent)}`,
                                        `${valuePercentage}% of total spending`,
                                        category.budget > 0 ? `${percentage}% of budget` : 'No budget set'
                                    ];
                                }
                            }
                        }
                    },
                    animation: {
                        animateRotate: true,
                        animateScale: true,
                        duration: 1000
                    },
                    cutout: '60%'
                }
            };
            
            console.log('Chart config:', chartConfig);
            this.categoryChart = new Chart(ctx, chartConfig);
            console.log('Chart created successfully:', this.categoryChart);
            console.log('Chart canvas:', canvas);
            console.log('Chart is rendered:', this.categoryChart.canvas);
            
            // Verify chart was created
            if (!this.categoryChart || !this.categoryChart.canvas) {
                throw new Error('Chart creation returned null or invalid');
            }
            
        } catch (error) {
            console.error('Error creating category chart:', error);
            console.error('Error stack:', error.stack);
            console.error('Chart.js version:', typeof Chart !== 'undefined' ? Chart.version : 'not loaded');
            container.innerHTML = `<div style="text-align: center; color: #f44336; padding: 20px; border: 2px solid #f44336; border-radius: 8px; background: #ffebee;">
                <strong>Chart Error</strong><br>
                ${error.message}<br>
                <small style="color: #666;">Chart.js: ${typeof Chart !== 'undefined' ? 'Loaded' : 'Not Loaded'}</small><br>
                <small style="color: #666;">Please check the console (F12) for details</small>
            </div>`;
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
        // Use enhanced visualization if available
        if (this.visualizationManager && typeof Chart !== 'undefined') {
            const container = document.getElementById('breakdownChart');
            if (!container) return;
            
            const dashboard = this.data.dashboard;
            if (!dashboard || !dashboard.budgetCategories) return;
            
            const labels = dashboard.budgetCategories.map(cat => cat.name);
            const spentData = dashboard.budgetCategories.map(cat => cat.spent);
            
            // Create canvas if needed
            let canvas = container.querySelector('canvas');
            if (!canvas) {
                canvas = document.createElement('canvas');
                container.innerHTML = '';
                container.appendChild(canvas);
            }
            
            // Create bar chart
            this.visualizationManager.createBarChart('breakdownChart', labels, [
                { label: 'Spending by Category', data: spentData }
            ], {
                showLegend: false,
                animationDuration: 1000
            });
            return;
        }
        
        // Fallback to original
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

    // Offline Features Setup
    setupOfflineFeatures() {
        // Export data button
        const exportBtn = document.getElementById('exportDataBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }

        // Import data button
        const importBtn = document.getElementById('importDataBtn');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.importData());
        }

        // Refresh stats button
        const refreshStatsBtn = document.getElementById('refreshStatsBtn');
        if (refreshStatsBtn) {
            refreshStatsBtn.addEventListener('click', () => this.updateStorageStats());
        }

        // Manual sync button
        const manualSyncBtn = document.getElementById('manualSyncBtn');
        if (manualSyncBtn) {
            manualSyncBtn.addEventListener('click', () => this.manualSync());
        }

        // Update stats on load
        this.updateStorageStats();
    }

    // Export data to JSON file
    async exportData() {
        try {
            if (!this.offlineStorage) {
                alert('Offline storage not initialized');
                return;
            }

            const data = await this.offlineStorage.exportData();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `fambudget-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showMessage('Data exported successfully!');
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export data: ' + error.message);
        }
    }

    // Import data from JSON file
    async importData() {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = async (event) => {
                    try {
                        if (!this.offlineStorage) {
                            alert('Offline storage not initialized');
                            return;
                        }

                        const confirmImport = confirm(
                            'This will replace all your current data. Are you sure you want to continue?'
                        );
                        
                        if (!confirmImport) return;

                        await this.offlineStorage.importData(event.target.result);
                        localStorage.setItem('fambudget_lastSync', new Date().toISOString());
                        
                        // Reload data
                        await this.loadData();
                        this.render();
                        this.updateStorageStats();
                        
                        this.showMessage('Data imported successfully!');
                    } catch (error) {
                        console.error('Import error:', error);
                        alert('Failed to import data: ' + error.message);
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        } catch (error) {
            console.error('Import error:', error);
            alert('Failed to import data: ' + error.message);
        }
    }

    // Update storage statistics
    async updateStorageStats() {
        if (!this.offlineStorage) return;

        try {
            const stats = await this.offlineStorage.getStats();
            const statsEl = document.getElementById('storageStats');
            if (statsEl) {
                statsEl.innerHTML = `
                    ${stats.transactions} transactions, 
                    ${stats.accounts} accounts, 
                    ${stats.goals} goals, 
                    ${stats.pendingSync} pending sync
                `;
            }

            const syncStatusEl = document.getElementById('syncStatus');
            if (syncStatusEl) {
                if (stats.isOnline) {
                    syncStatusEl.textContent = stats.pendingSync > 0 
                        ? `${stats.pendingSync} items pending sync` 
                        : 'All synced';
                } else {
                    syncStatusEl.textContent = 'Offline - changes will sync when online';
                }
            }
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }

    // Manual sync
    async manualSync() {
        if (!this.offlineStorage) {
            alert('Offline storage not initialized');
            return;
        }

        if (!this.offlineStorage.isOnline) {
            alert('You are currently offline. Sync will happen automatically when you come back online.');
            return;
        }

        try {
            await this.offlineStorage.processSyncQueue();
            localStorage.setItem('fambudget_lastSync', new Date().toISOString());
            this.updateStorageStats();
            this.showMessage('Sync completed!');
        } catch (error) {
            console.error('Sync error:', error);
            alert('Sync failed: ' + error.message);
        }
    }

    // Search transactions
    async searchTransactions(query) {
        if (!query || !query.trim()) {
            this.renderTransactions();
            return;
        }

        if (!this.offlineStorage) {
            // Fallback to in-memory search
            const filtered = this.data.transactions.filter(t => 
                t.description?.toLowerCase().includes(query.toLowerCase()) ||
                t.category?.toLowerCase().includes(query.toLowerCase())
            );
            this.renderTransactions(filtered);
            return;
        }

        try {
            const results = await this.offlineStorage.searchTransactions(query);
            this.renderTransactions(results);
        } catch (error) {
            console.error('Search error:', error);
            // Fallback to in-memory search
            const filtered = this.data.transactions.filter(t => 
                t.description?.toLowerCase().includes(query.toLowerCase()) ||
                t.category?.toLowerCase().includes(query.toLowerCase())
            );
            this.renderTransactions(filtered);
        }
    }

    // Initialize Recurring Transaction Modal
    initRecurringModal() {
        if (!this.recurringManager) return;
        
        // Populate account dropdown
        this.updateAccountSelects();
        
        // Set default start date
        const startDateInput = document.getElementById('recurringStartDate');
        if (startDateInput && !startDateInput.value) {
            startDateInput.value = new Date().toISOString().split('T')[0];
        }
    }

    // Initialize Template Modal
    async initTemplateModal() {
        if (!this.templatesManager) return;
        
        await this.renderTemplates();
        
        // Setup form handler
        const form = document.getElementById('templateForm');
        if (form && !form.dataset.initialized) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.createTemplate();
            });
            form.dataset.initialized = 'true';
        }
    }

    async renderTemplates() {
        if (!this.templatesManager) return;
        
        const container = document.getElementById('templatesContainer');
        if (!container) return;
        
        const templates = this.templatesManager.templates;
        container.innerHTML = templates.map(template => `
            <div class="template-card" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${template.name}</strong>
                    <p style="margin: 4px 0; color: #666;">${template.description} - ${this.formatCurrency(template.amount)}</p>
                    <span style="font-size: 12px; color: #999;">${template.category}</span>
                </div>
                <div>
                    <button class="btn btn-secondary" onclick="app.useTemplate(${template.id})" style="margin-right: 8px;">Use</button>
                    <button class="btn btn-secondary" onclick="app.deleteTemplate(${template.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    async createTemplate() {
        if (!this.templatesManager) return;
        
        const template = {
            name: document.getElementById('templateName').value,
            description: document.getElementById('templateDescription').value,
            amount: parseFloat(document.getElementById('templateAmount').value),
            category: document.getElementById('templateCategory').value
        };
        
        await this.templatesManager.createTemplate(null, template.name);
        await this.renderTemplates();
        document.getElementById('templateForm').reset();
        this.showMessage('Template created successfully!');
    }

    async useTemplate(templateId) {
        if (!this.templatesManager) return;
        
        const transaction = await this.templatesManager.useTemplate(templateId, {
            date: new Date().toISOString().split('T')[0],
            account: this.data.accounts[0]?.name || ''
        });
        
        if (transaction) {
            // Fill transaction form with template data
            document.getElementById('transactionDescription').value = transaction.description;
            document.getElementById('transactionAmount').value = Math.abs(transaction.amount);
            document.getElementById('transactionCategory').value = transaction.category;
            this.hideModal('templateModal');
            this.showModal('transactionModal');
        }
    }

    async deleteTemplate(templateId) {
        if (!this.templatesManager) return;
        
        if (confirm('Delete this template?')) {
            await this.templatesManager.deleteTemplate(templateId);
            await this.renderTemplates();
            this.showMessage('Template deleted');
        }
    }

    // Initialize Debt Modal
    async initDebtModal() {
        if (!this.debtTracker) return;
        
        await this.renderDebts();
        this.updateDebtSummary();
        
        // Setup form handler
        const form = document.getElementById('debtForm');
        if (form && !form.dataset.initialized) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.addDebt();
            });
            form.dataset.initialized = 'true';
        }
    }

    async renderDebts() {
        if (!this.debtTracker) return;
        
        const container = document.getElementById('debtsContainer');
        if (!container) return;
        
        const debts = this.debtTracker.debts;
        container.innerHTML = debts.map(debt => `
            <div class="debt-card" style="padding: 16px; border: 1px solid #ddd; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <h4 style="margin: 0 0 8px 0;">${debt.name}</h4>
                        <p style="margin: 4px 0; color: #666;">Balance: ${this.formatCurrency(debt.currentBalance)}</p>
                        <p style="margin: 4px 0; color: #666;">Interest: ${debt.interestRate}%</p>
                        <p style="margin: 4px 0; color: #666;">Min Payment: ${this.formatCurrency(debt.minimumPayment)}</p>
                    </div>
                    <button class="btn btn-secondary" onclick="app.deleteDebt(${debt.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    updateDebtSummary() {
        if (!this.debtTracker) return;
        
        const summary = this.debtTracker.getDebtSummary();
        document.getElementById('totalDebtAmount').textContent = this.formatCurrency(summary.totalDebt);
        document.getElementById('totalMinPayments').textContent = this.formatCurrency(summary.totalMinimumPayments);
        document.getElementById('debtFreeDate').textContent = summary.debtFreeDate 
            ? new Date(summary.debtFreeDate).toLocaleDateString() 
            : 'N/A';
    }

    async addDebt() {
        if (!this.debtTracker) return;
        
        const debt = {
            name: document.getElementById('debtName').value,
            type: document.getElementById('debtType').value,
            principal: parseFloat(document.getElementById('debtPrincipal').value),
            currentBalance: parseFloat(document.getElementById('debtBalance').value),
            interestRate: parseFloat(document.getElementById('debtInterestRate').value) || 0,
            minimumPayment: parseFloat(document.getElementById('debtMinPayment').value) || 0,
            dueDate: document.getElementById('debtDueDate').value || null
        };
        
        await this.debtTracker.addDebt(debt);
        await this.renderDebts();
        this.updateDebtSummary();
        document.getElementById('debtForm').reset();
        this.showMessage('Debt added successfully!');
    }

    async deleteDebt(debtId) {
        if (!this.debtTracker) return;
        
        if (confirm('Delete this debt?')) {
            await this.debtTracker.deleteDebt(debtId);
            await this.renderDebts();
            this.updateDebtSummary();
            this.showMessage('Debt deleted');
        }
    }

    // Initialize Calendar Modal
    initCalendarModal() {
        if (!this.calendarManager) return;
        
        this.currentCalendarDate = new Date();
        this.renderCalendar();
    }

    renderCalendar() {
        if (!this.calendarManager) return;
        
        const year = this.currentCalendarDate.getFullYear();
        const month = this.currentCalendarDate.getMonth();
        
        document.getElementById('calendarMonthYear').textContent = 
            this.currentCalendarDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        
        const calendarData = this.calendarManager.getCalendarData(year, month);
        const grid = document.getElementById('calendarGrid');
        if (!grid) return;
        
        // Weekday headers
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        grid.innerHTML = weekdays.map(day => `
            <div style="padding: 8px; text-align: center; font-weight: 600; background: #f5f5f5;">${day}</div>
        `).join('');
        
        // Calendar days
        calendarData.forEach(day => {
            if (day.date === null) {
                grid.innerHTML += '<div></div>';
            } else {
                const hasTransactions = day.transactions.length > 0;
                const income = day.income > 0;
                const expenses = day.expenses > 0;
                
                grid.innerHTML += `
                    <div style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; min-height: 80px; cursor: pointer;" 
                         onclick="app.showDayTransactions('${day.date}')">
                        <div style="font-weight: 600; margin-bottom: 4px;">${day.day}</div>
                        ${income ? `<div style="color: #4caf50; font-size: 12px;">+${this.formatCurrency(day.income)}</div>` : ''}
                        ${expenses ? `<div style="color: #f44336; font-size: 12px;">-${this.formatCurrency(day.expenses)}</div>` : ''}
                        ${hasTransactions ? `<div style="font-size: 10px; color: #999; margin-top: 4px;">${day.transactions.length} txns</div>` : ''}
                    </div>
                `;
            }
        });
    }

    changeCalendarMonth(delta) {
        this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + delta);
        this.renderCalendar();
    }

    showDayTransactions(date) {
        const transactions = this.calendarManager.getTransactionsForDate(date);
        alert(`Transactions for ${date}:\n\n${transactions.map(t => 
            `${t.description}: ${this.formatCurrency(t.amount)}`
        ).join('\n') || 'No transactions'}`);
    }

    // Initialize Forecast Modal
    async initForecastModal() {
        if (!this.forecastManager) return;
        
        await this.updateForecast();
    }

    async updateForecast() {
        if (!this.forecastManager) return;
        
        const days = parseInt(document.getElementById('forecastDays')?.value || 30);
        const forecast = this.forecastManager.forecastCashFlow(days);
        
        const currentBalance = this.forecastManager.getCurrentTotalBalance();
        const projectedBalance = forecast[forecast.length - 1]?.projectedBalance || currentBalance;
        const warnings = this.forecastManager.getLowBalancePredictions(days, 100);
        
        document.getElementById('forecastCurrentBalance').textContent = this.formatCurrency(currentBalance);
        document.getElementById('forecastProjectedBalance').textContent = this.formatCurrency(projectedBalance);
        document.getElementById('forecastWarnings').textContent = warnings.length;
        
        // Render forecast table
        const table = document.getElementById('forecastTable');
        if (table) {
            table.innerHTML = `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f5f5f5;">
                            <th style="padding: 8px; border: 1px solid #ddd;">Date</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Income</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Expenses</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Net</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${forecast.slice(0, 30).map(day => `
                            <tr style="${day.projectedBalance < 100 ? 'background: #fff3e0;' : ''}">
                                <td style="padding: 8px; border: 1px solid #ddd;">${new Date(day.date).toLocaleDateString()}</td>
                                <td style="padding: 8px; border: 1px solid #ddd; color: #4caf50;">${this.formatCurrency(day.income)}</td>
                                <td style="padding: 8px; border: 1px solid #ddd; color: #f44336;">${this.formatCurrency(day.expenses)}</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${this.formatCurrency(day.net)}</td>
                                <td style="padding: 8px; border: 1px solid #ddd; font-weight: 600;">${this.formatCurrency(day.projectedBalance)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
    }

    // Initialize Enhanced Settings
    initEnhancedSettings() {
        // Load notification preferences
        if (this.notificationsManager) {
            const prefs = this.notificationsManager.preferences;
            document.getElementById('notifBudgetAlerts').checked = prefs.budgetAlerts;
            document.getElementById('notifBillReminders').checked = prefs.billReminders;
            document.getElementById('notifLowBalance').checked = prefs.lowBalance;
            document.getElementById('notifGoalMilestones').checked = prefs.goalMilestones;
        }
        
        // Load backup settings
        if (this.backupManager) {
            const schedule = this.backupManager.backupSchedule;
            document.getElementById('backupEnabled').checked = schedule.enabled;
            document.getElementById('backupFrequency').value = schedule.frequency;
            document.getElementById('backupTime').value = schedule.time || '02:00';
            document.getElementById('backupKeep').value = schedule.keepBackups || 30;
        }
        
        // Load exchange rate info
        if (this.currencyConverter) {
            const updateDate = this.currencyConverter.lastUpdate;
            document.getElementById('exchangeRateUpdate').textContent = updateDate 
                ? updateDate.toLocaleString() 
                : 'Never updated';
        }
    }

    showSettingsTab(tabName) {
        document.querySelectorAll('.settings-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.settings-tab-content').forEach(content => content.classList.remove('active'));
        
        event.target.classList.add('active');
        document.getElementById(tabName + 'Settings').classList.add('active');
    }

    async saveBackupSettings() {
        if (!this.backupManager) return;
        
        await this.backupManager.setSchedule(
            document.getElementById('backupEnabled').checked,
            document.getElementById('backupFrequency').value,
            document.getElementById('backupTime').value
        );
        
        this.backupManager.backupSchedule.keepBackups = parseInt(document.getElementById('backupKeep').value);
        await this.backupManager.saveBackupSchedule();
        
        this.showMessage('Backup settings saved!');
    }

    async createBackupNow() {
        if (!this.backupManager) return;
        
        const success = await this.backupManager.createBackup();
        if (success) {
            this.showMessage('Backup created successfully!');
        } else {
            alert('Failed to create backup');
        }
    }

    async updateExchangeRates() {
        if (!this.currencyConverter) return;
        
        await this.currencyConverter.loadExchangeRates();
        document.getElementById('exchangeRateUpdate').textContent = 
            this.currencyConverter.lastUpdate?.toLocaleString() || 'Updated';
        this.showMessage('Exchange rates updated!');
    }

    async regenerateEncryptionKey() {
        if (!confirm('Regenerating encryption key will require re-encryption of all data. Continue?')) {
            return;
        }
        
        if (this.encryptionManager) {
            await this.encryptionManager.loadOrCreateKey();
            this.showMessage('Encryption key regenerated');
        }
    }

    // Dashboard Customization Methods
    showDashboardCustomization() {
        this.renderWidgetCustomization();
        this.showModal('dashboardCustomizationModal');
    }

    renderWidgetCustomization() {
        if (!this.dashboardCustomization) return;
        
        const container = document.getElementById('widgetCustomizationList');
        if (!container) return;
        
        container.innerHTML = this.dashboardCustomization.widgets.map(widget => `
            <div class="widget-config-item" style="padding: 16px; border: 1px solid #ddd; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1;">
                    <strong>${widget.name}</strong>
                    <div style="font-size: 12px; color: #666; margin-top: 4px;">Size: ${widget.size}</div>
                </div>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <select onchange="app.changeWidgetSize('${widget.id}', this.value)" style="padding: 6px;">
                        <option value="full" ${widget.size === 'full' ? 'selected' : ''}>Full Width</option>
                        <option value="half" ${widget.size === 'half' ? 'selected' : ''}>Half Width</option>
                        <option value="third" ${widget.size === 'third' ? 'selected' : ''}>Third Width</option>
                    </select>
                    <label class="switch">
                        <input type="checkbox" ${widget.visible ? 'checked' : ''} 
                               onchange="app.toggleWidget('${widget.id}')">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
        `).join('');
    }

    async toggleWidget(widgetId) {
        if (this.dashboardCustomization) {
            await this.dashboardCustomization.toggleWidget(widgetId);
            this.renderWidgetCustomization();
            this.renderDashboard();
        }
    }

    async changeWidgetSize(widgetId, size) {
        if (this.dashboardCustomization) {
            await this.dashboardCustomization.changeWidgetSize(widgetId, size);
            this.renderDashboard();
        }
    }

    showLayoutManager() {
        this.renderLayouts();
        this.showModal('layoutManagerModal');
    }

    renderLayouts() {
        if (!this.dashboardCustomization) return;
        
        const container = document.getElementById('layoutsList');
        if (!container) return;
        
        const layouts = this.dashboardCustomization.layouts;
        document.getElementById('savedLayoutsCount').textContent = `${layouts.length} layouts saved`;
        
        container.innerHTML = layouts.map(layout => `
            <div class="layout-item" style="padding: 16px; border: 1px solid #ddd; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${layout.name}</strong>
                    <div style="font-size: 12px; color: #666; margin-top: 4px;">
                        Created: ${new Date(layout.createdAt).toLocaleDateString()}
                    </div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-secondary" onclick="app.loadLayout(${layout.id})">Load</button>
                    ${layout.id !== 'default' ? `<button class="btn btn-secondary" onclick="app.deleteLayout(${layout.id})">Delete</button>` : ''}
                </div>
            </div>
        `).join('');
    }

    async loadLayout(layoutId) {
        if (this.dashboardCustomization) {
            await this.dashboardCustomization.loadLayout(layoutId);
            this.hideModal('layoutManagerModal');
            this.showMessage('Layout loaded successfully!');
        }
    }

    async deleteLayout(layoutId) {
        if (!confirm('Delete this layout?')) return;
        
        if (this.dashboardCustomization) {
            await this.dashboardCustomization.deleteLayout(layoutId);
            this.renderLayouts();
            this.showMessage('Layout deleted');
        }
    }

    async saveDashboardLayout() {
        const name = prompt('Enter layout name:');
        if (!name) return;
        
        if (this.dashboardCustomization) {
            await this.dashboardCustomization.saveCurrentLayout(name);
            this.hideModal('dashboardCustomizationModal');
            this.showMessage('Layout saved successfully!');
        }
    }

    async saveCurrentLayoutAs() {
        const name = prompt('Enter layout name:');
        if (!name) return;
        
        if (this.dashboardCustomization) {
            await this.dashboardCustomization.saveCurrentLayout(name);
            this.renderLayouts();
            this.showMessage('Layout saved successfully!');
        }
    }

    // Split transaction handler
    splitTransaction(transactionId) {
        const transaction = this.data.transactions.find(t => t.id == transactionId);
        if (!transaction) return;
        
        document.getElementById('splitOriginalDesc').textContent = transaction.description;
        document.getElementById('splitOriginalAmount').textContent = this.formatCurrency(transaction.amount);
        document.getElementById('splitTransactionModal').dataset.transactionId = transactionId;
        
        // Initialize split rows
        this.splitSplits = [{ category: transaction.category, amount: Math.abs(transaction.amount) }];
        this.renderSplitRows();
        
        this.showModal('splitTransactionModal');
    }

    renderSplitRows() {
        const container = document.getElementById('splitSplitsContainer');
        if (!container) return;
        
        container.innerHTML = this.splitSplits.map((split, index) => `
            <div class="split-row" style="display: flex; gap: 12px; margin-bottom: 12px; align-items: center;">
                <select class="split-category" style="flex: 1; padding: 8px;" onchange="app.updateSplit(${index}, 'category', this.value)">
                    <option value="">Select Category</option>
                    <option value="Food & Dining" ${split.category === 'Food & Dining' ? 'selected' : ''}>Food & Dining</option>
                    <option value="Transportation" ${split.category === 'Transportation' ? 'selected' : ''}>Transportation</option>
                    <option value="Utilities" ${split.category === 'Utilities' ? 'selected' : ''}>Utilities</option>
                    <option value="Entertainment" ${split.category === 'Entertainment' ? 'selected' : ''}>Entertainment</option>
                    <option value="Health & Fitness" ${split.category === 'Health & Fitness' ? 'selected' : ''}>Health & Fitness</option>
                    <option value="Shopping" ${split.category === 'Shopping' ? 'selected' : ''}>Shopping</option>
                </select>
                <input type="number" class="split-amount" step="0.01" value="${split.amount}" 
                       style="width: 150px; padding: 8px;" 
                       onchange="app.updateSplit(${index}, 'amount', parseFloat(this.value))">
                <button class="btn btn-secondary" onclick="app.removeSplitRow(${index})">Remove</button>
            </div>
        `).join('');
    }

    addSplitRow() {
        if (!this.splitSplits) this.splitSplits = [];
        this.splitSplits.push({ category: '', amount: 0 });
        this.renderSplitRows();
    }

    updateSplit(index, field, value) {
        if (!this.splitSplits) return;
        this.splitSplits[index][field] = value;
    }

    removeSplitRow(index) {
        if (!this.splitSplits) return;
        this.splitSplits.splice(index, 1);
        this.renderSplitRows();
    }

    async applySplit() {
        const transactionId = parseInt(document.getElementById('splitTransactionModal').dataset.transactionId);
        const transaction = this.data.transactions.find(t => t.id == transactionId);
        if (!transaction || !this.splitManager) return;
        
        // Validate splits
        const total = this.splitSplits.reduce((sum, s) => sum + s.amount, 0);
        const originalAmount = Math.abs(transaction.amount);
        
        if (Math.abs(total - originalAmount) > 0.01) {
            alert(`Split total (${this.formatCurrency(total)}) must equal transaction amount (${this.formatCurrency(originalAmount)})`);
            return;
        }
        
        await this.splitManager.applySplit(transaction, this.splitSplits);
        this.hideModal('splitTransactionModal');
        this.showMessage('Transaction split successfully!');
    }
}

// Initialize the app when DOM is loaded and load Chart.js dynamically
// Immediate check - don't wait for DOMContentLoaded
(function() {
    // Check if dashboard exists and is visible RIGHT NOW
    function ensureDashboardVisible() {
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            dashboard.classList.add('active');
            // Hide other sections
            document.querySelectorAll('.content-section').forEach(sec => {
                if (sec.id !== 'dashboard') {
                    sec.classList.remove('active');
                }
            });
            console.log('Dashboard visibility ensured immediately');
        }
    }
    
    // Try immediately
    if (document.readyState === 'loading') {
        ensureDashboardVisible();
    } else {
        // DOM already loaded
        ensureDashboardVisible();
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // Ensure dashboard is visible on DOMContentLoaded
    const dashboard = document.getElementById('dashboard');
    if (dashboard) {
        dashboard.classList.add('active');
        document.querySelectorAll('.content-section').forEach(sec => {
            if (sec.id !== 'dashboard') {
                sec.classList.remove('active');
            }
        });
        console.log('Dashboard visibility ensured on DOMContentLoaded');
    }
    // Load Chart.js first, then initialize the app
    const loadChartJs = () => {
        return new Promise((resolve, reject) => {
            // Check if Chart.js is already loaded
        if (typeof Chart !== 'undefined') {
                console.log('Chart.js already loaded');
                resolve();
                return;
        }

            // Try multiple paths: production extraResources, dev node_modules, and CDN fallback
                const script = document.createElement('script');
            let loadAttempt = 0;
            
            const tryLoad = (src, description) => {
                return new Promise((res, rej) => {
                    const testScript = document.createElement('script');
                    testScript.src = src;
                    testScript.onload = () => {
        if (typeof Chart !== 'undefined') {
                            console.log(`Chart.js loaded successfully from: ${description}`);
                            res();
                        } else {
                            rej(new Error(`Chart.js not available after loading from ${description}`));
                        }
                    };
                    testScript.onerror = () => {
                        rej(new Error(`Failed to load from ${description}`));
                    };
                    document.head.appendChild(testScript);
                });
            };

            // Try paths in order
            const paths = [
                // Production: Get path from main process (most reliable)
                async () => {
                    try {
                        const chartJsPath = await window.electronAPI?.getChartJsPath?.();
                        if (chartJsPath) {
                            console.log(`Attempting to load Chart.js from IPC path: ${chartJsPath}`);
                            return tryLoad(chartJsPath, 'production IPC path');
                        }
                    } catch (error) {
                        console.warn('IPC path unavailable:', error);
                    }
                    return Promise.reject(new Error('IPC path unavailable'));
                },
                // Fallback: Manual construction from resources path
                async () => {
                    try {
                        const resourcesPath = await window.electronAPI?.getResourcesPath?.();
                        if (resourcesPath) {
                            // Normalize Windows path for file:// protocol
                            let normalizedPath = resourcesPath.replace(/\\/g, '/');
                            
                            // Handle Windows drive letters (C:, D:, etc.)
                            if (/^[A-Za-z]:/.test(normalizedPath)) {
                                // Windows path with drive letter: C:/path -> /C:/path for file://
                                normalizedPath = '/' + normalizedPath;
                            }
                            
                            // Construct file:// URL (always use triple slash for absolute paths)
                            const filePath = `file://${normalizedPath}/vendor/chart.js/chart.umd.js`;
                            console.log(`Attempting to load Chart.js from resources path: ${filePath}`);
                            return tryLoad(filePath, 'production extraResources');
                        }
                    } catch (error) {
                        console.warn('Resources path unavailable:', error);
                    }
                    return Promise.reject(new Error('No resources path available'));
                },
                // Development: local node_modules
                () => tryLoad('node_modules/chart.js/dist/chart.umd.js', 'dev node_modules'),
                // Fallback: CDN
                () => tryLoad('https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js', 'CDN fallback')
            ];

            // Try each path sequentially
            const attemptLoad = async (index) => {
                if (index >= paths.length) {
                    reject(new Error('All Chart.js loading attempts failed'));
                    return;
                }
                
                try {
                    await paths[index]();
                    resolve();
                } catch (error) {
                    console.warn(`Failed to load Chart.js from path ${index + 1}:`, error.message);
                    attemptLoad(index + 1);
                }
            };

            attemptLoad(0);
        });
    };

    // Load Chart.js first, then initialize app
    loadChartJs()
        .then(() => {
            // Initialize the app after Chart.js is loaded
            window.app = new FamBudgetApp();
            // Expose app globally for onclick handlers
            if (typeof window !== 'undefined') {
                window.app = window.app;
                
                // CRITICAL FIX: Global input field event listeners to ensure text input works
                document.addEventListener('click', (e) => {
                    if (e.target.matches('input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="url"], input[type="tel"], input:not([type]), textarea')) {
                        e.target.style.webkitUserSelect = 'text';
                        e.target.style.mozUserSelect = 'text';
                        e.target.style.msUserSelect = 'text';
                        e.target.style.userSelect = 'text';
                        e.target.style.pointerEvents = 'auto';
                        e.target.style.imeMode = 'auto';
                        e.target.style.webkitImeMode = 'auto';
                        e.target.style.mozImeMode = 'auto';
                        e.target.style.msImeMode = 'auto';
                        e.target.style.cursor = 'text';
                        e.target.focus();
                    }
                });
                
                document.addEventListener('focus', (e) => {
                    if (e.target.matches('input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="url"], input[type="tel"], input:not([type]), textarea')) {
                        e.target.style.webkitUserSelect = 'text';
                        e.target.style.mozUserSelect = 'text';
                        e.target.style.msUserSelect = 'text';
                        e.target.style.userSelect = 'text';
                        e.target.style.pointerEvents = 'auto';
                        e.target.style.imeMode = 'auto';
                        e.target.style.webkitImeMode = 'auto';
                        e.target.style.mozImeMode = 'auto';
                        e.target.style.msImeMode = 'auto';
                        e.target.style.cursor = 'text';
                    }
                }, true);
            }
            console.log('FamBudget app initialized with Chart.js');
        })
        .catch((error) => {
            console.error('Failed to load Chart.js from all sources:', error);
            // Try CDN as last resort
            console.log('Attempting to load Chart.js from CDN as final fallback...');
            const cdnScript = document.createElement('script');
            cdnScript.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js';
            cdnScript.onload = () => {
                if (typeof Chart !== 'undefined') {
                    console.log('Chart.js loaded from CDN fallback successfully');
                    window.app = new FamBudgetApp();
                    if (typeof window !== 'undefined') {
                        window.app = window.app;
                    }
                    setTimeout(() => {
                        if (window.app && window.app.data && window.app.data.dashboard) {
                            console.log('Force rendering chart after CDN load...');
                            window.app.renderCategoryChart();
                        }
                    }, 1000);
                } else {
                    console.error('CDN fallback also failed - Chart.js not available');
                    window.app = new FamBudgetApp();
                    if (typeof window !== 'undefined') {
                        window.app = window.app;
                    }
                }
            };
            cdnScript.onerror = () => {
                console.error('CDN fallback also failed');
                // Initialize app anyway (charts will show error messages)
                window.app = new FamBudgetApp();
                if (typeof window !== 'undefined') {
                    window.app = window.app;
                }
            };
            document.head.appendChild(cdnScript);
        });
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
