# 🚀 Start Backend Deployment - Railway

## ✅ Everything is Ready!

Your backend is **100% configured** and ready to deploy:

### ✅ Files Created
- `backend/railway.json` - Railway deployment config
- `backend/Procfile` - Heroku/alternative deployment
- `backend/src/health.controller.ts` - Health check endpoint
- `backend/.railwayignore` - Files to ignore
- `backend/src/app.module.ts` - Updated with health controller

### ✅ Features Ready
- CORS enabled (web app can connect)
- PostgreSQL configured
- Health endpoint ready
- Environment variables configured
- Build scripts ready

## 🎯 Deploy to Railway (Recommended)

### Quick Steps:

1. **Go to Railway**: https://railway.app
2. **Sign up** with GitHub (free)
3. **New Project** → **Deploy from GitHub repo**
4. **Select** `FamBudget` repository
5. **Configure**:
   - Root Directory: `backend`
   - Railway auto-detects NestJS
6. **Add PostgreSQL**: Click "New" → "Database" → "PostgreSQL"
7. **Set Environment Variables** (see below)
8. **Deploy!** Railway does the rest

### Environment Variables:

Click **"Raw Editor"** in Railway Variables tab, paste:

```env
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_DATABASE=${{Postgres.PGDATABASE}}
JWT_SECRET=your-random-secret-key-123456789012345678901234567890
JWT_EXPIRATION=7d
NODE_ENV=production
PORT=3000
```

**Generate JWT_SECRET** (run in PowerShell):
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 40 | % {[char]$_})
```

### Get Your Backend URL:

After deployment:
- Go to **Settings** tab
- Find **Domains** section
- Copy URL: `https://your-app.railway.app`

### Test Backend:

Open in browser:
```
https://your-backend-url.railway.app/health
```

Should show:
```json
{"status":"ok","message":"FamBudget API is running","timestamp":"..."}
```

## 🔗 Connect Web App

After backend is deployed:

### Quick Method (Browser Console):
1. Open: https://lalupj07.github.io/FamBudget
2. Press **F12** (open console)
3. Run:
   ```javascript
   localStorage.setItem('fambudget_api_url', 'https://your-backend-url.railway.app');
   ```
4. Refresh page

### Permanent Method (Code):
1. Edit `desktop-app/index.html`:
   ```html
   <script>
       window.API_BASE_URL = 'https://your-backend-url.railway.app';
   </script>
   ```
2. Rebuild and deploy:
   ```bash
   cd desktop-app
   npm run build:web
   npm run deploy
   ```

## 📚 Detailed Guides

- **`DEPLOY-BACKEND-NOW.md`** - Complete step-by-step guide
- **`DEPLOY-TO-RAILWAY.md`** - Railway-specific guide
- **`BACKEND-INTEGRATION-COMPLETE.md`** - Integration details

## 🎉 What Happens Next

1. ✅ Backend deployed to Railway
2. ✅ PostgreSQL database created
3. ✅ Web app connects to backend
4. ✅ Data synced to database
5. ✅ Multi-user ready!

## ⚡ Quick Start

**Right now:**
1. Open https://railway.app
2. Start deployment
3. Follow steps above
4. Get your backend URL
5. Connect web app

**Time needed:** ~5-10 minutes

Ready? Let's deploy! 🚀

