# 💰 FamBudget - Advanced Family Budget Management

<div align="center">

![FamBudget Logo](desktop-app/assets/icon.png)

**Take control of your family's finances with FamBudget**

[![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)](https://github.com/lalupj07/FamBudget/releases)
[![License](https://img.shields.io/badge/license-Apache--2.0-green.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows-lightgrey.svg)](https://www.microsoft.com/store)
[![Privacy](https://img.shields.io/badge/privacy-Local%20Storage%20Only-success.svg)](desktop-app/PRIVACY-POLICY.md)

[Download](https://github.com/lalupj07/FamBudget/releases) • [Documentation](#features) • [Report Bug](https://github.com/lalupj07/FamBudget/issues) • [Request Feature](https://github.com/lalupj07/FamBudget/issues)

</div>

---

## 🌟 Overview

**FamBudget** is a comprehensive desktop application designed to help families manage their finances effectively. Built with Electron and modern web technologies, FamBudget offers an intuitive interface for tracking income, expenses, budgets, and financial goals—all while keeping your data completely private and secure on your local device.

### ✨ Key Highlights

- 🔒 **100% Local Storage** - Your financial data never leaves your device
- 💰 **Multi-Currency Support** - Work with USD, EUR, GBP, INR, and more
- 📊 **Advanced Analytics** - Beautiful charts and detailed reports
- 🎯 **Goal Tracking** - Set and achieve your savings goals
- 🌙 **Dark Mode** - Comfortable viewing in any lighting
- 🚀 **Offline First** - Works completely offline, no internet required

---

## 🎯 Features

### 💵 Income & Expense Management
- **Multiple Income Sources** - Track income from various sources
- **Recurring Income** - Set up automatic recurring income entries
- **Transaction Categorization** - Organize expenses by custom categories
- **Transaction History** - Complete timeline with advanced filtering
- **Multi-Account Support** - Manage multiple bank accounts

### 📊 Budgeting & Analytics
- **Visual Budget Planner** - Interactive budget planning with sliders
- **Spending Analysis** - Detailed charts showing spending patterns
- **Category Breakdown** - See where your money goes
- **Monthly Reports** - Comprehensive financial reports
- **Trend Analysis** - Track financial trends over time

### 🎯 Goal Management
- **Savings Goals** - Set and track multiple savings goals
- **Progress Tracking** - Visual progress indicators
- **Deadline Management** - Set deadlines and monitor progress
- **Priority Levels** - Organize goals by priority

### 💱 Multi-Currency Support
- **10+ Currencies** - USD, EUR, GBP, INR, JPY, CAD, AUD, CHF, CNY, BRL
- **Currency Conversion** - Track expenses in different currencies
- **Currency Formatting** - Proper formatting for each currency
- **Easy Switching** - Switch currencies with one click

### 🎨 User Experience
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Works on different screen sizes
- **Intuitive Navigation** - Easy-to-use interface
- **Material Design** - Modern, clean UI
- **Keyboard Shortcuts** - Power user features

### 🔒 Privacy & Security
- **Local Storage Only** - All data stored on your device
- **No Data Transmission** - Zero data sent to external servers
- **No Tracking** - No analytics or user tracking
- **GDPR Compliant** - Meets privacy regulations
- **CCPA Compliant** - California privacy law compliant

---

## 📦 Installation

### Windows

#### Option 1: NSIS Installer (Recommended)
1. Download `FamBudget-3.5.1-x64.exe` from [Releases](https://github.com/lalupj07/FamBudget/releases)
2. Run the installer
3. Follow the installation wizard
4. Launch FamBudget from Start Menu or Desktop

#### Option 2: MSI Installer
1. Download `FamBudget-3.5.1-x64.msi` from [Releases](https://github.com/lalupj07/FamBudget/releases)
2. Double-click to install
3. Launch from Start Menu

#### Option 3: Portable Version
1. Download the portable executable
2. Extract to any folder
3. Run `FamBudget.exe` directly (no installation needed)

### System Requirements

- **OS:** Windows 10 (Version 1809) or higher
- **Architecture:** x64 (64-bit)
- **RAM:** 4 GB minimum
- **Storage:** 500 MB free space
- **Display:** 1024x768 minimum resolution

---

## 🚀 Quick Start

1. **Launch the Application**
   - Open FamBudget from Start Menu or Desktop shortcut

2. **Add Your First Transaction**
   - Click "Add Transaction" button (top right)
   - Fill in description, amount, category, and date
   - Click "Save"

3. **Set Up Accounts**
   - Go to "Accounts" section
   - Add your bank accounts
   - Set initial balances

4. **Create Budget Goals**
   - Navigate to "Goals" section
   - Click "Add Goal"
   - Set target amount and deadline

5. **View Analytics**
   - Check "Dashboard" for overview
   - Visit "Reports" for detailed charts
   - Explore spending by category

---

## 📸 Screenshots

<div align="center">

### Dashboard View
![Dashboard](desktop-app/assets/Square150x150Logo.png)
*Overview of your financial health*

### Transaction Management
![Transactions](desktop-app/assets/Square150x150Logo.png)
*Easy transaction entry and management*

### Analytics & Reports
![Reports](desktop-app/assets/Square150x150Logo.png)
*Detailed charts and insights*

</div>

---

## 🏢 About GenXis Innovations

**FamBudget** is developed and maintained by **GenXis Innovations**, a technology company focused on creating innovative software solutions.

### Company Information

- **Company Name:** GenXis Innovations
- **Email:** genxisinnovation@outlook.com
- **Website:** https://github.com/lalupj07/GenXlink
- **License:** Apache License 2.0
- **Copyright:** © 2025 GenXis Innovations. All rights reserved.

### Our Mission

To provide families with powerful, privacy-focused financial management tools that help them achieve their financial goals while maintaining complete control over their data.

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Framework:** Electron 27.3.11
- **Charts:** Chart.js 4.5.1
- **Icons:** Material Icons
- **Build Tool:** Electron Builder
- **Package Manager:** npm

---

## 📋 Project Structure

```
FamBudget/
├── desktop-app/          # Desktop application
│   ├── app.js           # Main application logic
│   ├── main.js          # Electron main process
│   ├── index.html       # Main UI
│   ├── styles.css       # Styling
│   ├── api.js           # API service (optional)
│   └── assets/          # Images and icons
├── mobile/              # Mobile application (React Native)
├── backend/             # Backend API (NestJS)
├── CHANGELOG.md         # Version history
└── LICENSE              # Apache 2.0 License
```

---

## 🔄 Version History

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

### Current Version: 4.0.0

**What's New:**
- ✅ GenXis Innovations branding
- ✅ Enhanced stability and error handling
- ✅ Fixed blank screen issues
- ✅ Microsoft Store ready
- ✅ Improved null checks throughout

---

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

---

## 📧 Support & Contact

- **Email:** genxisinnovation@outlook.com
- **GitHub Issues:** [Report a bug](https://github.com/lalupj07/FamBudget/issues)
- **GitHub Discussions:** [Ask a question](https://github.com/lalupj07/FamBudget/discussions)

---

## 🌐 Links

- **Releases:** https://github.com/lalupj07/FamBudget/releases
- **Issues:** https://github.com/lalupj07/FamBudget/issues
- **Privacy Policy:** [PRIVACY-POLICY.md](desktop-app/PRIVACY-POLICY.md)
- **Changelog:** [CHANGELOG.md](CHANGELOG.md)

---

## ⭐ Show Your Support

If you find FamBudget useful, please consider giving it a ⭐ on GitHub!

---

<div align="center">

**Made with ❤️ by [GenXis Innovations](https://github.com/lalupj07/GenXlink)**

[⬆ Back to Top](#-fambudget---advanced-family-budget-management)

</div>
