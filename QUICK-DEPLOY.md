# Quick Deploy to GitHub Pages

## Before You Start

1. **Update homepage URL** in root `package.json`:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/FamBudget"
   ```
   Replace `YOUR_USERNAME` with your GitHub username.

2. **Make sure your GitHub repository is set up:**
   - Create a repository on GitHub (if you haven't already)
   - Make sure your local repo is connected:
     ```bash
     git remote -v
     ```
   - If not connected, add remote:
     ```bash
     git remote add origin https://github.com/YOUR_USERNAME/FamBudget.git
     ```

## Deploy

From the **root directory** of your project:

```bash
npm run deploy
```

Or from the desktop-app directory:

```bash
cd desktop-app
npm run deploy
```

## First Time Setup

If this is your first time deploying:

1. **Enable GitHub Pages:**
   - Go to your GitHub repository
   - Click **Settings** → **Pages**
   - Under **Source**, select:
     - **Branch**: `gh-pages`
     - **Folder**: `/ (root)`
   - Click **Save**

2. **Install dependencies** (if not already done):
   ```bash
   cd desktop-app
   npm install
   ```

## What Happens

1. `build-web.js` runs:
   - Copies HTML, CSS, JS, and assets to `web-build/`
   - Removes Electron-specific code
   - Uses CDN for Chart.js (no Electron resources needed)
   - Creates `.nojekyll` file

2. `gh-pages` deploys:
   - Pushes `web-build/` contents to `gh-pages` branch
   - Your app is available at: `https://YOUR_USERNAME.github.io/FamBudget`

## Verify Deployment

After deploying, wait 1-2 minutes, then visit:
```
https://YOUR_USERNAME.github.io/FamBudget
```

## Troubleshooting

### Error: Repository not found
- Make sure the repository exists on GitHub
- Check your GitHub username/repo name matches
- Verify you have push access

### Error: Authentication required
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 404 Error
- Wait 2-3 minutes for GitHub Pages to update
- Check the homepage URL in `package.json` is correct
- Verify GitHub Pages is enabled in repository settings

## Updating Deployment

Just run `npm run deploy` again after making changes. The script will rebuild and redeploy automatically.

