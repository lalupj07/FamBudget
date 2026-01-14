# 🚀 Deploy Backend to Railway - Complete Guide

## ✅ Pre-Deployment Check

Your backend is **ready to deploy**:
- ✅ Build successful (TypeScript compiles)
- ✅ All dependencies installed
- ✅ Health endpoint configured
- ✅ CORS enabled for web app
- ✅ Environment variables configured

## 🔑 Step 1: Generate JWT_SECRET

A new JWT_SECRET has been generated for you (see below).

## 🚀 Step 2: Deploy to Railway

### A. Login to Railway

1. Go to: **https://railway.app**
2. Click **"Login"** or **"Start a New Project"**
3. **Sign in with GitHub** (recommended)

### B. Create New Project

1. Click **"New Project"** button (top right)
2. Select **"Deploy from GitHub repo"**
3. Authorize Railway to access GitHub (if needed)
4. Find and select **`FamBudget`** repository
5. Click **"Deploy Now"**

### C. Configure Service Root Directory

**IMPORTANT:** Railway must know to look in the `backend` folder!

1. Click on the **service** that was just created
2. Go to **"Settings"** tab
3. Scroll down to **"Root Directory"** section
4. Enter: **`backend`** (without quotes)
5. Click **"Save"** or press Enter
6. Railway will automatically redeploy

### D. Add PostgreSQL Database

1. In your Railway project dashboard, click **"New"** button (top right)
2. Select **"Database"** from the menu
3. Choose **"PostgreSQL"**
4. Railway will automatically:
   - Create the database
   - Provide connection variables
   - Name it something like "Postgres"

**Note the service name** - you'll use it in environment variables!

### E. Set Environment Variables

1. Go back to your **backend service** (not the database)
2. Click **"Variables"** tab
3. Click **"Raw Editor"** button (top right) - this makes it easier!
4. Paste **ALL** of these variables (replace `<JWT_SECRET>` with your actual secret):

```env
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_DATABASE=${{Postgres.PGDATABASE}}
JWT_SECRET=<YOUR_JWT_SECRET_HERE>
JWT_EXPIRATION=7d
NODE_ENV=production
PORT=3000
```

**Important Notes:**
- Replace `Postgres` with your database service name if it's different
- Replace `<YOUR_JWT_SECRET_HERE>` with the actual JWT_SECRET generated below
- The `${{...}}` syntax tells Railway to use values from another service

5. Click **"Update Variables"** or **"Save"**

### F. Wait for Deployment

1. Go to **"Deployments"** tab
2. Watch the build logs:
   - ✅ Installing dependencies (`npm install`)
   - ✅ Building backend (`npm run build`)
   - ✅ Starting server (`npm start`)
3. Wait 2-5 minutes
4. Look for green checkmark ✅ = Success!

### G. Get Your Backend URL

1. Stay in your **backend service**
2. Go to **"Settings"** tab
3. Scroll to **"Domains"** section
4. You'll see a URL like:
   ```
   https://fambudget-production-xxxx.up.railway.app
   ```
5. **Click "Generate Domain"** if you don't see one
6. **Copy the URL** - you'll need it!

### H. Test Your Backend

1. Open the health endpoint in your browser:
   ```
   https://your-backend-url.railway.app/health
   ```

2. You should see:
   ```json
   {
     "status": "ok",
     "message": "FamBudget API is running",
     "timestamp": "2025-11-02T..."
   }
   ```

✅ **If this works, your backend is deployed!**

## 🔗 Step 3: Connect Web App to Backend

### Option A: Browser Console (Quick Test)

1. Open your web app: **https://lalupj07.github.io/FamBudget**
2. Press **F12** to open Developer Tools
3. Go to **"Console"** tab
4. Run this command (replace with your actual backend URL):
   ```javascript
   localStorage.setItem('fambudget_api_url', 'https://your-backend-url.railway.app');
   location.reload();
   ```
5. The web app will now use your backend!

### Option B: Update Code (Permanent)

1. Edit `desktop-app/index.html`
2. Find the line setting `window.API_BASE_URL`
3. Update it with your Railway URL
4. Run `npm run deploy` to redeploy web app

## 📊 Step 4: Verify It Works

1. **In the web app:**
   - Try adding a transaction
   - Try creating a goal
   - Try adding an account

2. **In Railway:**
   - Go to **"Deployments"** tab
   - Click on latest deployment
   - Click **"View Logs"**
   - You should see API requests coming in!

3. **In Browser:**
   - Press **F12** → **"Network"** tab
   - Filter by **"Fetch/XHR"**
   - You should see API calls to your Railway backend

## 🔍 Troubleshooting

### ❌ Build Failed

**Check:**
- Railway logs (Deployments tab → View Logs)
- Verify Root Directory is set to `backend`
- Check `backend/package.json` exists
- Look for TypeScript errors in logs

**Fix:**
- Make sure all files are pushed to GitHub
- Verify Root Directory is exactly `backend` (lowercase)

### ❌ Database Connection Error

**Check:**
- Environment variables in Railway
- PostgreSQL service is created and running
- Database service name matches in variables (e.g., `Postgres`)

**Fix:**
- Verify `DB_HOST`, `DB_PORT`, etc. are set correctly
- Use `${{Postgres.PGHOST}}` format (replace `Postgres` with your service name)
- Make sure database service is deployed before backend

### ❌ Backend Won't Start

**Check:**
- Railway logs for error messages
- `PORT` environment variable is set to `3000`
- `NODE_ENV` is set to `production`

**Fix:**
- Check logs for specific error
- Verify all environment variables are set
- Ensure `dist/main.js` exists (build succeeded)

### ❌ Web App Can't Connect

**Check:**
- Backend URL is correct in `localStorage`
- Backend health endpoint works
- Browser console for CORS errors
- Network tab shows failed requests

**Fix:**
- Verify backend URL is accessible
- Check CORS is enabled in `backend/src/main.ts` (it should be `origin: '*'`)
- Make sure backend is running (green in Railway)

## 📝 Environment Variables Reference

```env
# Database (from PostgreSQL service)
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_DATABASE=${{Postgres.PGDATABASE}}

# JWT Authentication
JWT_SECRET=your-secret-key-here-minimum-32-characters
JWT_EXPIRATION=7d

# Application
NODE_ENV=production
PORT=3000
```

## 💡 Railway Free Tier Info

- **$5 credit** per month
- **Perfect for development** and testing
- **Sleeps after 5 minutes** of inactivity (wakes automatically on next request)
- **PostgreSQL included** (512MB storage, enough for testing)
- **Custom domain** available (optional)

## ✅ Success Checklist

- [ ] Backend service deployed to Railway
- [ ] Root Directory set to `backend`
- [ ] PostgreSQL database added
- [ ] All environment variables set
- [ ] Build successful (green checkmark)
- [ ] Backend URL obtained
- [ ] Health endpoint returns `{"status": "ok"}`
- [ ] Web app connected to backend
- [ ] Test transaction saved successfully
- [ ] API requests visible in Railway logs

---

**Need help?** Check Railway deployment logs or browser console for errors!

