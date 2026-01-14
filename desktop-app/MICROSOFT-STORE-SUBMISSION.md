# Microsoft Store Submission Guide for FamBudget

## 📋 Prerequisites

1. **Microsoft Partner Center Account**
   - Sign up at: https://partner.microsoft.com/dashboard
   - Registration is **FREE** (as of 2024)
   - Choose "Windows and Xbox" program
   - Complete account verification

2. **App Requirements**
   - Valid MSIX/APPX package
   - Store assets (logos, screenshots, descriptions)
   - Privacy policy URL
   - App description and metadata

## 🚀 Step-by-Step Submission Process

### Step 1: Reserve App Name

1. Go to [Partner Center](https://partner.microsoft.com/dashboard)
2. Navigate to: **Apps and games** → **New product** → **MSIX**
3. Enter app name: **FamBudget** (or your preferred name)
4. Check availability and reserve

### Step 2: Prepare MSIX Package

1. **Build the package:**
   ```powershell
   cd desktop-app
   npm run build-msix
   ```

2. **Package location:**
   - Output: `dist-v3.5.1/FamBudget-3.5.1-x64.appx`

3. **Note:** The publisher in the package must match your Partner Center publisher name

### Step 3: Create Store Submission

In Partner Center, start a new submission:

#### 3.1 Pricing and Availability
- Set price (Free or Paid)
- Choose markets/regions
- Set availability dates

#### 3.2 Properties
- **Category:** Productivity / Finance
- **System Requirements:**
  - OS: Windows 10 (Version 1809) or higher
  - Architecture: x64
  - Memory: 4 GB RAM minimum
  - Display: 1024x768 minimum

#### 3.3 Age Ratings
- Complete IARC questionnaire
- Choose appropriate age rating (usually 13+)

#### 3.4 Packages
- Upload the `.appx` file
- Set version number (must match package.json)
- Define supported OS versions

#### 3.5 Store Listings
- **App Name:** FamBudget
- **Publisher:** [Your Publisher Name from Partner Center]
- **Short Description:** (up to 200 characters)
- **Full Description:** (detailed description, up to 10,000 characters)
- **Screenshots:** Required sizes:
  - 1366x768 (required)
  - 1920x1080 (optional)
  - Store logo: 50x50, 200x200
- **Keywords:** Budget, Family, Finance, Expenses, Tracking
- **Support URL:** [Your support website]
- **Privacy Policy URL:** [Required - Your privacy policy]

### Step 4: Submit for Certification

1. Review all sections
2. Click **Submit for certification**
3. Wait for review (usually 1-3 business days)

## 📦 Package Configuration

The `package.json` must have correct APPX configuration:

```json
{
  "build": {
    "appx": {
      "identityName": "FamBudget.Desktop",
      "publisher": "CN=YourPartnerCenterPublisherName",
      "publisherDisplayName": "Your Publisher Display Name",
      "displayName": "FamBudget",
      "backgroundColor": "#1976d2",
      "applicationId": "FamBudget",
      "showNameOnTiles": true
    }
  }
}
```

**IMPORTANT:** The `publisher` field must exactly match your Partner Center publisher identity.

## 🎨 Required Store Assets

### Screenshots (Required)
- **Primary Screenshot:** 1366x768 pixels
- **Additional Screenshots:** 1920x1080 pixels (optional)
- Minimum: 1 screenshot
- Maximum: 10 screenshots

### Logos
- **Store Logo:** 50x50 pixels (PNG)
- **Square 70x70 Logo:** 70x70 pixels (PNG)
- **Square 150x150 Logo:** 150x150 pixels (PNG)
- **Square 310x310 Logo:** 310x310 pixels (PNG)
- **Wide 310x150 Logo:** 310x150 pixels (PNG)

### Promotional Images (Optional)
- **Promotional Tile 414x180:** For featured apps
- **Hero Image:** 1920x1080 pixels

## 📝 App Description Template

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

## 🔐 Privacy Policy Requirements

**REQUIRED:** You must provide a Privacy Policy URL.

The privacy policy must include:
- What data is collected
- How data is used
- Data sharing policies
- User rights

Example privacy policy locations:
- GitHub Pages
- Your website
- Privacy policy generator

## ✅ Pre-Submission Checklist

- [ ] Partner Center account created and verified
- [ ] App name reserved
- [ ] MSIX package built successfully
- [ ] Publisher name matches Partner Center
- [ ] All required screenshots prepared (1366x768 minimum)
- [ ] Store logos created (50x50, 70x70, 150x150, 310x310, 310x150)
- [ ] App description written (short + full)
- [ ] Privacy policy URL ready
- [ ] Support URL ready (optional but recommended)
- [ ] Keywords defined
- [ ] Age rating completed
- [ ] Package tested and working

## 🐛 Common Issues

### Issue: Publisher Mismatch
**Error:** "The publisher name in the package does not match the Partner Center publisher."

**Solution:**
1. Get your exact publisher name from Partner Center → Account Settings
2. Update `package.json` → `build.appx.publisher` to match exactly
3. Rebuild the package

### Issue: Manifest Validation Error
**Error:** "0x80080204 - The package manifest is not valid."

**Solution:**
- Ensure all required assets exist
- Check that `identityName` and `publisher` are correct
- Verify the package was built with correct electron-builder version

### Issue: Missing Assets
**Error:** "Required assets are missing."

**Solution:**
- Create all required logo sizes
- Place them in the `assets/` folder
- Rebuild the package

## 📚 Resources

- [Microsoft Store Developer Documentation](https://learn.microsoft.com/en-us/windows/apps/publish/)
- [Partner Center](https://partner.microsoft.com/dashboard)
- [MSIX Packaging Guide](https://learn.microsoft.com/en-us/windows/msix/)
- [Electron Builder AppX Docs](https://www.electron.build/configuration/appx)

## 🎯 Next Steps

1. **Create Partner Center Account** (if not done)
2. **Reserve App Name:** FamBudget
3. **Build MSIX Package** with correct publisher
4. **Prepare Assets** (screenshots, logos, descriptions)
5. **Create Privacy Policy**
6. **Submit to Store**

---

**Estimated Timeline:** 1-3 business days for certification review

