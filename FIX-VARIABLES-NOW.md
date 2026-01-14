# 🚨 FIX THIS NOW: Add Environment Variables to Railway

## Problem Found in Logs

Your logs clearly show:
```
❌ ENCRYPTION_KEY
❌ DB_HOST  ← CRITICAL - This is why it's crashing!
```

**The app is trying to connect to `localhost:5432` because `DB_HOST` is missing!**

## ✅ Solution: Add Variables in Railway

### Step 1: Open Railway
1. Go to: https://railway.app
2. Login to your account
3. Click on **FamBudget** project
4. Click on your **backend service**

### Step 2: Add Variables
1. Click **"Variables"** tab (top menu)
2. Click **"+ New Variable"** button
3. Add **ALL 10 variables** one by one

### Step 3: Copy-Paste These Variables

**⚠️ IMPORTANT:** Replace `Postgres` with your **actual PostgreSQL service name** in Railway!

For each variable:
- **Key**: The name (e.g., `DB_HOST`)
- **Value**: The value below

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

### Step 5: How to Add Each Variable

For example, to add `DB_HOST`:
1. Click **"+ New Variable"**
2. **Key**: `DB_HOST`
3. **Value**: `${{Postgres.PGHOST}}` (replace `Postgres` with your actual service name!)
4. Click **"Add"** or **"Save"**

Repeat for all 10 variables!

### Step 6: Verify All Variables Are Added

In Railway Variables tab, you should see:
- ✅ `DB_HOST` = `${{Postgres.PGHOST}}` (or your service name)
- ✅ `DB_PORT` = `${{Postgres.PGPORT}}`
- ✅ `DB_USERNAME` = `${{Postgres.PGUSER}}`
- ✅ `DB_PASSWORD` = `${{Postgres.PGPASSWORD}}`
- ✅ `DB_DATABASE` = `${{Postgres.PGDATABASE}}`
- ✅ `JWT_SECRET` = `GxeqiBSQjmoD6JnkKHuA347sbZrh5VylvgL1XOdP`
- ✅ `JWT_EXPIRATION` = `7d`
- ✅ `NODE_ENV` = `production`
- ✅ `PORT` = `3000`
- ✅ `ENCRYPTION_KEY` = `3Rnw0gpThAEiKZCo6dFxBkbXHlIcju8sUQV4ravYPtzMyG7eOD5LJfqW12SN9m`

### Step 7: Wait for Redeploy

1. After adding all variables, Railway will **automatically redeploy**
2. Wait for deployment to complete
3. Check logs again

## ✅ Expected Result

After adding variables, logs should show:
```
✅ ENCRYPTION_KEY
✅ DB_HOST
✅ JWT_SECRET
✅ NODE_ENV
✅ PORT
📊 Database configuration loaded
   Host: <railway-postgres-host>:5432  ← Should NOT be "localhost"!
✅ SERVER IS LISTENING!
🚀 FamBudget API is READY!
```

## ❌ If Still Failing

If `DB_HOST` is still showing as missing:
1. Double-check the PostgreSQL service name
2. Make sure you're using `${{ServiceName.PGHOST}}` format
3. Verify the service name matches exactly (case-sensitive!)

---

**After adding variables, Railway will auto-redeploy. The app should start successfully!** 🚀

