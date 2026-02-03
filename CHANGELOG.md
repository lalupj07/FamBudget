# Changelog

All notable changes to FamBudget will be documented in this file.

## [5.0.1] - 2026-02-04

### Added
- **Screenshots (v5.0.0 UI):** New app screenshots in `screenshots/` for documentation and releases:
  - **Dashboard** – Summary cards (income, expenses, net change, savings rate), Income vs Expenses chart, Upcoming recurring, Spending by category, Recent transactions, Quick add FAB.
  - **Transactions** – Recurring section (Add recurring, Rent, Netflix), filters (search, account, category, date range), Import/Add transaction, transaction list with edit/delete.
  - **Accounts** – Primary Checking, Savings, Cash cards with balances and Edit/Delete; Add Account; Quick add FAB.
  - **Income** – Income sources (Add source, Main job, Side gig), Income entries (Add income, recurring/one-time entries with dates and amounts).
  - **Goals** – Goal calculator (target amount, current saved, target date), goal cards (Emergency Fund, Vacation, New Laptop, Car Maintenance) with priority, progress bars, edit/delete.
  - **Reports & Analytics** – This month / This year summary cards, Spending trends (6/12 months bar chart), Spending by category table with budget vs spent.
  - **Settings** – Profile (avatar, Add profile photo, Edit profile), Appearance (Dark mode, Language, Quick tour), Category budgets, Backup (Remind monthly, Backup now to folder).

### Changed
- Replaced previous screenshots with Flutter Windows v5.0.0 UI in `screenshots/` (dashboard, transactions, accounts, income, goals, reports, settings).
- Screenshots README updated to reflect current set.

---

## [5.0.0] - 2026-02-03

### Added

**Flutter Windows desktop app (primary)**
- New FamBudget Windows app built with Flutter for Windows (replaces Electron desktop app as primary).
- Category budgets: monthly limits per category, editable in Settings, used for dashboard alerts.
- Recurring transactions: model, storage, UI, and "Upcoming recurring" section on the dashboard.
- Quick-add transaction: floating action button with quick-add and full-form options.
- Undo delete: transactions, accounts, and goals with 5-second SnackBar undo.
- Goal calculator: on Goals screen, calculates monthly savings needed from target amount and date.
- Spending trends: bar chart by category over 6/12 months on Reports screen.
- Global search: search overlay from AppBar for transactions, accounts, and goals.
- Duplicate hint: checks for similar transactions or unusual amounts before saving.
- Scheduled backup: "Backup now to folder" and "Remind me monthly" in Settings.
- Profile photo: add/change/remove in Settings with CircleAvatar and file picker.
- Multi-language (12 locales): English, Spanish, French, Hindi, Malayalam, Arabic, Chinese, German, Portuguese, Tamil, Japanese, Telugu, Korean; language selector in Settings.
- Custom app icon and branding; Apache 2.0 and GenXis Innovation licensing in About.

**Installers**
- Portable ZIP, MSIX, Inno Setup (Setup.exe), and WiX MSI build support via `fambudget_flutter/build_release.ps1`.

### Changed
- Version set to 5.0.0 across pubspec, installers, and docs.
- README and project structure updated for Flutter Windows and v5.0.0.

### Technical
- Flutter Windows release build; MSIX config; Inno Setup and WiX installer scripts in `fambudget_flutter/installer/`.
- Localization via `flutter_localizations` and ARB files in `lib/l10n/`.

---

## [4.0.0] - 2025-01-17

### Added
- GenXis Innovations branding and licensing
- Comprehensive null checks for all render methods
- Privacy policy and certification notes for Microsoft Store
- Enhanced error handling and stability

### Fixed
- Fixed blank screen issue on app launch
- Fixed missing app.js and api.js script loading
- Fixed null reference errors in render methods
- Fixed Chart.js loading issues

### Changed
- Updated copyright to 2025 GenXis Innovations
- Updated license to Apache-2.0
- Updated contact information to genxisinnovation@outlook.com
- Restored stable v3.5.1 base and enhanced

### Microsoft Store Ready
- Publisher identity configured: CN=32E8983E-61F1-4B7F-9C58-231257C9F559
- NSIS and MSI installers available
- Privacy policy included
- Certification notes prepared

## [3.5.1] - 2025-11-01

### Features
- Complete desktop app with Electron
- Multi-currency support
- Dark mode
- Income tracking with multiple sources
- Comprehensive charts and reports
- Fixed Chart.js loading issue for packaged apps

---

[5.0.1]: https://github.com/lalupj07/FamBudget/releases/tag/v5.0.1
[5.0.0]: https://github.com/lalupj07/FamBudget/releases/tag/v5.0.0
[4.0.0]: https://github.com/lalupj07/FamBudget/releases/tag/v4.0.0
[3.5.1]: https://github.com/lalupj07/FamBudget/releases/tag/v3.5.1
