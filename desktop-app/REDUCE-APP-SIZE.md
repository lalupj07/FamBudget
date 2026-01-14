# 📦 Reducing FamBudget App Size

This guide explains the optimizations made to reduce the app size from ~900MB to a much smaller size.

## ✅ Optimizations Applied

### 1. **Removed 32-bit (ia32) Builds** ⚠️ **MAJOR SAVINGS**
- **Before:** Building for both x64 and ia32 (doubled size)
- **After:** Only building for x64 (64-bit Windows)
- **Savings:** ~50% reduction (removed 32-bit installers)

### 2. **Enabled Maximum Compression**
- Added `"compression": "maximum"` to build config
- Enables best compression for NSIS installer
- **Savings:** ~20-30% reduction

### 3. **Enabled ASAR Archive**
- ASAR archives all app files into a single file
- Reduces file overhead and improves performance
- **Savings:** ~5-10% reduction

### 4. **Removed Unused Dependencies**
- Removed `@nestjs/mapped-types` (backend-only dependency)
- **Savings:** ~5MB

### 5. **Limited Locale Files**
- Only includes English locale (`electronLanguages: ["en"]`)
- Removes unnecessary language packs
- **Savings:** ~50-100MB (multiple .pak files removed)

### 6. **Removed Unnecessary Build Targets**
- Removed MSI and MSIX builds by default
- Kept only NSIS (exe) and portable builds
- **Savings:** No duplicate builds

## 📊 Expected Size Reduction

| Component | Before | After | Savings |
|-----------|--------|-------|---------|
| NSIS Installer (x64) | ~900 MB | ~350-400 MB | ~55% |
| Portable (x64) | ~180 MB | ~120-140 MB | ~33% |

## 🚀 Building Optimized Version

```bash
cd desktop-app

# Clean old builds
rm -rf dist-v3.5.1

# Build optimized version
npm run build-exe      # NSIS installer (~350-400 MB)
npm run build-portable # Portable exe (~120-140 MB)
```

## 📋 Additional Optimizations (Optional)

### A. Remove Unused Assets
Check if all images in `assets/` folder are needed:
```bash
# List large files
Get-ChildItem -Path ".\assets" -Recurse -File | Sort-Object Length -Descending
```

### B. Use Electron-Updater with Differential Updates
For future updates, use differential updates to only download changes.

### C. Remove Source Maps in Production
Already excluded with `!**/*.map` in files config.

### D. Tree Shaking for Dependencies
Consider using a bundler (webpack/rollup) to tree-shake unused code from dependencies.

## 🔍 Verifying Size Reduction

After building, check the size:
```powershell
Get-ChildItem -Path ".\dist-v3.5.1" -Recurse -File | 
  Measure-Object -Property Length -Sum | 
  Select-Object @{Name="SizeMB";Expression={[math]::Round($_.Sum / 1MB, 2)}}

# Or check specific files
Get-Item ".\dist-v3.5.1\FamBudget-3.5.1-x64.exe" | Select-Object Name, @{Name="SizeMB";Expression={[math]::Round($_.Length / 1MB, 2)}}
```

## ⚠️ Trade-offs

1. **No 32-bit Support:** Older Windows systems (before Windows 7 SP1) won't be supported
2. **English Only:** App interface remains English (localization not affected if you add it later)
3. **Fewer Formats:** MSI and MSIX not built by default (can still build separately if needed)

## 🎯 Next Steps

1. **Rebuild the app:**
   ```bash
   cd desktop-app
   npm run build-exe
   ```

2. **Test the new build:**
   - Install and test all features
   - Verify performance is still good
   - Check file size

3. **If needed, create optimized build scripts:**
   ```json
   "build:optimized": "electron-builder --win --x64 --config.compression=maximum"
   ```

## 📚 References

- [Electron Builder Configuration](https://www.electron.build/configuration/configuration)
- [NSIS Compression](https://www.electron.build/configuration/nsis)
- [ASAR Archives](https://www.electronjs.org/docs/latest/tutorial/asar-archives)
