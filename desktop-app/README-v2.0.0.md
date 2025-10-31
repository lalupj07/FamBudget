# FamBudget Desktop v2.0.0

## 🎉 **MAJOR UPDATE - Advanced Family Budgeting**

FamBudget v2.0.0 brings powerful new features for comprehensive family financial management.

## ✨ **New Features in v2.0.0**

### 💰 **Income Tracker**
- **Multiple Income Sources**: Track income from different family members
- **Recurring vs One-Time**: Distinguish between salaries, bonuses, freelance work
- **Frequency Tracking**: Weekly, monthly, quarterly, yearly income patterns
- **Expected vs Actual**: Compare planned vs received income

### 🌍 **Multi-Currency Support**
- **10+ Currencies**: USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, BRL
- **Smart Formatting**: Proper symbol positioning and decimal places
- **Real-time Conversion**: All amounts update instantly when currency changes
- **Persistent Settings**: Your currency choice is remembered

### 🎨 **Enhanced User Experience**
- **Premium Dark Mode**: Beautiful dark theme across all screens
- **Improved Navigation**: New Income tab with dedicated tracking
- **Better Visual Design**: Color-coded income sources and categories
- **Responsive Layout**: Optimized for different screen sizes

## 🚀 **Installation Options**

### **Windows Installer (EXE)**
- `FamBudget-2.0.0-x64.exe` - NSIS Installer
- Full installation with desktop shortcuts
- Start menu integration
- Easy uninstallation

### **MSI Package**
- `FamBudget-2.0.0-x64.msi` - Microsoft Installer
- Enterprise deployment ready
- Windows Store compatible
- Silent installation support

### **Portable Version**
- `FamBudget-2.0.0-x64.exe` - Portable executable
- No installation required
- Run from USB drive
- Perfect for multiple computers

## 📋 **System Requirements**

- **OS**: Windows 10/11 (64-bit)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 200MB free space
- **Display**: 1024x768 minimum resolution

## 🎯 **How to Use**

### **Getting Started**
1. Download your preferred version
2. Run the installer or portable executable
3. Select your currency from the dropdown
4. Start tracking your family finances!

### **Income Tracking**
1. Go to the **Income** tab
2. Click **Add Source** to create income sources
3. Click **Add Income** to record income entries
4. Track recurring vs one-time income

### **Multi-Currency**
1. Click the currency dropdown in the header
2. Select your preferred currency
3. All amounts update automatically
4. Your choice is saved for next time

## 🔧 **Build Instructions**

To build FamBudget v2.0.0 yourself:

```bash
# Install dependencies
npm install

# Build all Windows packages
npm run build-win

# Or build specific packages
npm run build-exe    # NSIS Installer
npm run build-msi    # MSI Package
npm run build-portable # Portable Version
```

## 📁 **File Structure**

```
dist-v2.0.0/
├── FamBudget-2.0.0-x64.exe      # NSIS Installer
├── FamBudget-2.0.0-x64.msi      # MSI Package
├── FamBudget-2.0.0-x64.exe      # Portable Version
└── win-unpacked/                 # Unpacked files
```

## 🆕 **What's New**

### **v2.0.0 Features**
- ✅ Income Tracker with Multiple Sources
- ✅ Multi-Currency Support (10+ currencies)
- ✅ Recurring vs One-Time Income Classification
- ✅ Enhanced Visual Design
- ✅ Premium Dark Mode
- ✅ Improved User Interface
- ✅ Better Data Management
- ✅ Enhanced Export Options

### **Previous Features (v1.0.0)**
- ✅ Transaction Management
- ✅ Account Tracking
- ✅ Savings Goals
- ✅ Basic Reports
- ✅ Dark/Light Theme
- ✅ Data Import/Export

## 🐛 **Known Issues**

- Currency conversion rates are static (display formatting only)
- Some advanced analytics features are placeholders
- Export functionality needs backend integration

## 📞 **Support**

For issues or feature requests:
- Check the documentation
- Report bugs via GitHub issues
- Contact the FamBudget team

## 📄 **License**

MIT License - See LICENSE file for details.

---

**FamBudget v2.0.0** - *Advanced Family Budgeting Made Simple*
