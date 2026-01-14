# 🚀 Deploy Backend NOW - Step by Step

## Prerequisites Checklist

Before deploying, make sure:
- [x] ✅ Backend code is ready
- [x] ✅ API service created (`desktop-app/api.js`)
- [x] ✅ Web app updated to use API
- [x] ✅ Health endpoint added
- [x] ✅ Deployment configs created

## Step-by-Step Deployment to Railway

### Step 1: Go to Railway

1. Open: **https://railway.app**
2. Click **"Login"** or **"Start a New Project"**
3. **Sign up with GitHub** (if not already)

### Step 2: Create New Project

1. Click **"New Project"** button
2. Select **"Deploy from GitHub repo"**
3. Authorize Railway to access your GitHub
4. Select your **`FamBudget`** repository
5. Click **"Deploy Now"**

### Step 3: Configure Backend Service

1. Railway will create a service automatically
2. **Click on the service** that was created
3. Go to **"Settings"** tab
4. Scroll to **"Root Directory"**
5. Set to: **`backend`**
6. Railway will automatically detect NestJS

### Step 4: Add PostgreSQL Database

1. In your Railway project, click **"New"** button (top right)
2. Select **"Database"**
3. Choose **"PostgreSQL"**
4. Railway will create and configure it automatically
5. **Note**: Railway will provide connection variables automatically

### Step 5: Set Environment Variables

1. Go back to your **backend service**
2. Click **"Variables"** tab
3. Click **"New Variable"** for each:

**Click "Raw Editor"** (top right) and paste:

```env
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_DATABASE=${{Postgres.PGDATABASE}}
JWT_SECRET=change-this-to-random-secret-key-12345678901234567890
JWT_EXPIRATION=7d
NODE_ENV=production
PORT=3000
```

**Or add individually:**
- Click **"New Variable"** for each line above
- For Postgres variables, Railway provides them automatically with `${{Postgres.*}}`
- For `JWT_SECRET`, generate a random string (at least 32 characters)

**Generate JWT_SECRET** (in PowerShell):
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### Step 6: Wait for Deployment

Railway will automatically:
1. Install dependencies (`npm install`)
2. Build the backend (`npm run build`)
3. Start the server (`npm start`)
4. Give you a URL

**Check the "Deployments" tab** to see progress.

### Step 7: Get Your Backend URL

1. Click on your **backend service**
2. Go to **"Settings"** tab
3. Scroll to **"Domains"** section
4. You'll see your URL like:
   ```
   https://fambudget-production.up.railway.app
   ```
5. **Copy this URL** - you'll need it!

### Step 8: Test Your Backend

Open the health endpoint in your browser:
```
https://your-backend-url.railway.app/health
```

Should show:
```json
{
  "status": "ok",
  "message": "FamBudget API is running",
  "timestamp": "..."
}
```

✅ **If this works, backend is deployed!**

### Step 9: Connect Web App

1. **Open your web app**: https://lalupj07.github.io/FamBudget
2. **Open browser console** (Press F12)
3. **Run this command** (replace with your actual backend URL):
   ```javascript
   localStorage.setItem('fambudget_api_url', 'https://your-backend-url.railway.app');
   ```
4. **Refresh the page**
5. **Your web app now uses the backend!** 🎉

### Step 10: Test It Works

1. Try adding a transaction
2. Check browser console for API calls
3. Check Railway logs to see requests
4. Data should now be saved to PostgreSQL!

## Quick Commands

### Generate JWT_SECRET (PowerShell)
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### Test Backend (PowerShell)
```powershell
curl https://your-backend-url.railway.app/health
```

### Set API URL (Browser Console)
```javascript
localStorage.setItem('fambudget_api_url', 'https://your-backend-url.railway.app');
```

## Troubleshooting

### "Build Failed"
- Check Railway logs (Deployments tab)
- Verify `backend/package.json` has all dependencies
- Check if TypeScript builds correctly

### "Database Connection Error"
- Verify PostgreSQL service is created
- Check environment variables match Postgres service name
- Railway auto-provides `${{Postgres.*}}` variables

### "Backend Won't Start"
- Check PORT is set to 3000
- Check NODE_ENV is production
- Look at Railway logs for errors

### "Web App Can't Connect"
- Verify backend URL is correct
- Check CORS is enabled (it should be in `main.ts`)
- Check backend health endpoint works
- Check browser console for CORS errors

## Railway Free Tier Info

- **$5 credit** per month
- **Enough for development** and testing
- **Sleeps after 5 minutes** of inactivity (wakes automatically)
- **PostgreSQL included** (512MB storage)

## What Happens After Deployment

✅ Backend is online  
✅ PostgreSQL database created  
✅ Web app can connect to backend  
✅ Data synced to database  
✅ Multi-user ready! 🎉

---

**Need help?** Check Railway logs or browser console for errors!

