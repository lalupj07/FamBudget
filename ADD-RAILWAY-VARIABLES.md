# 🚨 CRITICAL FIX: Add Environment Variables to Railway

## Problem

Your Railway logs show:
- `❌ DB_HOST` - **MISSING!**
- `❌ ENCRYPTION_KEY` - **MISSING!**

The app is trying to connect to `localhost:5432` instead of your Railway PostgreSQL database.

## ✅ Solution: Add Variables in Railway

### Step 1: Open Railway Dashboard
1. Go to: https://railway.app
2. Login to your account
3. Click on **FamBudget** project
4. Click on your **backend service** (the one that's failing)

### Step 2: Add Variables
1. Click **"Variables"** tab (top menu)
2. Click **"+ New Variable"** button
3. Add **ALL 10 variables** below:

### Step 3: Copy These Variables

**⚠️ IMPORTANT:** Replace `Postgres` with your **actual PostgreSQL service name** in Railway!

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
ENCRYPTION_KEY=3Rnw0gpThAEiKZCo6dFxBkbXHlIcju8sUQV4ravYPtzMyG7eOD5LJfqW12SN9m
```

### Step 4: Find Your PostgreSQL Service Name

1. In Railway project view, look at **all services**
2. Find the **PostgreSQL** service
3. Check the **exact name** (case-sensitive!)
   - Common names: `Postgres`, `postgres`, `PostgreSQL`, `postgresql`
4. Use that name in the variables:
   - If service is `Postgres` → `DB_HOST=${{Postgres.PGHOST}}`
   - If service is `postgres` → `DB_HOST=${{postgres.PGHOST}}`
   - If service is `PostgreSQL` → `DB_HOST=${{PostgreSQL.PGHOST}}`

### Step 5: Add Each Variable

For each variable:
1. **Key**: `DB_HOST`
2. **Value**: `${{Postgres.PGHOST}}` (use your actual service name!)

Repeat for all 10 variables:
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- `JWT_SECRET`, `JWT_EXPIRATION`, `NODE_ENV`, `PORT`, `ENCRYPTION_KEY`

### Step 6: Save and Wait

1. Click **"Save"** or **"Update"**
2. Railway will **automatically redeploy**
3. Wait for deployment to complete
4. Check logs - should now show:
   ```
   ✅ ENCRYPTION_KEY
   ✅ DB_HOST
   ✅ JWT_SECRET
   ✅ NODE_ENV
   ✅ PORT
   ```

## ✅ Expected Result

After adding variables, logs should show:
```
📊 Database configuration loaded
   Host: <railway-postgres-host>:5432  <-- Should NOT be "localhost"!
   Database: fambudget
```

And the app should **start successfully** instead of crashing!

## 🔍 Verify Variables Are Set

In Railway:
1. Go to backend service → Variables tab
2. You should see **all 10 variables** listed
3. Values starting with `${{` are Railway references (correct!)
4. Values like `GxeqiBSQjmoD6JnkKHuA347sbZrh5VylvgL1XOdP` are direct values (correct!)

## 🎯 Quick Checklist

Before checking logs, verify:
- [ ] PostgreSQL service exists and is **"Active"** (not "Provisioning")
- [ ] All 10 environment variables are added
- [ ] `DB_HOST` uses Railway reference: `${{ServiceName.PGHOST}}`
- [ ] Service name matches exactly (case-sensitive!)
- [ ] Variables are saved
- [ ] Deployment completed

---

**After adding variables, Railway will auto-redeploy. Check the logs again - it should work!** 🚀

