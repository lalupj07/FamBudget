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
                    // Electron API removed for web version);
        
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
                    // Electron API removed for web version
        
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
                    // Electron API removed for web version: ${this.formatCurrency(context.parsed.y)}`;
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

// Initialize the app when DOM is loaded and load Chart.js dynamically
document.addEventListener('DOMContentLoaded', () => {
    // Load Chart.js first, then initialize the app
    const loadChartJs = () => {
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
                    resolve();
                } else {
                    reject(new Error('Chart.js not available after loading'));
                }
            };
            script.onerror = () => {
                reject(new Error('Failed to load Chart.js from CDN'));
            };
            document.head.appendChild(script);
        });
    };

    // Load Chart.js first, then initialize app
    loadChartJs()
        .then(() => {
            // Initialize the app after Chart.js is loaded
            window.app = new FamBudgetApp();
            console.log('FamBudget app initialized with Chart.js');
        })
        .catch((error) => {
            console.error('Failed to load Chart.js:', error);
            // Initialize app anyway (charts will show error messages)
            window.app = new FamBudgetApp();
            
            // Show user-friendly error message
            setTimeout(() => {
                const errorMsg = document.createElement('div');
                errorMsg.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #f44336;
                    color: white;
                    padding: 20px 30px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    z-index: 10000;
                    text-align: center;
                `;
                errorMsg.innerHTML = `
                    <h3 style="margin: 0 0 10px 0;">Chart.js Failed to Load</h3>
                    <p style="margin: 0;">Please restart the application.</p>
                `;
                document.body.appendChild(errorMsg);
                setTimeout(() => errorMsg.remove(), 5000);
            }, 1000);
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
