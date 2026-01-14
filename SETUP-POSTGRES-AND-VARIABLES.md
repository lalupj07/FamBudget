# 🔧 Setup PostgreSQL Database & Environment Variables

## 🎯 Complete Setup Guide

Follow these steps to fix the 502 error by setting up PostgreSQL and environment variables.

## 📊 Step 1: Add PostgreSQL Database

1. **Go to Railway Dashboard:**
   - Open: <https://railway.app>
   - Click on your project (e.g., "FamBudget")

2. **Add PostgreSQL Database:**
   - Click **"+ New"** button (top right of your project dashboard)
   - Select **"Database"** from the dropdown
   - Choose **"PostgreSQL"**
   - Railway will automatically create and configure it

3. **Wait for Database:**
   - Railway will provision the database (takes 1-2 minutes)
   - It will appear as a new service card (usually named "Postgres" or "PostgreSQL")
   - Status should show **"Active"** when ready

4. **Note the Database Service Name:**
   - Look at the database service card
   - Note the name (usually "Postgres", "postgres", or "PostgreSQL")
   - You'll need this for environment variables!

## ⚙️ Step 2: Set Environment Variables

1. **Go to Your Backend Service:**
   - Click on your **backend service** (not the database)
   - Go to **"Variables"** tab

2. **Open Raw Editor:**
   - Click **"Raw Editor"** button (top right of Variables section)
   - This makes it easier to paste all variables at once

3. **Paste All Variables:**
   - Copy and paste ALL of these (replace `Postgres` with your actual database service name if different):

```env
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_DATABASE=${{Postgres.PGDATABASE}}
JWT_SECRET=GxeqiBSQjmoD6JnkKHuA347sbZrh5VylvgL1XOdP
JWT_EXPIRATION=7d
NODE_ENV=production
PORT=3000
ENCRYPTION_KEY=YOUR_KEY_FROM_ENCRYPTION_KEY.txt
```

**Important:**

- Copy the encryption key from `ENCRYPTION_KEY.txt` file
- Replace `YOUR_KEY_FROM_ENCRYPTION_KEY.txt` with the actual key

1. **Important Notes:**
   - Replace `Postgres` with your actual database service name if different
   - The `${{...}}` syntax tells Railway to use values from the database service
   - If your database is named "postgres" (lowercase), use: `${{postgres.PGHOST}}`
   - If your database is named "PostgreSQL", use: `${{PostgreSQL.PGHOST}}`

2. **Click "Update Variables"** or **"Save"**

3. **Railway will automatically redeploy** after you save variables

## 🔍 Step 3: Verify Setup

### Check Database

- ✅ PostgreSQL service exists and is "Active"
- ✅ Database service name noted (e.g., "Postgres")

### Check Environment Variables

- ✅ All 9 variables are set
- ✅ Database variables use `${{ServiceName.*}}` format
- ✅ `JWT_SECRET` is set
- ✅ `NODE_ENV=production`
- ✅ `PORT=3000`

### Check Deployment

- ✅ Railway automatically redeployed after setting variables
- ✅ Watch Deployments tab for progress

## ⏱️ Step 4: Wait for Deployment

1. **Go to Deployments tab:**
   - Click on your backend service
   - Go to **"Deployments"** tab
   - Watch the latest deployment

2. **Watch the build:**
   - ✅ Installing dependencies
   - ✅ Building backend (`npm run build`)
   - ✅ Starting server

3. **Wait 2-5 minutes:**
   - Railway needs time to build and start
   - Look for green checkmark ✅ = Success!

## ✅ Step 5: Test Your Backend

1. **Wait for deployment to finish:**
   - Look for green checkmark in Deployments tab
   - Status should be "Active"

2. **Test health endpoint:**
   - Open in browser:

     ```text
     https://fambudget-production.up.railway.app/health
     ```

3. **Should return:**

   ```json
   {
     "status": "ok",
     "message": "FamBudget API is running",
     "timestamp": "2025-11-02T..."
   }
   ```

4. **If you get 502:**
   - Wait 1-2 more minutes (Railway might still be starting)
   - Check Railway logs for errors
   - Verify all variables are set correctly

## 🔍 Troubleshooting

### Database Service Name Mismatch

**Problem:** Variables use `${{Postgres.*}}` but database is named differently.

**Fix:**

1. Check your database service name in Railway
2. Update all `${{Postgres.*}}` to match (e.g., `${{postgres.*}}` or `${{PostgreSQL.*}}`)
3. Save and wait for redeploy

### Variables Not Saving

**Problem:** Variables won't save or keep disappearing.

**Fix:**

1. Use **"Raw Editor"** instead of adding individually
2. Make sure each variable is on its own line
3. Don't include extra spaces or quotes
4. Click "Update Variables" button

### Deployment Still Failing

**Problem:** Deployment succeeds but backend returns 502.

**Fix:**

1. Check Railway logs for specific errors
2. Verify database is "Active" (not provisioning)
3. Check that `PORT=3000` is set
4. Verify `NODE_ENV=production` is set
5. Make sure all database variables are set correctly

### Database Connection Error in Logs

**Problem:** Logs show database connection errors.

**Fix:**

1. Verify PostgreSQL service is created and Active
2. Check database service name matches in variables
3. Verify `${{ServiceName.*}}` syntax is correct
4. Wait 2-3 minutes after creating database (needs time to provision)

## 📋 Quick Checklist

- [ ] PostgreSQL database created in Railway
- [ ] Database service is "Active"
- [ ] Noted database service name
- [ ] Went to backend service → Variables tab
- [ ] Opened Raw Editor
- [ ] Pasted all 9 environment variables
- [ ] Replaced `Postgres` with actual service name if different
- [ ] Clicked "Update Variables"
- [ ] Waited for automatic redeploy (2-5 minutes)
- [ ] Checked Deployments tab for green checkmark
- [ ] Tested health endpoint
- [ ] Received JSON response (not 502)

## ✅ Success

Once the health endpoint returns JSON (not 502), your backend is fully configured!

Your backend URL:

```text
https://fambudget-production.up.railway.app
```

---

**Need help?** Check Railway logs in Deployments tab → View Logs for specific errors!
