// Advanced Filters Manager
class AdvancedFiltersManager {
    constructor(app) {
        this.app = app;
        this.savedFilters = [];
    }

    async init() {
        await this.loadSavedFilters();
    }

    async loadSavedFilters() {
        const stored = localStorage.getItem('fambudget_saved_filters');
        if (stored) {
            this.savedFilters = JSON.parse(stored);
        }
    }

    async saveSavedFilters() {
        localStorage.setItem('fambudget_saved_filters', JSON.stringify(this.savedFilters));
    }

    // Filter transactions with advanced options
    filterTransactions(filters) {
        let results = [...this.app.data.transactions];

        // Date range filter
        if (filters.startDate) {
            results = results.filter(t => t.date >= filters.startDate);
        }
        if (filters.endDate) {
            results = results.filter(t => t.date <= filters.endDate);
        }

        // Category filter
        if (filters.categories && filters.categories.length > 0) {
            results = results.filter(t => filters.categories.includes(t.category));
        }

        // Account filter
        if (filters.accounts && filters.accounts.length > 0) {
            results = results.filter(t => filters.accounts.includes(t.account));
        }

        // Amount range filter
        if (filters.minAmount !== undefined) {
            results = results.filter(t => Math.abs(t.amount) >= filters.minAmount);
        }
        if (filters.maxAmount !== undefined) {
            results = results.filter(t => Math.abs(t.amount) <= filters.maxAmount);
        }

        // Type filter (income/expense)
        if (filters.type === 'income') {
            results = results.filter(t => t.amount > 0);
        } else if (filters.type === 'expense') {
            results = results.filter(t => t.amount < 0);
        }

        // Tag filter
        if (filters.tags && filters.tags.length > 0) {
            results = results.filter(t => {
                const transactionTags = t.tags || [];
                return filters.tags.some(tag => transactionTags.includes(tag));
            });
        }

        // Search text
        if (filters.searchText) {
            const searchLower = filters.searchText.toLowerCase();
            results = results.filter(t =>
                t.description?.toLowerCase().includes(searchLower) ||
                t.category?.toLowerCase().includes(searchLower) ||
                t.notes?.toLowerCase().includes(searchLower)
            );
        }

        // Sort
        const sortBy = filters.sortBy || 'date';
        const sortOrder = filters.sortOrder || 'desc';
        
        results.sort((a, b) => {
            let aVal, bVal;
            switch (sortBy) {
                case 'date':
                    aVal = new Date(a.date);
                    bVal = new Date(b.date);
                    break;
                case 'amount':
                    aVal = Math.abs(a.amount);
                    bVal = Math.abs(b.amount);
                    break;
                case 'description':
                    aVal = a.description || '';
                    bVal = b.description || '';
                    break;
                default:
                    aVal = a[sortBy];
                    bVal = b[sortBy];
            }

            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return results;
    }

    // Save filter preset
    async saveFilter(name, filters) {
        const preset = {
            id: Date.now(),
            name,
            filters,
            createdAt: new Date().toISOString()
        };
        this.savedFilters.push(preset);
        await this.saveSavedFilters();
        return preset;
    }

    // Delete saved filter
    async deleteSavedFilter(id) {
        this.savedFilters = this.savedFilters.filter(f => f.id !== id);
        await this.saveSavedFilters();
    }

    // Get all saved filters
    getSavedFilters() {
        return this.savedFilters;
    }
}

if (typeof window !== 'undefined') {
    window.AdvancedFiltersManager = AdvancedFiltersManager;
}
