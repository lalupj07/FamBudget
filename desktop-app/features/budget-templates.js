// Budget Templates Manager
class BudgetTemplatesManager {
    constructor(app) {
        this.app = app;
        this.templates = [];
    }

    async init() {
        await this.loadTemplates();
        if (this.templates.length === 0) {
            await this.createDefaultTemplates();
        }
    }

    async loadTemplates() {
        const stored = localStorage.getItem('fambudget_budget_templates');
        if (stored) {
            this.templates = JSON.parse(stored);
        }
    }

    async saveTemplates() {
        localStorage.setItem('fambudget_budget_templates', JSON.stringify(this.templates));
    }

    // Create default templates
    async createDefaultTemplates() {
        this.templates = [
            {
                id: 1,
                name: 'Student Budget',
                description: 'Budget template for students',
                categories: [
                    { name: 'Food & Dining', percentage: 30 },
                    { name: 'Transportation', percentage: 15 },
                    { name: 'Entertainment', percentage: 10 },
                    { name: 'Education', percentage: 25 },
                    { name: 'Personal', percentage: 10 },
                    { name: 'Savings', percentage: 10 }
                ]
            },
            {
                id: 2,
                name: 'Family Budget',
                description: 'Budget template for families',
                categories: [
                    { name: 'Food & Dining', percentage: 25 },
                    { name: 'Utilities', percentage: 15 },
                    { name: 'Transportation', percentage: 15 },
                    { name: 'Entertainment', percentage: 10 },
                    { name: 'Shopping', percentage: 10 },
                    { name: 'Health & Fitness', percentage: 10 },
                    { name: 'Education', percentage: 5 },
                    { name: 'Savings', percentage: 10 }
                ]
            },
            {
                id: 3,
                name: 'Retiree Budget',
                description: 'Budget template for retirees',
                categories: [
                    { name: 'Food & Dining', percentage: 20 },
                    { name: 'Utilities', percentage: 15 },
                    { name: 'Healthcare', percentage: 25 },
                    { name: 'Entertainment', percentage: 10 },
                    { name: 'Travel', percentage: 15 },
                    { name: 'Savings', percentage: 15 }
                ]
            },
            {
                id: 4,
                name: '50/30/20 Rule',
                description: 'Classic 50/30/20 budgeting rule',
                categories: [
                    { name: 'Needs', percentage: 50 },
                    { name: 'Wants', percentage: 30 },
                    { name: 'Savings', percentage: 20 }
                ]
            }
        ];
        await this.saveTemplates();
    }

    // Create template from current budget
    async createTemplateFromBudget(name, description, budgetCategories) {
        const total = budgetCategories.reduce((sum, cat) => sum + (cat.budget || 0), 0);
        const categories = budgetCategories.map(cat => ({
            name: cat.name,
            percentage: total > 0 ? (cat.budget / total) * 100 : 0
        }));

        const template = {
            id: Date.now(),
            name,
            description: description || '',
            categories,
            createdAt: new Date().toISOString()
        };

        this.templates.push(template);
        await this.saveTemplates();
        return template;
    }

    // Apply template to budget
    applyTemplate(templateId, totalBudget) {
        const template = this.templates.find(t => t.id === templateId);
        if (!template) return null;

        return template.categories.map(cat => ({
            name: cat.name,
            budget: (totalBudget * cat.percentage) / 100,
            spent: 0,
            remaining: (totalBudget * cat.percentage) / 100
        }));
    }

    // Get all templates
    getTemplates() {
        return this.templates;
    }

    // Delete template
    async deleteTemplate(id) {
        this.templates = this.templates.filter(t => t.id !== id);
        await this.saveTemplates();
    }
}

if (typeof window !== 'undefined') {
    window.BudgetTemplatesManager = BudgetTemplatesManager;
}
