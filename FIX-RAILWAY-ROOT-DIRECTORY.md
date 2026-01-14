# 🔧 Fix Railway Root Directory Error

## ❌ Error: "Could not find root directory: /backend"

This error means Railway can't find the `backend` folder in your repository.

## 🔍 Problem

Railway is looking for `/backend` (absolute path) but it might be set incorrectly.

## ✅ Solution: Set Root Directory Correctly

### Step 1: Go to Your Backend Service in Railway

1. In Railway dashboard, click on your **backend service** (the one that failed)
2. Go to **"Settings"** tab
3. Scroll down to **"Root Directory"** section

### Step 2: Fix Root Directory Setting

**Option A: If Root Directory field is empty or has "/backend"**

1. **Clear the field** (make it empty/blank)
2. OR change it to: `backend` (without the leading slash, lowercase)
3. Click **"Save"**

**Option B: Check your repository structure**

The root directory should be:
- **Relative path**: `backend` (not `/backend` or `./backend`)
- **Must match**: The folder name in your GitHub repository

### Step 3: Verify Your Repository Structure

Your repository structure should be:
```
FamBudget/
├── backend/          ← This folder exists
│   ├── src/
│   ├── package.json
│   └── ...
├── desktop-app/
├── mobile/
└── ...
```

### Step 4: Redeploy

1. After saving the Root Directory setting, Railway should automatically redeploy
2. OR go to **"Deployments"** tab and click **"Redeploy"**
3. Watch the logs - it should now find the `backend` folder

## 🎯 Common Root Directory Values

| Repository Structure | Root Directory Setting |
|---------------------|------------------------|
| `FamBudget/backend/` | `backend` (recommended) |
| `FamBudget/backend/` | (leave empty if backend is at root) |
| Backend at repo root | (leave empty) |

## ⚠️ Important Notes

1. **No leading slash**: Use `backend`, not `/backend`
2. **Case sensitive**: Use `backend`, not `Backend` or `BACKEND`
3. **No trailing slash**: Use `backend`, not `backend/`
4. **Relative path**: The path should be relative to your repository root

## ✅ After Fixing

Once you save the correct Root Directory:
- Railway will automatically trigger a new deployment
- The build should start successfully
- You'll see "Build" step running instead of failing at "Initialization"

## 🔍 Still Not Working?

1. **Verify GitHub sync**: Make sure your latest code is pushed to GitHub
2. **Check branch**: Railway might be deploying from a different branch
3. **Repository structure**: Ensure `backend/` folder exists in your GitHub repo
4. **Check settings**: Go to Settings → Source → Verify the repository and branch

---

**Need more help?** Check Railway logs for more specific error messages!

