# 📤 Upload Large Files to Cloudflare R2

## ⚠️ File Size Limitation

**Wrangler CLI has a 300MB file size limit**, but our installer files are:
- `FamBudget-3.5.1-x64.exe` = **885 MB**
- `FamBudget-3.5.1-x64.msi` = **941 MB**

## ✅ Solution: Upload via Cloudflare Dashboard

The easiest way to upload large files is through the Cloudflare Dashboard.

### Step-by-Step Instructions:

1. **Go to Cloudflare Dashboard:**
   https://dash.cloudflare.com/

2. **Navigate to R2:**
   - Click "R2" in the left sidebar
   - Click on "fambudget-releases" bucket (already created)

3. **Upload Files:**
   - Click "Upload" button
   - Select both installer files:
     - `desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.exe` (885 MB)
     - `desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.msi` (941 MB)
   - Wait for upload to complete (may take a few minutes)

4. **Enable Public Access:**
   - Go to bucket Settings → Public Access
   - Enable public access
   - Copy the public URL

5. **Get Download URLs:**
   - Each file will have a public URL like:
     - `https://pub-[id].r2.dev/FamBudget-3.5.1-x64.exe`
     - `https://pub-[id].r2.dev/FamBudget-3.5.1-x64.msi`

## Alternative: Use AWS CLI with R2

If you have AWS CLI installed, you can configure it for R2:

```powershell
# Install AWS CLI if not installed
# Download from: https://awscli.amazonaws.com/AWSCLIV2.msi

# Configure for R2
aws configure set s3.endpoint_url https://[account-id].r2.cloudflarestorage.com

# Upload files
aws s3 cp desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.exe s3://fambudget-releases/
aws s3 cp desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.msi s3://fambudget-releases/
```

## ✅ Current Status

- ✅ Cloudflare account logged in
- ✅ R2 bucket "fambudget-releases" created
- ⏳ Need to upload files via dashboard (file size > 300MB)

## 📍 File Locations

Your installer files are ready at:
- `C:\Users\lalup\OneDrive\Desktop\Project Cipher\FamBudget\desktop-app\dist-v3.5.1\FamBudget-3.5.1-x64.exe`
- `C:\Users\lalup\OneDrive\Desktop\Project Cipher\FamBudget\desktop-app\dist-v3.5.1\FamBudget-3.5.1-x64.msi`

## 🚀 After Upload

Once uploaded, you'll get public URLs that you can:
1. Add to GitHub README
2. Share in GitHub Release notes
3. Use for direct downloads

