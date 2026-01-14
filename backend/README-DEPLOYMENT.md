# Backend Deployment Guide - Railway

## Quick Deploy to Railway

### Step 1: Prepare Backend

✅ Backend is ready:
- `package.json` configured
- `railway.json` created
- `Procfile` created
- Health endpoint added
- CORS enabled for web app

### Step 2: Deploy to Railway

1. **Go to Railway**: https://railway.app
2. **Sign up** with GitHub (free tier available)
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your `FamBudget` repository**
6. Railway will auto-detect the backend
7. **Click on the service** → **Settings** tab
8. **Set Root Directory**: `backend`
9. **Railway will automatically**:
   - Detect NestJS
   - Install dependencies
   - Build the app
   - Start it

### Step 3: Add PostgreSQL Database

1. In Railway project, click **"New"** button
2. Select **"Database"** → **"PostgreSQL"**
3. Railway creates PostgreSQL automatically
4. **Copy the database connection details** (you'll need them)

### Step 4: Configure Environment Variables

1. Click on your **backend service**
2. Go to **"Variables"** tab
3. Click **"New Variable"**
4. Add these variables (Railway auto-provides Postgres ones):

```env
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_DATABASE=${{Postgres.PGDATABASE}}
JWT_SECRET=your-super-secret-key-change-this-123456789
JWT_EXPIRATION=7d
NODE_ENV=production
PORT=3000
```

**Important:**
- Replace `your-super-secret-key-change-this-123456789` with a random string
- Railway variables with `${{Postgres.*}}` are auto-filled

### Step 5: Deploy

Railway will automatically:
1. ✅ Build your backend
2. ✅ Run migrations (if any)
3. ✅ Start the server
4. ✅ Give you a URL

### Step 6: Get Your Backend URL

1. Click on your **backend service**
2. Go to **"Settings"** tab
3. Under **"Domains"**, you'll see your URL:
   ```
   https://your-app-name.up.railway.app
   ```
4. **Copy this URL** - you'll need it!

### Step 7: Test Backend

Open in browser or test with curl:
```bash
curl https://your-backend-url.railway.app/health
```

Should return:
```json
{
  "status": "ok",
  "message": "FamBudget API is running",
  "timestamp": "..."
}
```

### Step 8: Connect Web App

Once backend is working:

1. **Open your deployed web app**: https://lalupj07.github.io/FamBudget
2. **Open browser console** (F12)
3. **Run this command**:
   ```javascript
   localStorage.setItem('fambudget_api_url', 'https://your-backend-url.railway.app');
   ```
4. **Refresh the page**
5. **Web app will now use backend API!** 🎉

## Alternative: Update index.html Permanently

Instead of setting in browser, you can update the web app code:

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

## Troubleshooting

### Backend won't start
- Check environment variables are set correctly
- Check PostgreSQL connection
- Look at Railway logs (Deployments tab)

### Can't connect to backend
- Check backend URL is correct
- Check CORS is enabled (it should be)
- Check backend health endpoint works
- Check browser console for errors

### Database errors
- Verify PostgreSQL is created
- Check DB environment variables match Postgres service
- Railway auto-provides Postgres variables

## Railway Free Tier Limits

- **$5 credit** per month (usually enough for development)
- **Sleeps after inactivity** (wakes automatically)
- **PostgreSQL included** (512MB storage)

## Next Steps After Deployment

1. ✅ Test backend health endpoint
2. ✅ Set API URL in web app
3. ✅ Test creating a transaction
4. ✅ Verify data syncs to backend

Your app is now fully connected! 🚀

