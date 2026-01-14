# 🚀 Deploy Backend to Railway - Step by Step

## ✅ What's Ready

Your backend is **100% ready** for deployment:
- ✅ NestJS application configured
- ✅ PostgreSQL database ready
- ✅ Health endpoint added (`/health`)
- ✅ CORS enabled for web app
- ✅ Railway config files created
- ✅ Environment variables configured

## Step-by-Step Railway Deployment

### Step 1: Open Railway

1. Go to: **https://railway.app**
2. Click **"Login"** or **"Start a New Project"**
3. **Sign up with GitHub** (free tier available)
4. Authorize Railway to access your GitHub

### Step 2: Create New Project

1. Click **"New Project"** button (top right)
2. Select **"Deploy from GitHub repo"**
3. Find and select your **`FamBudget`** repository
4. Click **"Deploy Now"**

Railway will:
- Clone your repository
- Auto-detect services
- Start deployment

### Step 3: Configure Backend Service

1. Railway will create a service automatically
2. **Click on the service** (it might be named after your repo)
3. Go to **"Settings"** tab
4. Scroll to **"Root Directory"**
5. Change from `/` to: **`backend`**
6. Click **"Save"**

Railway will now:
- Look in the `backend` folder
- Auto-detect NestJS
- Install dependencies automatically

### Step 4: Add PostgreSQL Database

1. In your Railway project dashboard, click **"New"** button (top right)
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway creates it automatically
5. **Note the service name** (usually "Postgres")

### Step 5: Set Environment Variables

1. Go back to your **backend service**
2. Click **"Variables"** tab
3. Click **"Raw Editor"** (top right) - easier way!
4. Paste this entire block:

```env
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_DATABASE=${{Postgres.PGDATABASE}}
JWT_SECRET=FamBudget-Super-Secret-Key-Change-This-In-Production-2024
JWT_EXPIRATION=7d
NODE_ENV=production
PORT=3000
```

5. Click **"Save"**

**Important Notes:**
- `${{Postgres.*}}` variables are auto-provided by Railway
- Replace `FamBudget-Super-Secret-Key...` with a random string (32+ characters)
- Railway automatically connects to your Postgres database

### Step 6: Generate JWT_SECRET (Optional but Recommended)

Run this in PowerShell to generate a random secret:

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 40 | % {[char]$_})
```

Copy the result and use it for `JWT_SECRET`.

### Step 7: Wait for Deployment

Railway will automatically:
1. ✅ Install dependencies (`npm install`)
2. ✅ Build TypeScript (`npm run build`)
3. ✅ Start server (`npm start`)
4. ✅ Give you a URL

**Watch the "Deployments" tab** to see progress.

Deployment usually takes **2-5 minutes**.

### Step 8: Get Your Backend URL

1. Click on your **backend service**
2. Go to **"Settings"** tab
3. Scroll to **"Domains"** section
4. You'll see your URL like:
   ```
   https://fambudget-production.up.railway.app
   ```
5. **Copy this URL** - you need it!

### Step 9: Test Your Backend

**Test in browser:**
Open this URL in your browser:
```
https://your-backend-url.railway.app/health
```

Should show:
```json
{
  "status": "ok",
  "message": "FamBudget API is running",
  "timestamp": "2024-01-15T..."
}
```

**Test with PowerShell:**
```powershell
curl https://your-backend-url.railway.app/health
```

✅ **If this works, backend is deployed!**

### Step 10: Connect Web App

1. **Open your web app**: https://lalupj07.github.io/FamBudget
2. **Open browser console** (Press F12)
3. **Run this command** (replace with your actual Railway URL):
   ```javascript
   localStorage.setItem('fambudget_api_url', 'https://your-backend-url.railway.app');
   ```
4. **Refresh the page**
5. **Check console** - should see API calls!

### Step 11: Test It Works

1. Try adding a transaction
2. Check browser console - should see API request
3. Check Railway logs - should see the request
4. Data is now saved to PostgreSQL! 🎉

## Troubleshooting

### "Build Failed"

**Check:**
- Railway logs (Deployments tab → Latest deployment → View Logs)
- Verify `backend/package.json` exists
- Check TypeScript compiles correctly

**Fix:**
- Make sure Root Directory is set to `backend`
- Check environment variables are set

### "Database Connection Error"

**Check:**
- PostgreSQL service is created
- Environment variables match Postgres service name
- Railway auto-provides `${{Postgres.*}}` variables

**Fix:**
- Make sure Postgres service exists
- Check variable names match (should be `${{Postgres.*}}`)

### "Backend Won't Start"

**Check Railway logs:**
1. Click on backend service
2. Go to "Deployments" tab
3. Click on latest deployment
4. View logs

**Common issues:**
- PORT not set (should be 3000)
- Database connection failed
- Missing environment variables

### "Web App Can't Connect"

**Check:**
1. Backend URL is correct
2. Backend health endpoint works (`/health`)
3. CORS is enabled (it should be in `main.ts`)
4. Browser console for errors

**Fix:**
- Verify backend URL: `https://your-backend-url.railway.app/health`
- Check CORS in `backend/src/main.ts` (should allow `origin: '*'`)

## Railway Free Tier

- **$5 credit** per month
- **Enough for development**
- **Sleeps after inactivity** (wakes automatically)
- **PostgreSQL included** (512MB storage)

## What Happens After Deployment

✅ **Backend online** at Railway URL  
✅ **PostgreSQL database** created  
✅ **Health endpoint** working  
✅ **Web app can connect**  
✅ **Data synced** to database  

## Next Steps

1. ✅ Deploy backend to Railway
2. ✅ Test health endpoint
3. ✅ Set API URL in web app
4. ✅ Test adding transactions
5. ✅ Verify data in PostgreSQL

## Quick Commands Reference

### Generate JWT_SECRET
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 40 | % {[char]$_})
```

### Test Backend
```powershell
curl https://your-backend-url.railway.app/health
```

### Set API URL (Browser Console)
```javascript
localStorage.setItem('fambudget_api_url', 'https://your-backend-url.railway.app');
```

---

**Ready to deploy?** Follow the steps above! 🚀

If you get stuck, check Railway logs or ask for help!

