# 🔐 Fix ENCRYPTION_KEY Error

## ❌ Error: ENCRYPTION_KEY not set in environment

Your backend is failing because the `ENCRYPTION_KEY` environment variable is missing.

## ✅ Solution: Add ENCRYPTION_KEY

### Step 1: Get Your Encryption Key

An encryption key has been generated for you:
- **File:** `ENCRYPTION_KEY.txt`
- **Copy the key** from this file

### Step 2: Add ENCRYPTION_KEY to Railway

1. **Go to Railway Dashboard:**
   - Open your **backend service**
   - Go to **"Variables"** tab
   - Click **"Raw Editor"** (top right)

2. **Add ENCRYPTION_KEY:**
   - Copy the key from `ENCRYPTION_KEY.txt`
   - Add this line to your variables:
     ```
     ENCRYPTION_KEY=your-key-from-file
     ```

3. **OR update all variables:**
   - Copy ALL variables from `ENV-VARIABLES-TEMPLATE.txt`
   - Replace `REPLACE_WITH_KEY_FROM_ENCRYPTION_KEY.txt` with actual key
   - Paste into Raw Editor
   - Click **"Update Variables"**

### Step 3: Wait for Redeploy

1. Railway will automatically redeploy after saving
2. Wait 2-5 minutes
3. Check Deployments tab for green checkmark ✅

### Step 4: Test Again

Visit: `https://fambudget-production.up.railway.app/health`

Should now return JSON (not error)!

## 📋 Complete Environment Variables List

Here's the complete list you need in Railway:

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
ENCRYPTION_KEY=YOUR_KEY_FROM_ENCRYPTION_KEY.txt
```

**Important:**
- Replace `YOUR_KEY_FROM_ENCRYPTION_KEY.txt` with the actual key from the file
- Replace `Postgres` with your actual database service name if different

## ✅ Verification

After adding ENCRYPTION_KEY:
- ✅ Railway should automatically redeploy
- ✅ Check Deployments tab for green checkmark
- ✅ Test health endpoint: should return JSON
- ✅ Backend should start without errors

---

**Done!** Your backend should now start successfully! 🎉

