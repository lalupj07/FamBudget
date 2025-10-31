# FamBudget - Windows Setup Guide

Complete setup guide for Windows users.

## 📋 Prerequisites for Windows

### 1. Install Node.js
- Download from [nodejs.org](https://nodejs.org/)
- Version 18+ required
- Installer includes npm automatically

**Verify installation:**
```powershell
node --version
npm --version
```

### 2. Install PostgreSQL
- Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- Use the installer (includes pgAdmin)
- Remember your postgres password!

**Verify installation:**
```powershell
psql --version
```

### 3. Install Git (Optional but recommended)
- Download from [git-scm.com](https://git-scm.com/download/win)

## 🚀 Quick Setup

### Step 1: Clone/Download Project

```powershell
# If using Git
git clone <your-repo-url>
cd FamBudget

# Or download ZIP and extract
```

### Step 2: Install Dependencies

```powershell
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install mobile dependencies
cd ..\mobile
npm install

# Return to root
cd ..
```

### Step 3: Set Up PostgreSQL Database

**Option A: Using pgAdmin (GUI)**
1. Open pgAdmin 4
2. Right-click on "Databases"
3. Select "Create" → "Database"
4. Enter name: `fambudget`
5. Click "Save"

**Option B: Using PowerShell**
```powershell
# Open PowerShell as Administrator
# Connect to PostgreSQL
psql -U postgres

# In psql prompt:
CREATE DATABASE fambudget;
\q
```

**Option C: Using Command Prompt**
```cmd
# Find PostgreSQL bin directory (usually)
cd "C:\Program Files\PostgreSQL\15\bin"

# Create database
createdb -U postgres fambudget
```

### Step 4: Configure Backend

Create `.env` file in `backend` folder:

```powershell
cd backend

# Create .env file using notepad
notepad .env
```

Paste this into `.env` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password_here
DB_DATABASE=fambudget

JWT_SECRET=FamBudget-Super-Secret-Key-Change-This-In-Production
JWT_EXPIRATION=7d

PORT=3000
NODE_ENV=development

ENCRYPTION_KEY=32-Character-Encryption-Key-12345
```

**Important for Windows:**
- Replace `your_postgres_password_here` with your actual PostgreSQL password
- No quotes needed around values
- Save and close notepad

### Step 5: Start Backend

```powershell
cd backend
npm run start:dev
```

You should see:
```
🚀 FamBudget API running on http://localhost:3000
```

**Keep this window open!**

### Step 6: Start Mobile App

Open a **NEW PowerShell window**:

```powershell
cd mobile

# Update API URL for your device
# Edit mobile\src\services\api.ts if needed

# Start Expo
npm start
```

This will open Expo DevTools in your browser.

## 📱 Running on Device/Emulator

### Option 1: Physical Device (Recommended)

1. **Install Expo Go**
   - iOS: App Store
   - Android: Play Store

2. **Connect to Same WiFi** as your computer

3. **Find Your Computer's IP**
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., `192.168.1.100`)

4. **Update API URL**
   Edit `mobile\src\services\api.ts`:
   ```typescript
   const API_URL = 'http://192.168.1.100:3000';
   ```

5. **Scan QR Code** in Expo Go app

### Option 2: Android Emulator

1. **Install Android Studio**
   - Download from [developer.android.com](https://developer.android.com/studio)
   - Install Android SDK and create Virtual Device

2. **Start Emulator** from Android Studio

3. **Update API URL**
   Edit `mobile\src\services\api.ts`:
   ```typescript
   const API_URL = 'http://10.0.2.2:3000';
   ```

4. **Run App**
   ```powershell
   npm run android
   ```

### Option 3: Web Browser (Quick Test)

```powershell
npm run web
```

**Note:** Some mobile features won't work on web.

## 🌱 Seed Demo Data

```powershell
cd backend
npm run seed
```

**Login with:**
- Email: `alex@demofamily.com`
- Password: `demo123456`

## 🔧 Windows-Specific Troubleshooting

### Problem: PostgreSQL Not Found

**Solution:**
Add PostgreSQL to PATH:
1. Search "Environment Variables" in Windows
2. Click "Environment Variables"
3. Under "System Variables", select "Path"
4. Click "Edit"
5. Add: `C:\Program Files\PostgreSQL\15\bin`
6. Click "OK" and restart PowerShell

### Problem: Port 3000 Already in Use

**Find what's using the port:**
```powershell
netstat -ano | findstr :3000
```

**Kill the process:**
```powershell
# Note the PID from above command
taskkill /PID <PID_NUMBER> /F
```

### Problem: Can't Connect from Mobile

**Check Firewall:**
1. Search "Windows Defender Firewall"
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Enter "3000" → Next
6. Allow the connection → Finish

**Or temporarily disable firewall for testing:**
```powershell
# Run as Administrator
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False

# Re-enable after testing
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
```

### Problem: npm install Errors

**Clear npm cache:**
```powershell
npm cache clean --force
npm install
```

**Use administrator PowerShell:**
Right-click PowerShell → "Run as Administrator"

### Problem: "Expo Go app not loading"

**Solution:**
```powershell
# Use tunnel mode (slower but works everywhere)
npm start -- --tunnel

# Or try clearing cache
npm start -- --clear
```

### Problem: TypeScript Errors

**Solution:**
```powershell
# Backend
cd backend
rm -r node_modules
npm install

# Mobile
cd ..\mobile
rm -r node_modules
npm install
```

## 📁 Windows File Paths

Use backslashes in Windows:
- Config files: `backend\src\config`
- Screens: `mobile\src\screens`

PowerShell also accepts forward slashes (Unix-style):
- `cd backend/src` works too!

## 🎯 PowerShell Commands Quick Reference

```powershell
# Navigate
cd backend              # Change directory
cd ..                   # Go up one level
dir                     # List files
pwd                     # Show current directory

# File operations
type .env               # View file contents
notepad .env            # Edit file
mkdir new-folder        # Create folder

# Process management
Get-Process node        # See Node processes
Stop-Process -Name node # Stop all Node processes

# Network
ipconfig                # Get IP address
netstat -ano            # Show all ports
Test-NetConnection localhost -Port 3000  # Test if port is open
```

## 🚦 Running Both Services

### Option A: Two PowerShell Windows

**Window 1 (Backend):**
```powershell
cd backend
npm run start:dev
```

**Window 2 (Mobile):**
```powershell
cd mobile
npm start
```

### Option B: Windows Terminal (Recommended)

1. Install [Windows Terminal](https://aka.ms/terminal) from Microsoft Store
2. Open Terminal
3. Split panes (Alt+Shift+Plus)
4. Run backend in one pane, mobile in other

### Option C: VS Code Integrated Terminal

1. Open project in VS Code
2. Terminal → Split Terminal
3. Run backend in one, mobile in other

## ✅ Verification Checklist

- [ ] Node.js installed and working
- [ ] PostgreSQL installed and running
- [ ] Database `fambudget` created
- [ ] Backend `.env` file configured
- [ ] Backend starts without errors
- [ ] Mobile app starts without errors
- [ ] Can access backend at `http://localhost:3000`
- [ ] Mobile app loads on device/emulator
- [ ] Can register new account
- [ ] Can create budget envelopes

## 🎬 Video Tutorial (Coming Soon)

For visual learners, we'll create a Windows setup video tutorial.

## 💡 Development Tips for Windows

### Use Windows Terminal
- Better than Command Prompt
- Supports multiple tabs
- Better colors and fonts

### Use VS Code
- Great for full-stack development
- Integrated terminal
- Git integration
- Extensions for React Native

### Useful VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- ESLint
- Prettier
- Thunder Client (API testing)
- PostgreSQL

## 🔄 Daily Development Workflow

```powershell
# Morning: Start services
cd backend
npm run start:dev
# Open new terminal
cd mobile
npm start

# During development:
# Backend auto-reloads on save
# Mobile reloads on save

# Evening: Stop services
# Press Ctrl+C in both terminals
```

## 📞 Need Help?

- Check [SETUP.md](./SETUP.md) for general setup
- See [QUICKSTART.md](./QUICKSTART.md) for quick reference
- Review [README.md](./README.md) for features

## 🎉 You're Ready!

Start building your family budget app on Windows! 💰

---

**Windows-specific tips welcome! Found something that works better? Contribute to CONTRIBUTING.md**

