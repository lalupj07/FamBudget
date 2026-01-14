// API Service for FamBudget Backend
class ApiService {
    constructor(baseURL = null) {
        // Use environment variable or default to localhost for development
        this.baseURL = baseURL || window.API_BASE_URL || 'http://localhost:3000';
        this.token = localStorage.getItem('fambudget_token');
        this.user = null;
    }

    // Helper method for making API requests
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { Authorization: `Bearer ${this.token}` }),
                ...options.headers,
            },
        };

        // Add body for POST/PUT/PATCH requests
        if (options.body && typeof options.body === 'object') {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, config);
            
            // Handle non-JSON responses
            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = `API error: ${response.statusText}`;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorMessage;
                } catch (e) {
                    // Use text if not JSON
                }
                throw new Error(errorMessage);
            }

            // Handle empty responses
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return null;
        } catch (error) {
            console.error(`API request failed: ${endpoint}`, error);
            throw error;
        }
    }

    // Authentication methods
    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: { email, password },
        });
        
        this.token = data.token;
        this.user = data.member;
        localStorage.setItem('fambudget_token', data.token);
        localStorage.setItem('fambudget_user', JSON.stringify(data.member));
        if (data.household) {
            localStorage.setItem('fambudget_household', JSON.stringify(data.household));
        }
        
        return data;
    }

    async register(registerData) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: registerData,
        });
        
        if (data.token) {
            this.token = data.token;
            this.user = data.member;
            localStorage.setItem('fambudget_token', data.token);
            localStorage.setItem('fambudget_user', JSON.stringify(data.member));
            if (data.household) {
                localStorage.setItem('fambudget_household', JSON.stringify(data.household));
            }
        }
        
        return data;
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('fambudget_token');
        localStorage.removeItem('fambudget_user');
        localStorage.removeItem('fambudget_household');
    }

    // Transaction methods
    async getTransactions() {
        return this.request('/transactions');
    }

    async createTransaction(data) {
        return this.request('/transactions', {
            method: 'POST',
            body: data,
        });
    }

    async updateTransaction(id, data) {
        return this.request(`/transactions/${id}`, {
            method: 'PATCH',
            body: data,
        });
    }

    async deleteTransaction(id) {
        return this.request(`/transactions/${id}`, {
            method: 'DELETE',
        });
    }

    // Account methods
    async getAccounts() {
        return this.request('/accounts');
    }

    async createAccount(data) {
        return this.request('/accounts', {
            method: 'POST',
            body: data,
        });
    }

    async updateAccount(id, data) {
        return this.request(`/accounts/${id}`, {
            method: 'PATCH',
            body: data,
        });
    }

    async deleteAccount(id) {
        return this.request(`/accounts/${id}`, {
            method: 'DELETE',
        });
    }

    // Goal methods
    async getGoals() {
        return this.request('/goals');
    }

    async createGoal(data) {
        return this.request('/goals', {
            method: 'POST',
            body: data,
        });
    }

    async updateGoal(id, data) {
        return this.request(`/goals/${id}`, {
            method: 'PATCH',
            body: data,
        });
    }

    async deleteGoal(id) {
        return this.request(`/goals/${id}`, {
            method: 'DELETE',
        });
    }

    // Report methods
    async getReports() {
        return this.request('/reports');
    }

    async getDashboard() {
        return this.request('/reports/dashboard');
    }

    // Check if backend is available
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}/health`, { method: 'GET' });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    // Initialize token from localStorage
    init() {
        const storedToken = localStorage.getItem('fambudget_token');
        const storedUser = localStorage.getItem('fambudget_user');
        
        if (storedToken) {
            this.token = storedToken;
        }
        
        if (storedUser) {
            try {
                this.user = JSON.parse(storedUser);
            } catch (e) {
                console.error('Error parsing stored user:', e);
            }
        }
    }
}

// Export for use in app.js
if (typeof window !== 'undefined') {
    window.ApiService = ApiService;
}

