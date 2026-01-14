# ⚠️ Backend 502 Error - Fix Guide

## 🔍 Error: Application failed to respond (502)

The backend returned a 502 error, which means Railway can't connect to your application.

## 🔍 Possible Causes

1. **Backend still starting up** (wait a few minutes)
2. **Database connection issues** (environment variables not set)
3. **Backend crashed** (check Railway logs)
4. **Port configuration** (PORT environment variable)
5. **Build errors** (TypeScript compilation failed)

## ✅ Step-by-Step Fix

### Step 1: Check Railway Logs

1. **Go to Railway dashboard:**
   - Click on your **backend service**
   - Go to **"Deployments"** tab
   - Click on the **latest deployment**
   - Click **"View Logs"**

2. **Look for errors:**
   - ❌ Database connection errors
   - ❌ TypeScript build errors
   - ❌ Missing environment variables
   - ❌ Port binding errors
   - ❌ Application crashes

### Step 2: Verify Environment Variables

1. **Go to your backend service** → **"Variables"** tab
2. **Verify these are ALL set:**
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

3. **If any are missing:**
   - Add them using **"Raw Editor"**
   - Make sure `Postgres` matches your database service name
   - Click **"Update Variables"**

### Step 3: Verify PostgreSQL Database

1. **Check if database service exists:**
   - In Railway dashboard, you should see a PostgreSQL service
   - It should be **"Active"** (not provisioning or failed)

2. **If database doesn't exist:**
   - Click **"+ New"** → **"Database"** → **"PostgreSQL"**
   - Wait for it to provision (2-3 minutes)

### Step 4: Check Build Status

1. **Go to Deployments tab:**
   - Look at the latest deployment
   - Check if **"Build"** step succeeded ✅
   - Check if **"Deploy"** step succeeded ✅

2. **If build failed:**
   - Check build logs for TypeScript errors
   - Make sure Root Directory is set to `backend`
   - Verify all dependencies are in `package.json`

### Step 5: Redeploy

1. **If you changed environment variables:**
   - Railway should auto-redeploy
   - If not, go to **"Deployments"** tab
   - Click **"Redeploy"** button

2. **Wait for deployment:**
   - Watch the logs in real-time
   - Look for successful startup message:
     ```
     🚀 FamBudget API running on http://localhost:3000
     ```

### Step 6: Check Application Logs

1. **After deployment:**
   - Go to **"Deployments"** → **"View Logs"**
   - Scroll to the bottom
   - Look for:
     - ✅ "FamBudget API running on..."
     - ❌ Any error messages
     - ❌ Database connection errors

## 🔍 Common Issues & Fixes

### Issue 1: Database Connection Error

**Error in logs:**
```
Error: connect ECONNREFUSED ...
```

**Fix:**
- Verify PostgreSQL service is created and running
- Check environment variables match database service name
- Verify `${{Postgres.*}}` variables are set correctly

### Issue 2: Missing Environment Variables

**Error in logs:**
```
Error: JWT_SECRET is required
```

**Fix:**
- Add all environment variables in Railway
- Make sure `JWT_SECRET` is set
- Verify `NODE_ENV=production`

### Issue 3: Port Binding Error

**Error in logs:**
```
Error: listen EADDRINUSE: address already in use
```

**Fix:**
- Make sure `PORT=3000` is set
- Railway should handle port binding automatically

### Issue 4: TypeScript Build Error

**Error in logs:**
```
error TS2304: Cannot find name...
```

**Fix:**
- Check build logs for TypeScript errors
- Verify all dependencies are installed
- Check if Root Directory is correct

## ✅ Verification

Once fixed, test your backend:

1. **Open in browser:**
   ```
   https://fambudget-production.up.railway.app/health
   ```

2. **Should return:**
   ```json
   {
     "status": "ok",
     "message": "FamBudget API is running",
     "timestamp": "..."
   }
   ```

3. **If still 502:**
   - Wait 2-3 minutes (Railway might be waking up)
   - Check Railway logs again
   - Verify all services are "Active"

## 🆘 Still Not Working?

1. **Check Railway status page:** https://status.railway.app
2. **Check your Railway plan:** Free tier sleeps after 5 minutes
3. **Review all logs:** Go through each deployment step
4. **Verify code:** Make sure backend code is pushed to GitHub

---

**Most Common Issue:** Missing PostgreSQL database or environment variables!

Make sure:
- ✅ PostgreSQL database is created
- ✅ All environment variables are set
- ✅ Database service name matches in variables (e.g., `Postgres`)

