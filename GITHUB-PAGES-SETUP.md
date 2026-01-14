# GitHub Pages Deployment Setup

## Quick Setup Guide

### 1. Update Homepage URL

Edit `package.json` in the root directory and replace `YOUR_USERNAME` with your GitHub username:

```json
"homepage": "https://YOUR_USERNAME.github.io/FamBudget"
```

### 2. Install Dependencies

```bash
cd desktop-app
npm install
```

This will install `gh-pages` package which is needed for deployment.

### 3. Configure GitHub Repository

1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
4. Click **Save**

### 4. Deploy

From the root directory:

```bash
npm run deploy
```

Or from the desktop-app directory:

```bash
cd desktop-app
npm run deploy
```

This will:
1. Build the web version (removes Electron-specific code)
2. Deploy to the `gh-pages` branch
3. Make your app available at: `https://YOUR_USERNAME.github.io/FamBudget`

## What Gets Deployed

The `build-web.js` script:
- Copies HTML, CSS, JS, and assets to `web-build/`
- Removes Electron-specific API calls
- Uses CDN for Chart.js (no Electron resources needed)
- Creates `.nojekyll` file to prevent Jekyll processing

## Features That Work in Web Version

✅ All core budgeting features
✅ Dashboard with charts
✅ Transactions management
✅ Accounts, Goals, Income tracking
✅ Theme switching
✅ Currency selection
✅ LocalStorage persistence

## Features Not Available in Web Version

❌ File import/export (uses Electron APIs)
❌ Native file dialogs (uses browser file inputs instead)

## Troubleshooting

### Deployment Fails

1. Make sure you're logged into GitHub:
   ```bash
   git config user.name "Your Name"
   git config user.email "your.email@example.com"
   ```

2. Make sure the repository exists on GitHub:
   ```bash
   git remote -v
   ```

3. Try deploying with verbose output:
   ```bash
   DEBUG=* npm run deploy
   ```

### 404 Error After Deployment

1. Check the homepage URL in `package.json` matches your repo name
2. Wait a few minutes - GitHub Pages can take time to update
3. Clear your browser cache

### Assets Not Loading

Make sure all paths in `index.html` are relative (not absolute). They should start with `./` or just the filename.

## Updating Deployment

Just run `npm run deploy` again after making changes. The script will rebuild and redeploy automatically.

