# 📤 Upload FamBudget Installers to Cloudflare R2

## Quick Setup Guide

### Step 1: Install Wrangler CLI

```powershell
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```powershell
wrangler login
```

This will open your browser to authenticate.

### Step 3: Create R2 Bucket

```powershell
wrangler r2 bucket create fambudget-releases
```

Or create via dashboard: https://dash.cloudflare.com/ → R2 → Create bucket

### Step 4: Upload Installer Files

```powershell
cd "C:\Users\lalup\OneDrive\Desktop\Project Cipher\FamBudget"

# Upload EXE installer
wrangler r2 object put fambudget-releases/FamBudget-3.5.1-x64.exe `
  --file=desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.exe `
  --content-type=application/octet-stream

# Upload MSI installer
wrangler r2 object put fambudget-releases/FamBudget-3.5.1-x64.msi `
  --file=desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.msi `
  --content-type=application/octet-stream
```

### Step 5: Enable Public Access (Optional)

To make files publicly downloadable:

1. Go to: https://dash.cloudflare.com/ → R2 → fambudget-releases
2. Go to Settings → Public Access
3. Enable public access
4. Configure CORS if needed

### Step 6: Get Download URLs

After upload, you'll get URLs like:
- `https://pub-[id].r2.dev/FamBudget-3.5.1-x64.exe`
- `https://pub-[id].r2.dev/FamBudget-3.5.1-x64.msi`

Or use custom domain if configured.

## Alternative: Using S3-Compatible API

If you prefer using S3-compatible tools:

1. **Get R2 API credentials:**
   - Cloudflare Dashboard → R2 → Manage R2 API Tokens
   - Create API token

2. **Use AWS CLI or PowerShell with S3 endpoint:**
   ```powershell
   # Configure AWS CLI for R2
   aws configure set endpoint-url https://[account-id].r2.cloudflarestorage.com
   
   # Upload
   aws s3 cp desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.exe s3://fambudget-releases/
   aws s3 cp desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.msi s3://fambudget-releases/
   ```

## Benefits of Cloudflare R2

✅ **Free egress** - No bandwidth charges for downloads  
✅ **Fast CDN** - Global content delivery  
✅ **S3-compatible** - Works with standard tools  
✅ **Secure** - Built-in security features  
✅ **Reliable** - Enterprise-grade storage

## Next Steps

After uploading:
1. Add download links to GitHub README
2. Update GitHub Release with Cloudflare URLs
3. Share download links with users

