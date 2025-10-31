# FamBudget for Windows 🪟

Quick reference guide for Windows users.

## 🚀 One-Click Setup

Double-click **`setup-windows.bat`** to automatically:
- Install all dependencies
- Create database
- Configure environment
- Get you ready to run

## ▶️ Running the App

### Option 1: One-Click Start (Easiest)
Double-click **`start-all.bat`**
- Opens 2 windows (backend + mobile)
- Everything starts automatically!

### Option 2: Manual Control
**Backend:**
- Double-click `start-backend.bat`

**Mobile:**
- Double-click `start-mobile.bat`

### Option 3: PowerShell/Command Prompt
```powershell
# Backend
cd backend
npm run start:dev

# Mobile (new window)
cd mobile
npm start
```

## 📱 Connect Your Phone

1. **Install Expo Go** from Play Store/App Store
2. **Find your IP**:
   ```powershell
   ipconfig
   ```
   Look for IPv4 Address (e.g., 192.168.1.100)

3. **Update mobile\src\services\api.ts**:
   ```typescript
   const API_URL = 'http://192.168.1.100:3000';
   ```

4. **Scan QR code** in Expo Go app

## 🔧 Troubleshooting

### Port 3000 Busy?
```powershell
# Find what's using it
netstat -ano | findstr :3000

# Kill it
taskkill /PID <PID_NUMBER> /F
```

### Can't Connect from Phone?
```powershell
# Allow through firewall (run as Administrator)
netsh advfirewall firewall add rule name="FamBudget" dir=in action=allow protocol=TCP localport=3000
```

### PostgreSQL Issues?
1. Check it's running: Services → PostgreSQL
2. Verify password in `backend\.env`
3. Create database manually in pgAdmin

## 📚 Documentation

- **SETUP_WINDOWS.md** - Detailed setup guide
- **SETUP.md** - General setup (all platforms)
- **QUICKSTART.md** - 5-minute quick start

## 💡 Pro Tips

- Use **Windows Terminal** for better experience
- Keep both windows open while developing
- Backend auto-reloads on code changes
- Mobile reloads on save (shake phone for dev menu)

## 🎯 Quick Commands

```powershell
# Seed demo data
cd backend
npm run seed

# Reset database
dropdb -U postgres fambudget
createdb -U postgres fambudget

# Clear mobile cache
cd mobile
npm start -- --clear
```

## ✅ Success Checklist

- [ ] Node.js installed
- [ ] PostgreSQL running
- [ ] Database created
- [ ] Backend starts (green checkmark)
- [ ] Mobile starts (QR code shows)
- [ ] Phone on same WiFi
- [ ] Can register account
- [ ] Everything works!

**Happy budgeting on Windows!** 💰🪟

