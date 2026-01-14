# Quick R2 Upload Guide

## Option 1: Get R2 Credentials (Recommended)

1. **Go to Cloudflare Dashboard:**
   - Open: https://dash.cloudflare.com/
   - Make sure you're logged in

2. **Create R2 API Token:**
   - Navigate to: **Manage Account** (top right) → **R2** → **Manage R2 API Tokens**
   - Click **Create API Token**
   - Name it: `FamBudget-Upload`
   - Select permissions: **Object Read & Write**
   - Click **Create API Token**
   - **IMPORTANT**: Copy both:
     - **Access Key ID**
     - **Secret Access Key** (only shown once!)

3. **Run the upload script with credentials:**
   ```powershell
   $env:R2_ACCESS_KEY_ID='your-access-key-id'
   $env:R2_SECRET_ACCESS_KEY='your-secret-key'
   python upload-to-r2.py
   ```

## Option 2: Upload via Dashboard (Easiest)

1. **Go to R2 Bucket:**
   - Dashboard: https://dash.cloudflare.com/
   - Navigate to: **R2** → **fambudget-releases**

2. **Upload Files:**
   - Click **Upload** button
   - Select files from:
     - `desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.exe` (885 MB)
     - `desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.msi` (941 MB)
   - Wait for upload to complete

3. **Enable Public Access:**
   - Go to bucket **Settings** → **Public Access**
   - Enable public access
   - Copy the public URLs

## Option 3: Install rclone (Best for Large Files)

```powershell
# Download rclone from: https://rclone.org/downloads/
# Install it, then:

rclone config
# Name: cf-r2
# Type: s3
# Provider: Cloudflare
# Access Key: (your R2 access key)
# Secret Key: (your R2 secret key)
# Endpoint: https://647f9fc61c9ebc9d3727647373806a51.r2.cloudflarestorage.com

# Then upload:
rclone copy "desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.exe" cf-r2:fambudget-releases/
rclone copy "desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.msi" cf-r2:fambudget-releases/
```

