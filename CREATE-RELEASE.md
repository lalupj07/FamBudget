# Create GitHub Release

## ✅ Step 1: Tag Created
The git tag `v3.5.1` has been created and pushed to GitHub.

## 📦 Step 2: Create Release on GitHub

Since the installer files are large (885 MB and 941 MB), you'll need to create the release manually on GitHub and upload the files.

### Quick Steps:

1. **Go to Releases Page:**
   https://github.com/lalupj07/FamBudget/releases/new

2. **Fill in Release Details:**
   - **Tag:** Select `v3.5.1` (already exists)
   - **Title:** `FamBudget v3.5.1 - Desktop App Release`
   - **Description:** Copy from below

3. **Upload Installer Files:**
   - Navigate to: `desktop-app/dist-v3.5.1/`
   - Drag and drop `FamBudget-3.5.1-x64.exe` (885 MB)
   - Drag and drop `FamBudget-3.5.1-x64.msi` (941 MB)

4. **Click "Publish release"**

### Release Description (Copy & Paste):

```
FamBudget v3.5.1 Desktop Application

## Installation Files
- **FamBudget-3.5.1-x64.exe** (NSIS Installer) - 885 MB
- **FamBudget-3.5.1-x64.msi** (MSI Installer) - 941 MB

## Features
- ✅ Fixed Chart.js loading issue for packaged apps
- ✅ Complete desktop app with Electron
- ✅ Multi-currency support (10+ currencies)
- ✅ Dark mode support
- ✅ Income tracking with multiple sources
- ✅ Comprehensive charts and reports
- ✅ NSIS, MSI, and Portable installers

## Installation Instructions
1. Download the installer file (.exe or .msi)
2. Run the installer and follow the setup wizard
3. Launch FamBudget from Start Menu or Desktop shortcut

## Changes in v3.5.1
- Fixed Chart.js dynamic loading for packaged Electron apps
- Added code signing certificate setup
- Improved error handling and fallback loading
- Enhanced chart rendering with proper path resolution

## File Locations
The installer files are located in:
- `desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.exe`
- `desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.msi`
```

## 🚀 Alternative: Use GitHub CLI (if installed)

If you install GitHub CLI, you can create releases from command line:

```bash
# Install GitHub CLI: https://cli.github.com/
# Then run:
gh release create v3.5.1 \
  desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.exe \
  desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.msi \
  --title "FamBudget v3.5.1" \
  --notes "See CREATE-RELEASE.md for release notes"
```

## ✅ Current Status

- ✅ Git tag `v3.5.1` created and pushed
- ✅ Ready to create release on GitHub web interface
- ⏳ Need to upload installer files via web interface

## 📍 File Paths

The installer files you need to upload are located at:
- `C:\Users\lalup\OneDrive\Desktop\Project Cipher\FamBudget\desktop-app\dist-v3.5.1\FamBudget-3.5.1-x64.exe`
- `C:\Users\lalup\OneDrive\Desktop\Project Cipher\FamBudget\desktop-app\dist-v3.5.1\FamBudget-3.5.1-x64.msi`

