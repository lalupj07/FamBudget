// Receipt Manager
class ReceiptManager {
    constructor(app) {
        this.app = app;
        this.receipts = [];
    }

    async init() {
        await this.loadReceipts();
    }

    async loadReceipts() {
        const stored = localStorage.getItem('fambudget_receipts');
        if (stored) {
            this.receipts = JSON.parse(stored);
        }
    }

    async saveReceipts() {
        localStorage.setItem('fambudget_receipts', JSON.stringify(this.receipts));
    }

    // Attach receipt to transaction
    async attachReceipt(transactionId, file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const receipt = {
                    id: Date.now(),
                    transactionId: transactionId,
                    imageData: e.target.result,
                    fileName: file.name,
                    fileSize: file.size,
                    mimeType: file.type,
                    uploadedAt: new Date().toISOString()
                };

                this.receipts.push(receipt);
                await this.saveReceipts();
                resolve(receipt);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Get receipt for transaction
    getReceipt(transactionId) {
        return this.receipts.find(r => r.transactionId === transactionId);
    }

    // Get all receipts
    getAllReceipts() {
        return this.receipts;
    }

    // Delete receipt
    async deleteReceipt(receiptId) {
        this.receipts = this.receipts.filter(r => r.id !== receiptId);
        await this.saveReceipts();
    }

    // Get receipt gallery (grouped by month)
    getReceiptGallery() {
        const grouped = {};
        for (const receipt of this.receipts) {
            const date = new Date(receipt.uploadedAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!grouped[monthKey]) {
                grouped[monthKey] = [];
            }
            grouped[monthKey].push(receipt);
        }
        return grouped;
    }
}

if (typeof window !== 'undefined') {
    window.ReceiptManager = ReceiptManager;
}
