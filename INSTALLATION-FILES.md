# Installation Files Location

## 📦 Where to Find Setup Files

The installer files are **too large** to include directly in the Git repository (they are ~885 MB and ~941 MB, exceeding GitHub's 100MB file size limit).

### Option 1: GitHub Releases (Recommended)

The installer files are hosted on **GitHub Releases** for easy download:

1. Go to: https://github.com/lalupj07/FamBudget/releases
2. Download the latest release installer files:
   - `FamBudget-3.5.1-x64.exe` - NSIS Installer (885 MB)
   - `FamBudget-3.5.1-x64.msi` - MSI Installer (941 MB)

### Option 2: Build from Source

If you want to build the installers yourself:

```bash
cd desktop-app
npm install
npm run build-exe    # Creates FamBudget-3.5.1-x64.exe
npm run build-msi     # Creates FamBudget-3.5.1-x64.msi
npm run build-portable # Creates portable executable
```

The installers will be in: `desktop-app/dist-v3.5.1/`

### Option 3: Portable Version

If you prefer not to install, use the portable executable:

```bash
cd desktop-app
npm run build-portable
```

Then run: `desktop-app/dist-v3.5.1/win-unpacked/FamBudget.exe`

## 📍 Current Status

- ✅ Installer files are built and located in: `desktop-app/dist-v3.5.1/`
- ✅ Files are ready but not in Git (too large for repository)
- ✅ Files should be uploaded to GitHub Releases for distribution

## 🚀 Creating a GitHub Release

To create a release with the installer files:

1. Go to: https://github.com/lalupj07/FamBudget/releases/new
2. Create a new release:
   - Tag: `v3.5.1`
   - Title: `FamBudget v3.5.1`
   - Description: Release notes
3. Upload files:
   - Drag and drop `FamBudget-3.5.1-x64.exe`
   - Drag and drop `FamBudget-3.5.1-x64.msi`
4. Publish release

Then users can download installers from the Releases page!

