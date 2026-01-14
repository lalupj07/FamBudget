# 🔗 Quick Connect Web App to Backend

## Fast Method: Browser Console

1. **Get your backend URL from Railway**
   - Railway → Backend service → Settings → Domains
   - Copy the URL (e.g., `https://fambudget-production-xxxx.up.railway.app`)

2. **Open your web app**
   - Go to: https://lalupj07.github.io/FamBudget

3. **Open Browser Console**
   - Press **F12** (or Right-click → Inspect → Console)

4. **Run this command** (replace `YOUR_BACKEND_URL` with your actual URL):
   ```javascript
   localStorage.setItem('fambudget_api_url', 'YOUR_BACKEND_URL');
   location.reload();
   ```

5. **Done!** The web app will reload and use your backend.

## Verify It Works

1. **Try adding a transaction** in the web app
2. **Check Railway logs**:
   - Railway → Backend service → Deployments → View Logs
   - You should see API requests!
3. **Check browser console**:
   - F12 → Network tab → Filter by "Fetch/XHR"
   - You should see API calls to your Railway backend!

## Permanent Method (Update Code)

If you want to make it permanent:

1. **Edit `desktop-app/index.html`**
2. **Find this line** (around line 40):
   ```html
   <script>
     window.API_BASE_URL = localStorage.getItem('fambudget_api_url') || null;
   </script>
   ```
3. **Change it to** (replace with your actual URL):
   ```html
   <script>
     window.API_BASE_URL = localStorage.getItem('fambudget_api_url') || 'https://your-backend-url.railway.app';
   </script>
   ```
4. **Redeploy web app:**
   ```bash
   cd desktop-app
   npm run deploy
   ```

## ✅ That's It!

Your web app is now connected to your Railway backend! 🎉

