# 🏥 Fix Health Check Failure

## ❌ Error: Healthcheck failed - 1/1 replicas never became healthy

Your backend is failing health checks, which means Railway can't verify the app is running.

## 🔍 Common Causes

1. **App crashing on startup** (database connection errors)
2. **App not listening on correct port** (0.0.0.0 vs localhost)
3. **Missing environment variables** causing startup failure
4. **Database connection blocking startup**
5. **Health endpoint not accessible**

## ✅ Fixes Applied

I've updated the backend code to:
1. ✅ Listen on `0.0.0.0` instead of `localhost` (required for Railway)
2. ✅ Added retry logic for database connections
3. ✅ Added better error handling
4. ✅ Added connection timeout

**You need to commit and push these changes!**

## 📋 Step 1: Commit and Push Changes

```bash
cd backend
git add src/main.ts src/app.module.ts
git commit -m "Fix Railway health check: listen on 0.0.0.0, add DB retry logic"
git push origin main
```

Railway will automatically redeploy after you push.

## ⚙️ Step 2: Verify All Environment Variables

Make sure ALL of these are set in Railway:

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

**Check Railway → Backend service → Variables tab**

## 🗄️ Step 3: Verify PostgreSQL Database

1. **Check database exists:**
   - Railway → Your project
   - Should see PostgreSQL service (status: "Active")

2. **Verify database name in variables:**
   - Check database service name (e.g., "Postgres")
   - Make sure variables use correct name: `${{Postgres.*}}`
   - If different, update variables accordingly

## ⏱️ Step 4: Wait for Redeploy

1. **After pushing code:**
   - Railway will detect the push
   - Will automatically start new deployment
   - Wait 2-5 minutes

2. **Watch deployment:**
   - Go to Deployments tab
   - Watch for:
     - ✅ Installing dependencies
     - ✅ Building backend
     - ✅ Starting server
     - ✅ Health check passing

## ✅ Step 5: Check Logs

1. **Go to Railway → Backend service → Deployments**
2. **Click on latest deployment → View Logs**
3. **Look for:**
   - ✅ "FamBudget API running on http://0.0.0.0:3000"
   - ✅ "Health check available at /health"
   - ❌ Any error messages

## 🧪 Step 6: Test Health Endpoint

After deployment completes:

```
https://fambudget-production.up.railway.app/health
```

Should return:
```json
{
  "status": "ok",
  "message": "FamBudget API is running",
  "timestamp": "..."
}
```

## 🔍 Troubleshooting

### App Still Not Starting

**Check logs for:**
- Database connection errors
- Missing environment variables
- TypeScript build errors
- Port binding errors

**Fix:**
- Verify all environment variables are set
- Check PostgreSQL is "Active"
- Verify database service name matches in variables

### Health Check Still Failing

**Possible causes:**
- App not listening on 0.0.0.0 (fixed in code update)
- Wrong port (should be 3000)
- App crashing before health check

**Fix:**
- Make sure code changes are pushed
- Check Railway logs for startup errors
- Verify PORT=3000 is set

### Database Connection Errors

**Check:**
- PostgreSQL service is "Active" (not provisioning)
- Environment variables use correct database service name
- Database has finished provisioning (wait 2-3 minutes after creating)

**Fix:**
- Wait for database to be fully provisioned
- Verify `${{Postgres.*}}` variables (replace Postgres with actual name)

## 📋 Complete Checklist

- [ ] Code changes committed and pushed
- [ ] All 10 environment variables set in Railway
- [ ] PostgreSQL database exists and is "Active"
- [ ] Database service name matches in variables
- [ ] Waited for deployment (2-5 minutes)
- [ ] Checked Railway logs for errors
- [ ] Tested health endpoint (returns JSON)
- [ ] Health check passes in Railway

## ✅ Success!

Once health checks pass:
- ✅ Backend is running and healthy
- ✅ Railway will route traffic to your app
- ✅ Web app can connect to backend
- ✅ Everything should work!

---

**After pushing changes, wait for Railway to redeploy and check the health endpoint!**

