// Multi-Currency Converter Manager
class CurrencyConverterManager {
    constructor(app) {
        this.app = app;
        this.exchangeRates = {};
        this.lastUpdate = null;
    }

    async init() {
        await this.loadExchangeRates();
    }

    // Load exchange rates (using free API or fallback)
    async loadExchangeRates() {
        const cached = localStorage.getItem('fambudget_exchange_rates');
        if (cached) {
            const data = JSON.parse(cached);
            // Use cached if less than 24 hours old
            if (data.timestamp && (Date.now() - data.timestamp) < 24 * 60 * 60 * 1000) {
                this.exchangeRates = data.rates;
                this.lastUpdate = new Date(data.timestamp);
                return;
            }
        }

        // Try to fetch from API (free tier)
        try {
            // Using exchangerate-api.com free tier
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            const data = await response.json();
            
            this.exchangeRates = data.rates;
            this.lastUpdate = new Date();
            
            localStorage.setItem('fambudget_exchange_rates', JSON.stringify({
                rates: this.exchangeRates,
                timestamp: this.lastUpdate.getTime()
            }));
        } catch (error) {
            console.error('Failed to fetch exchange rates:', error);
            // Use fallback rates
            this.exchangeRates = this.getFallbackRates();
        }
    }

    // Fallback exchange rates (approximate)
    getFallbackRates() {
        return {
            USD: 1,
            EUR: 0.92,
            GBP: 0.79,
            JPY: 150,
            CAD: 1.35,
            AUD: 1.52,
            CHF: 0.88,
            CNY: 7.24,
            INR: 83,
            BRL: 4.95
        };
    }

    // Convert amount between currencies
    convert(amount, fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) return amount;
        if (!this.exchangeRates[fromCurrency] || !this.exchangeRates[toCurrency]) {
            console.warn('Exchange rate not available');
            return amount;
        }

        // Convert to USD first, then to target currency
        const usdAmount = amount / this.exchangeRates[fromCurrency];
        return usdAmount * this.exchangeRates[toCurrency];
    }

    // Convert transaction to different currency
    convertTransaction(transaction, toCurrency) {
        const convertedAmount = this.convert(
            Math.abs(transaction.amount),
            this.app.selectedCurrency,
            toCurrency
        );

        return {
            ...transaction,
            amount: transaction.amount > 0 ? convertedAmount : -convertedAmount,
            originalCurrency: this.app.selectedCurrency,
            convertedCurrency: toCurrency
        };
    }

    // Get exchange rate
    getRate(fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) return 1;
        return this.convert(1, fromCurrency, toCurrency);
    }

    // Format currency with symbol
    formatCurrency(amount, currency) {
        const config = this.app.currencyConfig[currency] || this.app.currencyConfig.USD;
        const symbol = config.symbol;
        const formatted = Math.abs(amount).toFixed(config.decimals);

        if (config.position === 'before') {
            return `${symbol}${formatted}`;
        } else {
            return `${formatted} ${symbol}`;
        }
    }
}

if (typeof window !== 'undefined') {
    window.CurrencyConverterManager = CurrencyConverterManager;
}
