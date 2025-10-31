# 🚀 How to Get FamBudget Setup Files

## ⚠️ Important Note

The installer files (**FamBudget-3.5.1-x64.exe** and **FamBudget-3.5.1-x64.msi**) are **NOT included in the Git repository** because they are too large (885 MB and 941 MB).

GitHub has a **100 MB file size limit** for individual files, so large installer files cannot be committed directly to the repository.

## 📥 How to Download Setup Files

### Option 1: Build from Source (Recommended)

Build the installers yourself using the source code:

```bash
# 1. Clone the repository
git clone https://github.com/lalupj07/FamBudget.git
cd FamBudget/desktop-app

# 2. Install dependencies
npm install

# 3. Build installers
npm run build-exe    # Creates FamBudget-3.5.1-x64.exe (NSIS)
npm run build-msi     # Creates FamBudget-3.5.1-x64.msi (MSI)
npm run build-portable # Creates portable executable
```

The installer files will be in: `desktop-app/dist-v3.5.1/`

### Option 2: GitHub Releases (When Available)

If I create a GitHub Release, you can download the installers directly:

1. Go to: https://github.com/lalupj07/FamBudget/releases
2. Download `FamBudget-3.5.1-x64.exe` or `FamBudget-3.5.1-x64.msi`
3. Run the installer

**Note:** You'll need to create a GitHub Release and upload the files manually through the GitHub web interface.

### Option 3: Portable Version

For a portable executable (no installation needed):

```bash
cd desktop-app
npm run build-portable
```

Then run: `desktop-app/dist-v3.5.1/win-unpacked/FamBudget.exe`

## 📍 Where Are the Files?

The installer files are currently in your local project:
- **Location:** `desktop-app/dist-v3.5.1/`
- **Files:**
  - `FamBudget-3.5.1-x64.exe` (885 MB) - NSIS Installer
  - `FamBudget-3.5.1-x64.msi` (941 MB) - MSI Installer
  - `FamBudget.exe` (165 MB) - Portable executable (in `win-unpacked/`)

## ✅ Solution: Upload to GitHub Releases

To make the setup files available for download, create a GitHub Release:

1. **Go to Releases:** https://github.com/lalupj07/FamBudget/releases/new
2. **Create New Release:**
   - Tag: `v3.5.1`
   - Title: `FamBudget v3.5.1`
   - Description: Release notes
3. **Upload Files:**
   - Drag and drop `FamBudget-3.5.1-x64.exe`
   - Drag and drop `FamBudget-3.5.1-x64.msi`
4. **Publish Release**

Then users can download installers from: https://github.com/lalupj07/FamBudget/releases

## 🔧 Alternative: Use Git LFS

For large files, you could use Git Large File Storage (LFS), but GitHub Releases is simpler and better for users.

---

**Summary:** Setup files exist locally but can't be in Git due to size limits. Build from source or upload to GitHub Releases!

