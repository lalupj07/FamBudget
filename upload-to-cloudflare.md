# Upload Installer Files to Cloudflare R2

## Option 1: Using Cloudflare R2 (Recommended for File Hosting)

Cloudflare R2 is object storage (similar to AWS S3) that's perfect for hosting installer files.

### Setup Steps:

1. **Create Cloudflare Account** (if you don't have one)
   - Go to: https://dash.cloudflare.com/sign-up

2. **Create R2 Bucket:**
   - Go to: https://dash.cloudflare.com/ (Dashboard)
   - Navigate to: R2 → Create bucket
   - Bucket name: `fambudget-releases` (or your preferred name)
   - Location: Choose closest to you

3. **Get API Credentials:**
   - Go to: https://dash.cloudflare.com/profile/api-tokens
   - Create API token with R2 permissions
   - Or use Global API Key

4. **Install Wrangler CLI** (Cloudflare's CLI tool):
   ```powershell
   npm install -g wrangler
   ```

5. **Authenticate:**
   ```powershell
   wrangler login
   ```

6. **Upload Files:**
   ```powershell
   wrangler r2 object put fambudget-releases/FamBudget-3.5.1-x64.exe --file=desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.exe
   wrangler r2 object put fambudget-releases/FamBudget-3.5.1-x64.msi --file=desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.msi
   ```

## Option 2: Using Cloudflare API (PowerShell)

You can upload directly using PowerShell with the Cloudflare API.

### Requirements:
- Cloudflare Account ID
- R2 API Token
- R2 Bucket Name

