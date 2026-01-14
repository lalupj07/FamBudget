# ⚡ Quick Setup Steps - PostgreSQL & Variables

## 📊 Add PostgreSQL Database

1. **Railway Dashboard** → Your Project
2. Click **"+ New"** (top right)
3. Select **"Database"** → **"PostgreSQL"**
4. Wait for it to be **"Active"** (1-2 minutes)
5. **Note the name** (usually "Postgres") - you'll need this!

## ⚙️ Set Environment Variables

1. **Backend Service** → **"Variables"** tab
2. Click **"Raw Editor"** (top right)
3. **Copy from `ENV-VARIABLES-TEMPLATE.txt`** and paste:

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

4. **Replace `Postgres`** with your actual database service name if different
5. Click **"Update Variables"**
6. **Wait 2-5 minutes** for redeploy

## ✅ Test

Visit: `https://fambudget-production.up.railway.app/health`

Should return JSON (not 502)!

---

**Done!** Your backend should now work! 🎉

