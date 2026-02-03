# FamBudget Windows installers

This folder contains scripts to build **Setup.exe** (Inno Setup) and **.msi** (WiX Toolset) installers in addition to the portable ZIP and MSIX produced by the main build script.

## Prerequisites

- Close FamBudget if it is running (installer may lock files under `Release`).
- **Flutter Windows build** must already exist: run `.\build_release.ps1` from the project root (or from `fambudget_flutter`) so that `build\windows\x64\runner\Release` is populated.

### For Setup.exe (Inno Setup)

1. Download and install [Inno Setup](https://jrsoftware.org/isinfo.php) (free).
2. Ensure `iscc.exe` is on your PATH (default: `C:\Program Files (x86)\Inno Setup 6\ISCC.exe`).
3. From `fambudget_flutter`, run:
   ```powershell
   & "${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe" installer\FamBudget.iss
   ```
   Or the main build script will run this automatically if Inno Setup is installed.

### For .msi (WiX Toolset)

1. Download and install [WiX Toolset v3](https://wixtoolset.org/docs/wix3/) (e.g. v3.11).
2. Add the WiX `bin` folder to your PATH (e.g. `C:\Program Files (x86)\WiX Toolset v3.11\bin`).
3. The main build script will run `heat`, `candle`, and `light` automatically if they are on your PATH.

## Outputs

All installer outputs go to `fambudget_flutter\dist\`:

| File | Description |
|------|-------------|
| `FamBudget-Portable-5.0.0.zip` | Portable: extract and run the .exe |
| `FamBudget-Setup.msix` | Modern Windows app package (double-click to install) |
| `FamBudget-Setup-5.0.0.exe` | Inno Setup installer (if Inno Setup is installed) |
| `FamBudget-Setup-5.0.0.msi` | WiX MSI installer (if WiX Toolset is installed) |

© 2025 GenXis Innovation. Licensed under Apache License 2.0.
