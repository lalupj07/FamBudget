# 🔗 Backend URL Setup

## ✅ Your Backend URL

```
https://fambudget-production.up.railway.app
```

## 🧪 Test Your Backend

Open this in your browser:
```
https://fambudget-production.up.railway.app/health
```

You should see:
```json
{
  "status": "ok",
  "message": "FamBudget API is running",
  "timestamp": "..."
}
```

## 🔗 Connect Web App to Backend

### Method 1: Browser Console (Quick Test)

1. **Open your web app:**
   - Go to: https://lalupj07.github.io/FamBudget

2. **Open Browser Console:**
   - Press **F12** (or Right-click → Inspect → Console tab)

3. **Run this command:**
   ```javascript
   localStorage.setItem('fambudget_api_url', 'https://fambudget-production.up.railway.app');
   location.reload();
   ```

4. **Done!** The web app will reload and use your backend.

### Method 2: Update Code (Permanent)

1. **Edit `desktop-app/index.html`**
2. **Find this line** (around line 40):
   ```html
   <script>
     window.API_BASE_URL = localStorage.getItem('fambudget_api_url') || null;
   </script>
   ```
3. **Change it to:**
   ```html
   <script>
     window.API_BASE_URL = localStorage.getItem('fambudget_api_url') || 'https://fambudget-production.up.railway.app';
   </script>
   ```
4. **Redeploy web app:**
   ```bash
   cd desktop-app
   npm run deploy
   ```

## ✅ Verify It Works

1. **In the web app:**
   - Try adding a transaction
   - Try creating a goal
   - Try adding an account

2. **Check Railway logs:**
   - Railway → Backend service → Deployments → View Logs
   - You should see API requests coming in!

3. **Check browser console:**
   - F12 → Network tab → Filter by "Fetch/XHR"
   - You should see API calls to `fambudget-production.up.railway.app`

## 🎉 Success!

Once connected, your web app will:
- Save data to PostgreSQL database
- Sync data across sessions
- Work with multiple users
- Be fully functional!

---

**Backend URL:** `https://fambudget-production.up.railway.app`

