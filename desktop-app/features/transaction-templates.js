// Transaction Templates Manager
class TransactionTemplatesManager {
    constructor(app) {
        this.app = app;
        this.templates = [];
    }

    async init() {
        await this.loadTemplates();
    }

    async loadTemplates() {
        const stored = localStorage.getItem('fambudget_transaction_templates');
        if (stored) {
            this.templates = JSON.parse(stored);
        } else {
            // Create default templates
            this.templates = [
                {
                    id: 1,
                    name: 'Groceries',
                    description: 'Weekly Groceries',
                    amount: -150,
                    category: 'Food & Dining',
                    account: '',
                    tags: ['groceries', 'food'],
                    icon: 'shopping_cart'
                },
                {
                    id: 2,
                    name: 'Gas Station',
                    description: 'Gas Fill-up',
                    amount: -50,
                    category: 'Transportation',
                    account: '',
                    tags: ['gas', 'fuel'],
                    icon: 'local_gas_station'
                },
                {
                    id: 3,
                    name: 'Coffee',
                    description: 'Coffee Shop',
                    amount: -5,
                    category: 'Food & Dining',
                    account: '',
                    tags: ['coffee', 'food'],
                    icon: 'local_cafe'
                }
            ];
            await this.saveTemplates();
        }
    }

    async saveTemplates() {
        localStorage.setItem('fambudget_transaction_templates', JSON.stringify(this.templates));
    }

    // Create template from transaction
    async createTemplate(transaction, name) {
        const template = {
            id: Date.now(),
            name: name || transaction.description,
            description: transaction.description,
            amount: transaction.amount,
            category: transaction.category,
            account: transaction.account,
            tags: transaction.tags || [],
            icon: this.getIconForCategory(transaction.category),
            createdAt: new Date().toISOString()
        };

        this.templates.push(template);
        await this.saveTemplates();
        return template;
    }

    // Use template to create transaction
    async useTemplate(templateId, customizations = {}) {
        const template = this.templates.find(t => t.id === templateId);
        if (!template) return null;

        const transaction = {
            id: Date.now(),
            description: customizations.description || template.description,
            amount: customizations.amount || template.amount,
            category: customizations.category || template.category,
            account: customizations.account || template.account,
            date: customizations.date || new Date().toISOString().split('T')[0],
            tags: customizations.tags || template.tags,
            notes: customizations.notes || '',
            fromTemplate: true,
            templateId: template.id
        };

        return transaction;
    }

    // Get icon for category
    getIconForCategory(category) {
        const iconMap = {
            'Food & Dining': 'restaurant',
            'Transportation': 'directions_car',
            'Utilities': 'home',
            'Entertainment': 'movie',
            'Shopping': 'shopping_bag',
            'Health & Fitness': 'fitness_center',
            'Education': 'school',
            'Travel': 'flight',
            'Income': 'attach_money'
        };
        return iconMap[category] || 'receipt';
    }

    // Delete template
    async deleteTemplate(id) {
        this.templates = this.templates.filter(t => t.id !== id);
        await this.saveTemplates();
    }

    // Update template
    async updateTemplate(id, updates) {
        const template = this.templates.find(t => t.id === id);
        if (template) {
            Object.assign(template, updates);
            await this.saveTemplates();
        }
    }

    // Get templates by category
    getTemplatesByCategory(category) {
        return this.templates.filter(t => t.category === category);
    }

    // Get frequently used templates (top 5)
    getFrequentlyUsed(limit = 5) {
        // For now, return most recent templates
        return this.templates.slice(0, limit);
    }
}

if (typeof window !== 'undefined') {
    window.TransactionTemplatesManager = TransactionTemplatesManager;
}
