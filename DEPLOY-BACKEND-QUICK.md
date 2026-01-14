# Quick Backend Deployment Guide

## Deploy to Railway (Easiest - Recommended)

### Step 1: Create Railway Account

1. Go to: https://railway.app
2. Sign up with GitHub (free tier available)

### Step 2: Deploy Backend

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `FamBudget` repository
4. Click **"Configure"** on the detected service
5. Set **Root Directory** to: `backend`
6. Railway will automatically detect and deploy

### Step 3: Add PostgreSQL Database

1. In Railway project, click **"New"** → **"Database"**
2. Select **"PostgreSQL"**
3. Railway will create and configure it automatically

### Step 4: Configure Environment Variables

Click on your backend service → **"Variables"** tab → Add:

```env
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_DATABASE=${{Postgres.PGDATABASE}}
JWT_SECRET=your-super-secret-key-change-this-12345
JWT_EXPIRATION=7d
NODE_ENV=production
PORT=3000
```

**Note:** Railway automatically provides Postgres variables - just use `${{Postgres.*}}`

### Step 5: Get Your Backend URL

After deployment:
1. Click on your backend service
2. Go to **"Settings"** tab
3. Under **"Domains"**, you'll see your URL like:
   ```
   https://your-app-name.railway.app
   ```

### Step 6: Configure Web App

Once backend is deployed, update your web app:

1. **Set API URL in localStorage:**
   ```javascript
   // Open browser console on your deployed site
   localStorage.setItem('fambudget_api_url', 'https://your-backend-url.railway.app');
   ```

2. **Or update index.html:**
   ```html
   <script>
       window.API_BASE_URL = 'https://your-backend-url.railway.app';
   </script>
   ```

3. **Redeploy web app:**
   ```bash
   cd desktop-app
   npm run deploy
   ```

## Alternative: Deploy to Render (Free Tier)

### Step 1: Create Render Account

1. Go to: https://render.com
2. Sign up with GitHub

### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `fambudget-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Add PostgreSQL

1. Click **"New +"** → **"PostgreSQL"**
2. Create database
3. Copy connection details

### Step 4: Set Environment Variables

Same as Railway above, but use actual values from Render PostgreSQL.

## Test Backend

After deployment, test:

```bash
curl https://your-backend-url.railway.app/health
```

Should return success.

## Connect Web App

1. Set API URL (see Step 6 above)
2. Refresh your web app
3. App will now use backend API instead of localStorage!

## Troubleshooting

### Backend won't start
- Check environment variables are set correctly
- Check PostgreSQL connection string
- Look at Railway/Render logs

### Web app can't connect
- Check CORS is enabled in backend (it should be)
- Check API URL is correct
- Check browser console for errors

