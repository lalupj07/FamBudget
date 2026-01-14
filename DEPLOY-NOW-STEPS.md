# 🚀 Deploy Backend to Railway - Do It Now!

## Step 1: Login to Railway ✅

**Railway dashboard should be open in your browser!**

1. Click **"Login with GitHub"** or **"Start a New Project"**
2. Authorize Railway to access your GitHub account
3. Complete the login process

## Step 2: Create New Project

1. In Railway dashboard, click **"New Project"** button (top right)
2. Select **"Deploy from GitHub repo"**
3. Find and select your **`FamBudget`** repository
4. Click **"Deploy Now"**

Railway will create a service automatically.

## Step 3: Configure Root Directory ⚠️ IMPORTANT!

1. **Click on the service** that was just created
2. Go to **"Settings"** tab
3. Scroll down to **"Root Directory"** section
4. Enter: **`backend`** (without quotes, lowercase)
5. Click **"Save"** or press Enter

⚠️ **This is critical!** Without this, Railway won't find your backend code.

## Step 4: Add PostgreSQL Database

1. In your Railway project dashboard, click **"New"** button (top right)
2. Select **"Database"** from the menu
3. Choose **"PostgreSQL"**
4. Railway will automatically create and configure it

**Note:** Railway will name it something like "Postgres" - remember this name!

## Step 5: Set Environment Variables

1. Go back to your **backend service** (not the database)
2. Click **"Variables"** tab
3. Click **"Raw Editor"** button (top right)
4. **Copy and paste ALL of these** (replace `Postgres` if your DB has a different name):

```
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_DATABASE=${{Postgres.PGDATABASE}}
JWT_SECRET=GxeqiBSQjmoD6JnkKHuA347sbZrh5VylvgL1XOdP
JWT_EXPIRATION=7d
NODE_ENV=production
PORT=3000
```

5. Click **"Update Variables"** or **"Save"**

⚠️ **Important:** 
- Replace `Postgres` with your actual database service name if it's different
- The `${{...}}` syntax links to the database service automatically

## Step 6: Wait for Deployment

1. Go to **"Deployments"** tab
2. Watch the build logs:
   - ✅ Installing dependencies
   - ✅ Building backend (`npm run build`)
   - ✅ Starting server
3. Wait 2-5 minutes
4. Look for green checkmark ✅ = Success!

## Step 7: Get Your Backend URL

1. Stay in your **backend service**
2. Go to **"Settings"** tab
3. Scroll to **"Domains"** section
4. You'll see a URL like:
   ```
   https://fambudget-production-xxxx.up.railway.app
   ```
5. **Click "Generate Domain"** if you don't see one
6. **Copy the URL** - you'll need it!

## Step 8: Test Your Backend

Open this URL in your browser (replace with your actual URL):
```
https://your-backend-url.railway.app/health
```

You should see:
```json
{
  "status": "ok",
  "message": "FamBudget API is running",
  "timestamp": "2025-11-02T..."
}
```

✅ **If this works, your backend is deployed!**

## Step 9: Connect Web App

1. Open your web app: https://lalupj07.github.io/FamBudget
2. Press **F12** → **Console** tab
3. Run this (replace with your actual backend URL):
   ```javascript
   localStorage.setItem('fambudget_api_url', 'https://your-backend-url.railway.app');
   location.reload();
   ```
4. Your web app now uses the backend! 🎉

## 🔍 Troubleshooting

### Build Failed?
- Check Railway logs (Deployments tab → View Logs)
- Verify Root Directory is exactly `backend` (lowercase)
- Make sure all files are pushed to GitHub

### Database Connection Error?
- Verify PostgreSQL service is created and running
- Check database service name matches in variables
- Ensure variables use `${{ServiceName.PGHOST}}` format

### Backend Won't Start?
- Check Railway logs for errors
- Verify all environment variables are set
- Make sure `PORT=3000` is set

### Web App Can't Connect?
- Verify backend URL is correct
- Check backend health endpoint works
- Look at browser console for CORS errors (shouldn't happen - CORS is enabled)

---

**Need help?** Check Railway deployment logs or browser console!

