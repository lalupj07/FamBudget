// Quick Actions Widget Manager
class QuickActionsManager {
    constructor(app) {
        this.app = app;
        this.actions = [];
    }

    init() {
        this.setupQuickActions();
    }

    setupQuickActions() {
        this.actions = [
            {
                id: 'add-transaction',
                label: 'Add Transaction',
                icon: 'add',
                action: () => this.app.showModal('transactionModal')
            },
            {
                id: 'add-income',
                label: 'Add Income',
                icon: 'attach_money',
                action: () => this.app.showModal('incomeModal')
            },
            {
                id: 'quick-template',
                label: 'Quick Add',
                icon: 'flash_on',
                action: () => this.showTemplateMenu()
            },
            {
                id: 'scan-receipt',
                label: 'Scan Receipt',
                icon: 'camera_alt',
                action: () => this.scanReceipt()
            }
        ];

        this.renderQuickActions();
    }

    renderQuickActions() {
        let widget = document.getElementById('quickActionsWidget');
        if (!widget) {
            widget = document.createElement('div');
            widget.id = 'quickActionsWidget';
            widget.className = 'quick-actions-widget';
            document.body.appendChild(widget);
        }

        widget.innerHTML = `
            <div class="quick-actions-header">
                <span class="material-icons">bolt</span>
                <span>Quick Actions</span>
            </div>
            <div class="quick-actions-list">
                ${this.actions.map(action => `
                    <button class="quick-action-btn" onclick="window.quickActionsManager.execute('${action.id}')">
                        <span class="material-icons">${action.icon}</span>
                        <span>${action.label}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }

    execute(actionId) {
        const action = this.actions.find(a => a.id === actionId);
        if (action && action.action) {
            action.action();
        }
    }

    showTemplateMenu() {
        if (!this.app.templatesManager) return;
        
        const templates = this.app.templatesManager.getFrequentlyUsed(5);
        // Show template selection modal
        console.log('Show template menu', templates);
    }

    scanReceipt() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file && this.app.receiptManager) {
                // Handle receipt scan
                console.log('Scan receipt', file);
            }
        };
        input.click();
    }
}

if (typeof window !== 'undefined') {
    window.QuickActionsManager = QuickActionsManager;
}
