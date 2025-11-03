# 🚨 CRITICAL: Fix Missing Environment Variables

## Problem Found in Logs

The Railway logs show:
```
❌ ENCRYPTION_KEY
❌ DB_HOST
```

**The app is trying to connect to `localhost:5432` because `DB_HOST` is missing!**

## ✅ Solution: Add Environment Variables in Railway

### Step 1: Open Railway
1. Go to: https://railway.app
2. Login and select your **FamBudget** project
3. Click on your **backend service**

### Step 2: Add Variables
1. Go to **"Variables"** tab
2. Click **"New Variable"**
3. Add **ALL** of these variables:

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

### Step 3: Important Notes

**⚠️ CRITICAL:** 
- **DB_HOST** must use `${{Postgres.PGHOST}}` where `Postgres` is the **exact name** of your PostgreSQL service
- Check your PostgreSQL service name in Railway
- If it's called something else (like `postgres` or `PostgreSQL`), use that name instead

**Example:**
- If PostgreSQL service is named `Postgres` → `DB_HOST=${{Postgres.PGHOST}}`
- If PostgreSQL service is named `postgres` → `DB_HOST=${{postgres.PGHOST}}`
- If PostgreSQL service is named `PostgreSQL` → `DB_HOST=${{PostgreSQL.PGHOST}}`

### Step 4: Verify PostgreSQL Service
1. Make sure you have a **PostgreSQL** service added to your project
2. The service should be **"Active"** (not "Provisioning")
3. Note the **exact name** of the service

### Step 5: Redeploy
After adding variables, Railway will automatically redeploy. Check the logs again!

## 🔍 How to Check Service Name

1. In Railway project view, look at your services
2. Find the PostgreSQL service
3. Note the **exact name** (case-sensitive!)
4. Use that name in the variable: `${{ServiceName.PGHOST}}`

## ✅ Expected Result

After adding variables, logs should show:
```
✅ ENCRYPTION_KEY
✅ DB_HOST
✅ JWT_SECRET
✅ NODE_ENV
✅ PORT
📊 Database configuration loaded
   Host: <railway-postgres-host>:5432  <-- Should NOT be localhost!
```

## 🎯 Quick Copy-Paste

Copy this entire block and paste into Railway Variables (replace `Postgres` with your actual service name):

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

