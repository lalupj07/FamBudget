# Microsoft Store Push Guide - FamBudget

## 🎯 Quick Start

You're ready to push FamBudget to the Microsoft Store! Follow these steps:

## ✅ Step 1: Prepare Assets

Run the asset creation script to generate required logos:

```powershell
cd desktop-app
.\create-store-assets.ps1
```

This will create:
- `StoreLogo.png` (50x50px)
- `Square44x44Logo.png` (44x44px)
- `Square150x150Logo.png` (150x150px)
- `Wide310x150Logo.png` (310x150px)

**Note:** If ImageMagick is not installed, install it first:
```powershell
winget install ImageMagick.ImageMagick
```

## ✅ Step 2: Run Submission Script

The automated script will handle everything:

```powershell
cd desktop-app
.\submit-to-store.ps1
```

This script will:
1. ✅ Verify Partner Center setup
2. ✅ Get your publisher name from Partner Center
3. ✅ Update `package.json` with correct publisher
4. ✅ Verify required assets
5. ✅ Build MSIX package
6. ✅ Provide submission instructions

## ✅ Step 3: Submit to Store

After the build completes:

1. **Go to Partner Center:** https://partner.microsoft.com/dashboard
2. **Navigate to your app:** Apps and games → FamBudget
3. **Create new submission** (or update existing)
4. **Upload the `.appx` file** from `dist-v3.5.1/`
5. **Complete all sections:**
   - Pricing and Availability
   - Properties
   - Age Ratings
   - Packages (upload .appx file)
   - Store Listings (screenshots, description, privacy policy)
6. **Submit for certification**

## 📋 Pre-Flight Checklist

Before running the script, ensure:

- [ ] **Partner Center Account:** Created and verified
- [ ] **App Reserved:** "FamBudget" name reserved in Partner Center
- [ ] **Publisher Name:** Know your exact publisher name from Partner Center
- [ ] **Privacy Policy:** Have a publicly accessible privacy policy URL
- [ ] **Screenshots:** At least 1 screenshot (1366x768px minimum)

## 🚨 Important Notes

### Publisher Name
- **MUST match exactly** what's in Partner Center
- Even small differences will cause certification failure
- Format: `CN=YourCompany, O=YourCompany Inc, C=US`

### Privacy Policy
- **REQUIRED** for store submission
- Must be publicly accessible
- Should describe data collection and usage

### Screenshots
- At least 1 required (1366x768px)
- More screenshots recommended (up to 10)
- Optional: 1920x1080px for additional screenshots

## 📦 Build Output

After successful build, your package will be at:
```
desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.appx
```

## ⏱️ Timeline

- **Build Time:** 5-15 minutes
- **Submission Time:** 15-30 minutes
- **Certification Time:** 1-3 business days

## 📚 Reference Documents

- **QUICK-STORE-SUBMIT.md** - Quick reference
- **STORE-SUBMISSION-CHECKLIST.md** - Complete checklist
- **MICROSOFT-STORE-SUBMISSION.md** - Detailed guide
- **get-publisher-name.md** - How to get publisher name

## 🆘 Troubleshooting

### Build Fails
- Check `package.json` has correct publisher
- Verify all assets exist in `assets/` folder
- Ensure Node.js and npm are installed

### Publisher Mismatch
- Get exact publisher name from Partner Center
- Update `package.json` → `build.appx.publisher`
- Rebuild the package

### Missing Assets
- Run `create-store-assets.ps1` to generate assets
- Or manually resize `icon.png` to required sizes

### Certification Fails
- Check Partner Center for feedback
- Address any blocking issues
- Update package and resubmit

## 🎉 Success!

Once certified and published, your app will be available in the Microsoft Store!

---

**Ready to start?** Run: `.\submit-to-store.ps1`

