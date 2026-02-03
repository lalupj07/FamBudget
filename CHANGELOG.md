# Changelog

All notable changes to FamBudget will be documented in this file.

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

[5.0.0]: https://github.com/lalupj07/FamBudget/releases/tag/v5.0.0
[4.0.0]: https://github.com/lalupj07/FamBudget/releases/tag/v4.0.0
[3.5.1]: https://github.com/lalupj07/FamBudget/releases/tag/v3.5.1
