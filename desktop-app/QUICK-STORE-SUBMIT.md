# Quick Guide: Push to Microsoft Store

## 🚀 Fast Track Submission

### Option 1: Automated Script (Recommended)
```powershell
cd desktop-app
.\submit-to-store.ps1
```

The script will:
1. ✅ Verify Partner Center setup
2. ✅ Get your publisher name
3. ✅ Update package.json
4. ✅ Build MSIX package
5. ✅ Provide submission instructions

### Option 2: Manual Process

#### Step 1: Get Publisher Name
1. Go to: https://partner.microsoft.com/dashboard
2. Account Settings → Developer Account → Publisher Identity
3. Copy the exact publisher name (e.g., `CN=YourCompany, O=YourCompany Inc, C=US`)

#### Step 2: Update Configuration
```powershell
cd desktop-app
# Edit package.json → build.appx.publisher
# Set it to your exact Partner Center publisher name
```

#### Step 3: Build Package
```powershell
npm run build-msix
```

#### Step 4: Submit to Store
1. Go to: https://partner.microsoft.com/dashboard
2. Find your app (FamBudget) or create new submission
3. Upload the `.appx` file from `dist-v3.5.1/`
4. Complete all required sections
5. Submit for certification

## ⚠️ Critical Requirements

### Before Building:
- [ ] Partner Center account created and verified
- [ ] App name "FamBudget" reserved
- [ ] Publisher name matches Partner Center exactly
- [ ] All required assets present (see checklist)

### Required Assets:
- [ ] `assets/StoreLogo.png` (50x50px)
- [ ] `assets/Square150x150Logo.png` (150x150px)
- [ ] `assets/Square44x44Logo.png` (44x44px)
- [ ] `assets/Wide310x150Logo.png` (310x150px)

### For Store Submission:
- [ ] Privacy Policy URL (REQUIRED)
- [ ] Screenshots (at least 1, 1366x768px)
- [ ] App description (short + full)
- [ ] Support URL (recommended)

## 📦 Package Location

After building, your package will be at:
```
desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.appx
```

## 🎯 Submission Checklist

See **STORE-SUBMISSION-CHECKLIST.md** for complete checklist.

## 📚 Detailed Guides

- **MICROSOFT-STORE-SUBMISSION.md** - Complete submission guide
- **STORE-SUBMISSION-CHECKLIST.md** - Detailed checklist
- **MSIX-SETUP.md** - MSIX package setup
- **get-publisher-name.md** - How to get publisher name

## ⚡ Quick Commands

```powershell
# Build MSIX package
npm run build-msix

# Run automated submission script
.\submit-to-store.ps1

# Open dist folder
explorer.exe dist-v3.5.1
```

## 🆘 Need Help?

1. Check **MICROSOFT-STORE-SUBMISSION.md** for detailed instructions
2. Verify publisher name matches exactly
3. Ensure all assets are present
4. Check Partner Center for submission status

---

**Estimated Time:** 15-30 minutes for submission setup  
**Certification Time:** 1-3 business days

