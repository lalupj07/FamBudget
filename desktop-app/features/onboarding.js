// Onboarding & Tutorial Manager
class OnboardingManager {
    constructor(app) {
        this.app = app;
        this.tourSteps = [];
        this.currentStep = 0;
        this.completedTours = [];
    }

    async init() {
        await this.loadCompletedTours();
        this.setupTours();
    }

    async loadCompletedTours() {
        const stored = localStorage.getItem('fambudget_completed_tours');
        if (stored) {
            this.completedTours = JSON.parse(stored);
        }
    }

    async saveCompletedTours() {
        localStorage.setItem('fambudget_completed_tours', JSON.stringify(this.completedTours));
    }

    // Setup tour steps
    setupTours() {
        this.tourSteps = [
            {
                id: 'welcome',
                title: 'Welcome to FamBudget!',
                content: 'Let\'s take a quick tour to help you get started.',
                target: null,
                position: 'center'
            },
            {
                id: 'dashboard',
                title: 'Dashboard Overview',
                content: 'Your dashboard shows a summary of your finances including income, expenses, and savings rate.',
                target: '#dashboard',
                position: 'bottom'
            },
            {
                id: 'transactions',
                title: 'Transaction Management',
                content: 'Add, edit, and track all your transactions here. Use templates for quick entry!',
                target: '[data-section="transactions"]',
                position: 'right'
            },
            {
                id: 'recurring',
                title: 'Recurring Transactions',
                content: 'Set up recurring bills and subscriptions to automatically create transactions.',
                target: '.header-feature-btn[onclick*="recurringTransactionModal"]',
                position: 'bottom'
            },
            {
                id: 'templates',
                title: 'Transaction Templates',
                content: 'Save common transactions as templates for quick entry.',
                target: '.header-feature-btn[onclick*="templateModal"]',
                position: 'bottom'
            },
            {
                id: 'calendar',
                title: 'Financial Calendar',
                content: 'View your transactions and upcoming bills in a calendar view.',
                target: '.header-feature-btn[data-modal="calendarModal"]',
                position: 'bottom'
            },
            {
                id: 'settings',
                title: 'Settings & Customization',
                content: 'Customize your dashboard, manage notifications, and configure backups.',
                target: '[data-section="settings"]',
                position: 'left'
            },
            {
                id: 'complete',
                title: 'You\'re All Set!',
                content: 'Start managing your finances. You can always access this tour from Settings.',
                target: null,
                position: 'center'
            }
        ];
    }

    // Start onboarding tour
    startTour() {
        this.currentStep = 0;
        this.showTourStep();
    }

    // Show current tour step
    showTourStep() {
        if (this.currentStep >= this.tourSteps.length) {
            this.completeTour();
            return;
        }

        const step = this.tourSteps[this.currentStep];
        this.createTourOverlay(step);
    }

    // Create tour overlay
    createTourOverlay(step) {
        // Remove existing overlay
        const existing = document.getElementById('onboardingOverlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'onboardingOverlay';
        overlay.className = 'onboarding-overlay';
        overlay.innerHTML = `
            <div class="onboarding-backdrop"></div>
            <div class="onboarding-tooltip onboarding-${step.position}" id="onboardingTooltip">
                <div class="onboarding-header">
                    <h3>${step.title}</h3>
                    <button class="onboarding-close" onclick="window.onboardingManager.skipTour()">×</button>
                </div>
                <div class="onboarding-content">
                    <p>${step.content}</p>
                </div>
                <div class="onboarding-footer">
                    <div class="onboarding-progress">
                        Step ${this.currentStep + 1} of ${this.tourSteps.length}
                    </div>
                    <div class="onboarding-actions">
                        ${this.currentStep > 0 ? '<button class="btn btn-secondary" onclick="window.onboardingManager.previousStep()">Previous</button>' : ''}
                        <button class="btn btn-primary" onclick="window.onboardingManager.nextStep()">
                            ${this.currentStep === this.tourSteps.length - 1 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Position tooltip
        if (step.target) {
            const target = document.querySelector(step.target);
            if (target) {
                this.positionTooltip(target, step.position);
            }
        } else {
            // Center position
            const tooltip = document.getElementById('onboardingTooltip');
            tooltip.style.position = 'fixed';
            tooltip.style.top = '50%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translate(-50%, -50%)';
        }

        // Highlight target element
        if (step.target) {
            const target = document.querySelector(step.target);
            if (target) {
                target.classList.add('onboarding-highlight');
            }
        }
    }

    // Position tooltip relative to target
    positionTooltip(target, position) {
        const tooltip = document.getElementById('onboardingTooltip');
        if (!tooltip) return;

        const rect = target.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        switch (position) {
            case 'top':
                tooltip.style.top = `${rect.top - tooltipRect.height - 20}px`;
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
                break;
            case 'bottom':
                tooltip.style.top = `${rect.bottom + 20}px`;
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
                break;
            case 'left':
                tooltip.style.top = `${rect.top + rect.height / 2 - tooltipRect.height / 2}px`;
                tooltip.style.left = `${rect.left - tooltipRect.width - 20}px`;
                break;
            case 'right':
                tooltip.style.top = `${rect.top + rect.height / 2 - tooltipRect.height / 2}px`;
                tooltip.style.left = `${rect.right + 20}px`;
                break;
        }
    }

    // Next step
    nextStep() {
        // Remove highlight
        document.querySelectorAll('.onboarding-highlight').forEach(el => {
            el.classList.remove('onboarding-highlight');
        });

        this.currentStep++;
        this.showTourStep();
    }

    // Previous step
    previousStep() {
        document.querySelectorAll('.onboarding-highlight').forEach(el => {
            el.classList.remove('onboarding-highlight');
        });

        this.currentStep--;
        this.showTourStep();
    }

    // Skip tour
    skipTour() {
        this.completeTour();
    }

    // Complete tour
    completeTour() {
        const overlay = document.getElementById('onboardingOverlay');
        if (overlay) overlay.remove();

        document.querySelectorAll('.onboarding-highlight').forEach(el => {
            el.classList.remove('onboarding-highlight');
        });

        this.completedTours.push('main');
        this.saveCompletedTours();
    }

    // Show feature tooltip
    showFeatureTooltip(featureId, targetElement) {
        const tooltips = {
            'recurring': 'Set up recurring transactions for automatic bill payments',
            'templates': 'Save common transactions as templates for quick entry',
            'split': 'Split a transaction across multiple categories',
            'debt': 'Track and manage your debts',
            'calendar': 'View transactions in a calendar format',
            'forecast': 'See projected cash flow for the next 30-90 days'
        };

        const content = tooltips[featureId] || 'Click to learn more';
        this.createFeatureTooltip(targetElement, content);
    }

    // Create feature tooltip
    createFeatureTooltip(target, content) {
        const tooltip = document.createElement('div');
        tooltip.className = 'feature-tooltip';
        tooltip.textContent = content;
        document.body.appendChild(tooltip);

        const rect = target.getBoundingClientRect();
        tooltip.style.top = `${rect.bottom + 10}px`;
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;

        setTimeout(() => {
            tooltip.remove();
        }, 3000);
    }

    // Check if user needs onboarding
    needsOnboarding() {
        return !this.completedTours.includes('main');
    }

    // Quick start wizard
    async startQuickStartWizard() {
        const steps = [
            {
                title: 'Welcome!',
                content: 'Let\'s set up your budget in 3 easy steps.',
                action: null
            },
            {
                title: 'Add Your First Account',
                content: 'Start by adding a bank account or wallet.',
                action: () => this.app.showModal('accountModal')
            },
            {
                title: 'Set Up Your Budget',
                content: 'Create budget categories for your expenses.',
                action: () => this.app.navigateToSection('dashboard')
            },
            {
                title: 'Add Your First Transaction',
                content: 'Record your first income or expense.',
                action: () => this.app.showModal('transactionModal')
            }
        ];

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const proceed = await this.showWizardStep(step, i, steps.length);
            if (!proceed) break;
        }
    }

    async showWizardStep(step, index, total) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'wizard-modal modal-overlay';
            modal.style.display = 'flex';
            modal.innerHTML = `
                <div class="modal" style="max-width: 500px;">
                    <div class="modal-header">
                        <h3>${step.title}</h3>
                        <div class="wizard-progress">${index + 1} / ${total}</div>
                    </div>
                    <div class="modal-body">
                        <p>${step.content}</p>
                        ${step.action ? '<button class="btn btn-primary" onclick="this.closest(\'.wizard-modal\').dataset.action = \'proceed\'">Continue</button>' : ''}
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="this.closest('.wizard-modal').dataset.action = 'skip'">Skip</button>
                        ${index > 0 ? '<button class="btn btn-secondary" onclick="this.closest(\'.wizard-modal\').dataset.action = \'back\'">Back</button>' : ''}
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            const checkAction = setInterval(() => {
                const action = modal.dataset.action;
                if (action) {
                    clearInterval(checkAction);
                    modal.remove();
                    if (step.action && action === 'proceed') {
                        step.action();
                    }
                    resolve(action !== 'skip');
                }
            }, 100);
        });
    }
}

if (typeof window !== 'undefined') {
    window.OnboardingManager = OnboardingManager;
}
