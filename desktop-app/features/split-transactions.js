// Split Transactions Manager
class SplitTransactionsManager {
    constructor(app) {
        this.app = app;
    }

    // Split transaction into multiple parts
    splitTransaction(transaction, splits) {
        // splits: [{category, amount, description?}]
        const totalSplit = splits.reduce((sum, split) => sum + Math.abs(split.amount), 0);
        const originalAmount = Math.abs(transaction.amount);

        if (totalSplit !== originalAmount) {
            throw new Error(`Split total (${totalSplit}) must equal transaction amount (${originalAmount})`);
        }

        const splitTransactions = splits.map((split, index) => ({
            id: transaction.id + '_split_' + index,
            description: split.description || `${transaction.description} - ${split.category}`,
            amount: transaction.amount > 0 ? split.amount : -split.amount,
            category: split.category,
            account: transaction.account,
            date: transaction.date,
            notes: split.notes || '',
            isSplit: true,
            parentTransactionId: transaction.id,
            splitIndex: index
        }));

        return splitTransactions;
    }

    // Split equally between categories
    splitEqually(transaction, categories) {
        const amountPerCategory = Math.abs(transaction.amount) / categories.length;
        const splits = categories.map(category => ({
            category,
            amount: amountPerCategory
        }));

        return this.splitTransaction(transaction, splits);
    }

    // Split by percentage
    splitByPercentage(transaction, percentages) {
        const totalAmount = Math.abs(transaction.amount);
        const splits = percentages.map(p => ({
            category: p.category,
            amount: (totalAmount * p.percentage) / 100
        }));

        return this.splitTransaction(transaction, splits);
    }

    // Split between family members (for shared expenses)
    splitBetweenMembers(transaction, members, splitType = 'equal') {
        // members: [{name, amount?}]
        let splits = [];

        if (splitType === 'equal') {
            const amountPerMember = Math.abs(transaction.amount) / members.length;
            splits = members.map(member => ({
                category: transaction.category,
                amount: amountPerMember,
                description: `${transaction.description} - ${member.name}`,
                member: member.name
            }));
        } else if (splitType === 'custom') {
            const totalAmount = members.reduce((sum, m) => sum + (m.amount || 0), 0);
            if (totalAmount !== Math.abs(transaction.amount)) {
                throw new Error('Custom split amounts must equal transaction amount');
            }
            splits = members.map(member => ({
                category: transaction.category,
                amount: member.amount,
                description: `${transaction.description} - ${member.name}`,
                member: member.name
            }));
        }

        return this.splitTransaction(transaction, splits);
    }

    // Apply split to transactions
    async applySplit(transaction, splits) {
        const splitTransactions = this.splitTransaction(transaction, splits);
        
        // Remove original transaction
        this.app.data.transactions = this.app.data.transactions.filter(t => t.id !== transaction.id);
        
        // Add split transactions
        for (const splitTx of splitTransactions) {
            this.app.data.transactions.unshift(splitTx);
            
            // Save to offline storage
            if (this.app.offlineStorage) {
                await this.app.offlineStorage.save('transactions', splitTx);
            }
        }

        this.app.renderTransactions();
        this.app.updatePeriodTotals();
        this.app.checkBudgetWarnings();
    }

    // Get split transactions for a parent
    getSplitTransactions(parentId) {
        return this.app.data.transactions.filter(t => 
            t.parentTransactionId === parentId || 
            (t.id && t.id.toString().startsWith(parentId + '_split_'))
        );
    }

    // Merge split transactions back
    async mergeSplitTransactions(parentId) {
        const splits = this.getSplitTransactions(parentId);
        if (splits.length === 0) return;

        const original = {
            id: parentId,
            description: splits[0].description.split(' - ')[0],
            amount: splits.reduce((sum, t) => sum + t.amount, 0),
            category: splits[0].category,
            account: splits[0].account,
            date: splits[0].date,
            notes: '',
            isSplit: false
        };

        // Remove split transactions
        this.app.data.transactions = this.app.data.transactions.filter(t => 
            !(t.parentTransactionId === parentId || 
              (t.id && t.id.toString().startsWith(parentId + '_split_')))
        );

        // Add merged transaction
        this.app.data.transactions.unshift(original);
        
        if (this.app.offlineStorage) {
            await this.app.offlineStorage.save('transactions', original);
        }

        this.app.renderTransactions();
        this.app.updatePeriodTotals();
    }
}

if (typeof window !== 'undefined') {
    window.SplitTransactionsManager = SplitTransactionsManager;
}
