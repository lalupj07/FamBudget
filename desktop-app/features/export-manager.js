// Export Manager for PDF and Excel
class ExportManager {
    constructor(app) {
        this.app = app;
    }

    // Export to PDF
    async exportToPDF(type = 'report', options = {}) {
        // Using html2pdf library (would need to be included)
        if (typeof html2pdf === 'undefined') {
            console.error('html2pdf library not loaded');
            return null;
        }

        const element = document.createElement('div');
        element.className = 'pdf-export';
        element.style.padding = '40px';
        element.style.fontFamily = 'Arial, sans-serif';

        if (type === 'report') {
            element.innerHTML = this.generateReportHTML(options);
        } else if (type === 'transactions') {
            element.innerHTML = this.generateTransactionsHTML(options);
        }

        document.body.appendChild(element);

        const opt = {
            margin: 1,
            filename: `fambudget-${type}-${new Date().toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        try {
            await html2pdf().set(opt).from(element).save();
            document.body.removeChild(element);
            return true;
        } catch (error) {
            console.error('PDF export error:', error);
            document.body.removeChild(element);
            return false;
        }
    }

    // Export to Excel
    async exportToExcel(data, filename = 'fambudget-export.xlsx') {
        // Using SheetJS library (would need to be included)
        if (typeof XLSX === 'undefined') {
            console.error('SheetJS library not loaded');
            return null;
        }

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Data');

        XLSX.writeFile(wb, filename);
        return true;
    }

    // Export transactions to Excel
    async exportTransactionsToExcel() {
        const transactions = this.app.data.transactions.map(t => ({
            Date: t.date,
            Description: t.description,
            Category: t.category,
            Account: t.account,
            Amount: t.amount,
            Notes: t.notes || ''
        }));

        return this.exportToExcel(transactions, `transactions-${new Date().toISOString().split('T')[0]}.xlsx`);
    }

    // Generate report HTML for PDF
    generateReportHTML(options) {
        const totals = this.calculateTotals();
        const period = options.period || 'This Month';

        return `
            <div style="text-align: center; margin-bottom: 30px;">
                <h1>FamBudget Report</h1>
                <p>${period}</p>
                <p>Generated: ${new Date().toLocaleDateString()}</p>
            </div>
            <div style="margin-bottom: 30px;">
                <h2>Summary</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Total Income</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${this.app.formatCurrency(totals.income)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Total Expenses</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${this.app.formatCurrency(totals.expenses)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Net Change</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${this.app.formatCurrency(totals.net)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Savings Rate</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${totals.savingsRate.toFixed(1)}%</td>
                    </tr>
                </table>
            </div>
            <div>
                <h2>Budget Overview</h2>
                ${this.generateBudgetTable()}
            </div>
        `;
    }

    generateTransactionsHTML(options) {
        const transactions = options.transactions || this.app.data.transactions.slice(0, 100);
        
        return `
            <div style="text-align: center; margin-bottom: 30px;">
                <h1>Transaction Report</h1>
                <p>Generated: ${new Date().toLocaleDateString()}</p>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f0f0f0;">
                        <th style="padding: 10px; border: 1px solid #ddd;">Date</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Description</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Category</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${transactions.map(t => `
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;">${t.date}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${t.description}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${t.category}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${this.app.formatCurrency(t.amount)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    generateBudgetTable() {
        const categories = this.app.data.dashboard?.budgetCategories || [];
        return `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f0f0f0;">
                        <th style="padding: 10px; border: 1px solid #ddd;">Category</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Budget</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Spent</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Remaining</th>
                    </tr>
                </thead>
                <tbody>
                    ${categories.map(cat => `
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;">${cat.name}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${this.app.formatCurrency(cat.budget)}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${this.app.formatCurrency(cat.spent)}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${this.app.formatCurrency(cat.remaining)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    calculateTotals() {
        const transactions = this.app.data.transactions;
        const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
        const expenses = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
        const net = income - expenses;
        const savingsRate = income > 0 ? (net / income) * 100 : 0;

        return { income, expenses, net, savingsRate };
    }
}

if (typeof window !== 'undefined') {
    window.ExportManager = ExportManager;
}
