# Backend Deployment Guide

## Current Situation

Your web app currently uses **localStorage** (works offline, no backend needed).

To use the **backend API**, you need to:

1. **Deploy the backend** (NestJS) to a hosting service
2. **Update the web app** to use the backend API instead of localStorage

## Option 1: Deploy Backend to Railway (Easiest)

### Step 1: Deploy Backend

1. Go to: https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `FamBudget` repository
5. Select **`backend`** as the root directory
6. Railway will automatically:
   - Detect NestJS
   - Install dependencies
   - Build the app
   - Deploy it

### Step 2: Configure Database

1. In Railway project, click **"New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will create a PostgreSQL database
4. Copy the connection string

### Step 3: Set Environment Variables

In Railway, go to **Variables** and add:

```env
DB_HOST=<from railway postgres>
DB_PORT=5432
DB_USERNAME=<from railway postgres>
DB_PASSWORD=<from railway postgres>
DB_DATABASE=<from railway postgres>
JWT_SECRET=<generate random string>
JWT_EXPIRATION=7d
NODE_ENV=production
PORT=3000
```

### Step 4: Get Backend URL

After deployment, Railway gives you a URL like:
```
https://your-app.railway.app
```

## Option 2: Deploy Backend to Render (Free Tier Available)

### Step 1: Deploy Backend

1. Go to: https://render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `fambudget-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid)

### Step 2: Add PostgreSQL Database

1. Click **"New +"** → **"PostgreSQL"**
2. Create database
3. Copy connection details

### Step 3: Set Environment Variables

Same as Railway above.

## Option 3: Deploy Backend to Heroku

See: `DEPLOYMENT.md` for detailed Heroku instructions.

## Update Web App to Use Backend

Once backend is deployed, you need to:

### 1. Create API Service

Create `desktop-app/api.js`:

```javascript
class ApiService {
    constructor(baseURL) {
        this.baseURL = baseURL || 'https://your-backend-url.railway.app';
        this.token = localStorage.getItem('auth_token');
    }

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

        const response = await fetch(url, config);
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        return response.json();
    }

    // Auth methods
    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        this.token = data.token;
        localStorage.setItem('auth_token', data.token);
        return data;
    }

    async register(userData) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        return data;
    }

    // Data methods
    async getTransactions() {
        return this.request('/transactions');
    }

    async createTransaction(data) {
        return this.request('/transactions', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // ... more API methods
}
```

### 2. Update app.js to Use API

Replace localStorage methods with API calls:

```javascript
// Instead of:
this.saveTransactions();

// Use:
await apiService.createTransaction(transactionData);
```

## Quick Solution: Keep Using localStorage

If you don't need the backend right now, the web app works fine with localStorage. All data is saved in the browser.

**The backend is only needed if:**
- You want user authentication
- You want data synced across devices
- You want multiple users sharing data
- You want server-side features

## Which Do You Need?

**Option A: Keep localStorage (current setup)**
- ✅ Works offline
- ✅ No backend needed
- ✅ Data saved in browser
- ❌ No sync across devices
- ❌ No authentication

**Option B: Use Backend API**
- ✅ Data synced across devices
- ✅ User authentication
- ✅ Server-side features
- ❌ Requires backend deployment
- ❌ Requires API integration

Which would you prefer?

