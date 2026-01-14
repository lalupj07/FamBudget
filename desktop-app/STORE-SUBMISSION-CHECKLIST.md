# Microsoft Store Submission Checklist for FamBudget

## ✅ Pre-Build Checklist

### 1. Partner Center Account
- [ ] Microsoft Partner Center account created
- [ ] Account verification completed
- [ ] Developer account approved
- [ ] App name "FamBudget" reserved in Partner Center

### 2. Publisher Information
- [ ] Publisher name retrieved from Partner Center
- [ ] Publisher name matches exactly (including spaces and capitalization)
- [ ] Publisher name updated in `package.json` → `build.appx.publisher`

### 3. Application Assets
- [ ] **Store Logo** (50x50px PNG) - `assets/StoreLogo.png`
- [ ] **Square 150x150 Logo** (150x150px PNG) - `assets/Square150x150Logo.png`
- [ ] **Square 44x44 Logo** (44x44px PNG) - `assets/Square44x44Logo.png`
- [ ] **Wide 310x150 Logo** (310x150px PNG) - `assets/Wide310x150Logo.png`
- [ ] **App Icon** (256x256px or larger) - `assets/icon.png`

### 4. Store Listing Assets
- [ ] **Primary Screenshot** (1366x768px minimum, 1-10 required)
- [ ] **Additional Screenshots** (1920x1080px, optional)
- [ ] **App Description** (Short: 200 chars max, Full: 10,000 chars max)
- [ ] **Keywords** (comma-separated)
- [ ] **Privacy Policy URL** (REQUIRED)
- [ ] **Support URL** (optional but recommended)

### 5. Package Configuration
- [ ] Version number set correctly in `package.json`
- [ ] App ID/Name configured: `FamBudget.Desktop`
- [ ] Display name set: `FamBudget`
- [ ] Certificate configured (self-signed for testing, production cert for store)

## 🔨 Build Process

### Run the Submission Script
```powershell
cd desktop-app
.\submit-to-store.ps1
```

Or manually:
```powershell
cd desktop-app
npm run build-msix
```

### Verify Build Output
- [ ] `.appx` file created in `dist-v3.5.1/`
- [ ] Package size is reasonable (typically 100-500MB)
- [ ] Package version matches `package.json` version

## 📤 Store Submission Steps

### Step 1: Access Partner Center
1. [ ] Go to https://partner.microsoft.com/dashboard
2. [ ] Navigate to **Apps and games**
3. [ ] Find **FamBudget** app (or create new if first submission)

### Step 2: Create New Submission
1. [ ] Click **Create new submission** (or **Update** if updating existing)
2. [ ] Select **MSIX** package type

### Step 3: Pricing and Availability
- [ ] Set price (Free or Paid)
- [ ] Choose markets/regions
- [ ] Set availability dates
- [ ] Configure visibility options

### Step 4: Properties
- [ ] **Category:** Productivity / Finance
- [ ] **System Requirements:**
  - [ ] OS: Windows 10 (Version 1809) or higher
  - [ ] Architecture: x64
  - [ ] Memory: 4 GB RAM minimum (optional)
  - [ ] Display: 1024x768 minimum (optional)

### Step 5: Age Ratings
- [ ] Complete IARC questionnaire
- [ ] Choose appropriate age rating (usually 13+ for finance apps)

### Step 6: Packages
- [ ] Upload `.appx` file from `dist-v3.5.1/`
- [ ] Verify version number matches
- [ ] Define supported OS versions
- [ ] Check for dependencies

### Step 7: Store Listings
For each language (at least English):

- [ ] **App Name:** FamBudget
- [ ] **Publisher:** [Your Publisher Name]
- [ ] **Short Description:** (200 characters max)
- [ ] **Full Description:** (10,000 characters max)
- [ ] **Screenshots:** At least 1 (1366x768px)
  - [ ] Primary screenshot uploaded
  - [ ] Additional screenshots (optional)
- [ ] **Store Logos:** All required sizes uploaded
- [ ] **Keywords:** Budget, Family, Finance, Expenses, Tracking
- [ ] **Support URL:** [Your support website/email]
- [ ] **Privacy Policy URL:** [REQUIRED - Must be accessible]

### Step 8: Review and Submit
- [ ] Review all sections
- [ ] Check for any errors or warnings
- [ ] Click **Submit for certification**
- [ ] Note submission ID for tracking

## 📋 Required Information Template

### Short Description (200 chars max)
```
Advanced family budgeting app with income tracking, multi-currency support, and detailed analytics. Manage your household finances with ease.
```

### Full Description (10,000 chars max)
```
FamBudget - Advanced Family Budget Management

Take control of your family's finances with FamBudget, a comprehensive budgeting application designed for households. Whether you're tracking daily expenses or planning long-term financial goals, FamBudget provides all the tools you need.

Key Features:
• Income Tracking: Record and manage multiple income sources with recurring income support
• Multi-Currency Support: Work with different currencies and track conversions
• Expense Management: Categorize expenses with customizable envelopes
• Budget Planning: Visual budget planner with interactive sliders
• Analytics & Reports: Detailed charts and monthly reports
• Goal Tracking: Set and monitor savings goals
• Transaction History: Complete transaction timeline with filters
• Multi-User Support: Manage household budgets with multiple family members

Perfect for families looking to:
- Track household income and expenses
- Plan monthly budgets
- Monitor spending habits
- Achieve savings goals
- Understand financial patterns through analytics

FamBudget makes financial management simple, intuitive, and accessible for everyone in your household.
```

### Keywords
```
Budget, Family, Finance, Expenses, Tracking, Income, Currency, Analytics, Household, Money Management
```

### System Requirements
- **OS:** Windows 10 version 1809 (October 2018 Update) or later
- **Architecture:** x64
- **Memory:** 4 GB RAM recommended
- **Display:** 1024x768 minimum resolution

### Age Rating
- **IARC Rating:** E (Everyone) or 13+
- **Justification:** Financial/budgeting application with no mature content

## 🔍 Post-Submission

### Certification Process
- [ ] Submission received (usually within minutes)
- [ ] Certification in progress (1-3 business days)
- [ ] Monitor for certification status updates
- [ ] Address any certification failures if they occur

### Common Issues
- **Publisher Mismatch:** Package publisher doesn't match Partner Center
  - **Solution:** Update `package.json` and rebuild
- **Missing Assets:** Required logos or screenshots missing
  - **Solution:** Upload all required assets in Store Listings
- **Manifest Validation:** AppxManifest.xml validation errors
  - **Solution:** Check manifest requirements, rebuild package
- **Privacy Policy:** Missing or inaccessible privacy policy URL
  - **Solution:** Ensure privacy policy is publicly accessible

## 📊 Tracking Submission

### Monitor Status
1. Go to Partner Center → Apps and games → FamBudget
2. Click on current submission
3. Check certification status
4. Review any feedback or errors

### Expected Timeline
- **Submission:** Immediate
- **Initial Review:** 1-2 hours
- **Certification:** 1-3 business days
- **Publication:** Usually same day as certification approval

## ✅ Success Criteria

Your app will be published when:
- [ ] All sections completed (green checkmarks)
- [ ] Package uploaded successfully
- [ ] Certification passed
- [ ] No blocking issues
- [ ] Store listing approved

## 📞 Support Resources

- **Partner Center:** https://partner.microsoft.com/dashboard
- **Documentation:** https://learn.microsoft.com/en-us/windows/apps/publish/
- **Community:** https://learn.microsoft.com/en-us/windows/apps/community
- **Support:** https://support.microsoft.com/en-us/account-billing

---

**Last Updated:** Current Date  
**App Version:** 3.5.1  
**Package Format:** MSIX (.appx)

