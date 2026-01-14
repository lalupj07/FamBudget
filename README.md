# FamBudget 💰

**Automatic, collaborative family budgeting app** that splits income, tracks shared & personal expenses, and plans goals with a clean Material UI and thoughtful color system.

## 📋 Overview

FamBudget helps couples/families analyze combined income, automatically divide salary across shared needs, personal spending, savings and goals. It supports multiple earners, joint accounts, permissioned approvals, recurring expenses, and rich visual reports to make money conversations simple and stress-free.

### Key Features (MVP)

- ✅ **Multi-user profiles** - Primary, Partner, Child, Guest roles
- ✅ **Income capture** - Manual or bank feed integration
- ✅ **Automatic split rules** - Define percentages to split salary into envelopes
- ✅ **Shared wallets** - Joint wallets for multiple members
- ✅ **Expense tracking** - Quick add, categories, receipt capture
- ✅ **Budget planner** - Monthly envelopes with real-time preview
- ✅ **Goals tracking** - Shared goals with contribution schedules
- ✅ **Visual reports** - Spending analytics and trends
- ✅ **CSV/PDF export** - Export statements and reports
- ✅ **Secure** - AES-256 encryption, optional cloud sync

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Node.js + NestJS (TypeScript)
- PostgreSQL + TypeORM
- JWT Authentication
- Passport.js

**Mobile:**
- React Native (Expo)
- React Native Paper (Material Design)
- React Navigation
- AsyncStorage
- Axios

**Design:**
- Material Design 3
- Custom color palette for categories
- Roboto typography
- Accessible (WCAG compliant)

## 🚀 Getting Started

### 🪟 Windows Users - One-Click Setup!

**Double-click `setup-windows.bat`** to automatically install everything!

Then:
- **Double-click `start-all.bat`** to run both backend and mobile

See [WINDOWS_QUICKSTART.md](./WINDOWS_QUICKSTART.md) for details.

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Expo CLI (for mobile development)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials and secrets.

4. **Create PostgreSQL database:**
   ```bash
   createdb fambudget
   ```

5. **Start the development server:**
   ```bash
   npm run start:dev
   ```

   The API will be available at `http://localhost:3000`

### Mobile Setup

1. **Navigate to mobile directory:**
   ```bash
   cd mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Update API URL:**
   Edit `mobile/src/services/api.ts` and set your backend URL.

4. **Start Expo:**
   ```bash
   npm start
   ```

5. **Run on device:**
   - Scan QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator, `a` for Android emulator

### Quick Start (Both)

From the root directory:
```bash
npm run install:all
npm run dev
```

## 📦 Installation Files

**Note:** The installer files are **not included in the Git repository** due to their large size (885 MB and 941 MB). 

To get the setup files:
1. **Build from source** (see [INSTALLATION-FILES.md](./INSTALLATION-FILES.md))
2. **Download from GitHub Releases** (if available)
3. **Use portable version** (no installation needed)

See [INSTALLATION-FILES.md](./INSTALLATION-FILES.md) for detailed instructions.

## 📱 Screenshots & UI

### Design System

**Primary Palette:**
- Primary: `#1565C0` (Strong Blue)
- Success: `#2E7D32` (Green)
- Warning: `#FFB300` (Amber)
- Error: `#D32F2F` (Red)
- Background: `#FAFBFF` (Soft off-white)

**Category Colors:**
- Groceries: `#8BC34A`
- Bills: `#FF9800`
- Savings: `#00ACC1`
- Personal: `#9C27B0`
- Travel: `#FF7043`

### Key Screens

1. **Dashboard** - Balance snapshot, budget overview, upcoming bills
2. **Budget Planner** - Envelope cards with slider controls
3. **Transactions** - Timeline with filters and quick add
4. **Goals** - Progress tracking with visual indicators
5. **Settings** - Security, members, exports

## 🗄️ Database Schema

### Core Entities

- **Household** - Family/group container
- **Member** - Users with roles (Primary, Partner, Child, Guest)
- **Account/Wallet** - Personal or joint accounts
- **Income** - Salary sources with frequency
- **Envelope** - Budget categories with allocations
- **Transaction** - Expenses and income entries
- **Goal** - Shared savings goals
- **SplitRule** - Automatic splitting formulas

## 🔐 Security & Privacy

- **Local encryption** - AES-256 for sensitive data
- **JWT authentication** - Secure token-based auth
- **Role-based access** - Granular permissions
- **Optional cloud sync** - End-to-end encrypted
- **GDPR/PDP compliant** - Data minimization principles

## 📊 API Endpoints

### Authentication
- `POST /auth/register` - Create account
- `POST /auth/login` - Sign in

### Household
- `GET /household` - Get household details
- `GET /household/dashboard` - Dashboard data
- `GET /household/members` - List members
- `PATCH /household` - Update household

### Envelopes (Budget)
- `GET /envelopes` - List all envelopes
- `POST /envelopes` - Create envelope
- `POST /envelopes/defaults` - Create default set
- `PATCH /envelopes/:id` - Update envelope
- `DELETE /envelopes/:id` - Delete envelope

### Transactions
- `GET /transactions` - List transactions (with filters)
- `POST /transactions` - Create transaction
- `DELETE /transactions/:id` - Delete transaction
- `GET /transactions/report/monthly` - Monthly report

## 🎯 Roadmap

### MVP (0-3 months) ✅
- [x] User authentication & profiles
- [x] Income & envelope management
- [x] Transaction tracking
- [x] Budget planner with sliders
- [x] Dashboard & reports
- [x] Basic goal tracking

### Phase 2 (3-9 months)
- [ ] Bank sync (Plaid/TrueLayer integration)
- [ ] Auto-categorization with ML
- [ ] Receipt OCR scanning
- [ ] Shared approval workflows
- [ ] Advanced analytics & charts
- [ ] Recurring transactions automation
- [ ] Push notifications

### Phase 3 (9-18 months)
- [ ] Payment requests & settlements
- [ ] Multi-currency support
- [ ] Tax helpers & year-end reports
- [ ] Partner integrations
- [ ] Investment tracking
- [ ] Bill reminders & autopay

## 🤝 Contributing

This is a personal/family project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

Copyright (c) 2025 GenXis Innovations  
All rights reserved.

Licensed under the Apache License, Version 2.0. See [LICENSE](./LICENSE) file for details.

## 📞 Contact Information

**Company:** GenXis Innovations  
**Email:** genxisinnovation@outlook.com  
**Website:** https://github.com/lalupj07/GenXlink

## 🙏 Acknowledgments

- Material Design by Google
- React Native Paper team
- NestJS community
- All the families trying to budget better together

---

**Made with ❤️ for families who want to manage money stress-free**

