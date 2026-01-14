# FamBudget - Testing Guide

**Quick Testing Steps for All Components**

---

## 🧪 Test Order (Recommended)

1. **Backend Health Check** (No database needed)
2. **Backend Full Test** (Requires database)
3. **Desktop App Test** (Simplest)
4. **Mobile App Test** (Requires Expo)
5. **Web App Test** (Already deployed)

---

## 1. ✅ Backend Health Check Test

**Purpose:** Verify backend can start without database connection

**Requirements:** None (health endpoint works without DB)

### Quick Test:

```powershell
cd backend
npm run start:dev
```

**Expected Output:**
- Server starts on port 3000
- Health endpoint available at `http://localhost:3000/health`
- Should see: `✅ SERVER IS LISTENING!`

**Test Health Endpoint:**
Open browser: `http://localhost:3000/health`

Or use PowerShell:
```powershell
Invoke-WebRequest -Uri http://localhost:3000/health | Select-Object -ExpandProperty Content
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "FamBudget API is running",
  "timestamp": "...",
  "uptime": ...
}
```

---

## 2. 🔌 Backend Full Test (With Database)

**Purpose:** Test complete backend functionality

**Requirements:**
- PostgreSQL installed and running
- Database created: `fambudget`
- `.env` file configured

### Setup Database:

1. **Install PostgreSQL** (if not installed)
   - Download from: https://www.postgresql.org/download/windows/

2. **Create Database:**
   ```sql
   CREATE DATABASE fambudget;
   ```

3. **Configure `.env` file** in `backend/`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=fambudget
   JWT_SECRET=test-secret-key-12345
   JWT_EXPIRATION=7d
   ENCRYPTION_KEY=test-encryption-key-32-chars-long-123456
   NODE_ENV=development
   PORT=3000
   ```

### Run Backend:

```powershell
cd backend
npm run start:dev
```

**Expected:**
- ✅ Database connection successful
- ✅ Server running on port 3000
- ✅ All modules loaded

### Test Endpoints:

1. **Health Check:**
   ```
   GET http://localhost:3000/health
   ```

2. **Register User:**
   ```
   POST http://localhost:3000/auth/register
   Body: {
     "email": "test@example.com",
     "password": "test123",
     "name": "Test User"
   }
   ```

3. **Login:**
   ```
   POST http://localhost:3000/auth/login
   Body: {
     "email": "test@example.com",
     "password": "test123"
   }
   ```

---

## 3. 🖥️ Desktop App Test

**Purpose:** Test Electron desktop app

**Requirements:** Node.js installed

### Run Desktop App:

```powershell
cd desktop-app
npm install  # If not already installed
npm start
```

**Expected:**
- ✅ Electron window opens
- ✅ App loads
- ✅ Can create transactions
- ✅ Can view dashboard

**Test Features:**
- ✅ Create transaction
- ✅ View dashboard
- ✅ Check budget
- ✅ View goals

---

## 4. 📱 Mobile App Test

**Purpose:** Test React Native mobile app

**Requirements:**
- Node.js installed
- Expo CLI (optional)
- Expo Go app on phone (for device testing)

### Run Mobile App:

```powershell
cd mobile
npm install  # If not already installed
npm start
```

**Expected:**
- ✅ Expo Dev Tools open in browser
- ✅ QR code displayed
- ✅ Can scan with Expo Go app

### Test Options:

**Option 1: Expo Go (Easiest)**
1. Install Expo Go app on phone
2. Scan QR code
3. App loads on device

**Option 2: Android Emulator**
1. Install Android Studio
2. Create emulator
3. Press `a` in Expo terminal

**Option 3: iOS Simulator (Mac only)**
1. Install Xcode
2. Press `i` in Expo terminal

---

## 5. 🌐 Web App Test

**Purpose:** Test deployed web app

**Status:** ✅ Already deployed!

**URL:** https://lalupj07.github.io/FamBudget

### Test Steps:

1. Open URL in browser
2. Test all features
3. Check browser console for errors (F12)

---

## 🧪 Quick Test Script

Run all quick tests:

```powershell
# 1. Backend Health (starts server)
cd backend
npm run start:dev
# In another terminal, test:
# Invoke-WebRequest http://localhost:3000/health

# 2. Desktop App
cd ..\desktop-app
npm start

# 3. Mobile App
cd ..\mobile
npm start
```

---

## ✅ Test Checklist

### Backend:
- [ ] Health endpoint works (`/health`)
- [ ] Server starts without errors
- [ ] Database connects (if configured)
- [ ] Can register user
- [ ] Can login
- [ ] JWT token received

### Desktop App:
- [ ] App opens
- [ ] Dashboard loads
- [ ] Can create transaction
- [ ] Can view reports
- [ ] Can manage budgets

### Mobile App:
- [ ] Expo starts
- [ ] App loads on device/emulator
- [ ] Navigation works
- [ ] Screens render correctly
- [ ] Can interact with UI

### Web App:
- [ ] Page loads
- [ ] Features work
- [ ] No console errors
- [ ] Responsive design

---

## 🐛 Common Issues

### Backend Won't Start:
- Check Node.js version (need 18+)
- Check dependencies installed (`npm install`)
- Check `.env` file exists
- Check port 3000 not in use

### Database Connection Failed:
- Check PostgreSQL is running
- Check database exists
- Check `.env` credentials correct
- Check firewall allows connection

### Mobile App Won't Start:
- Check Node.js version
- Check dependencies installed
- Clear cache: `npm start -- --clear`
- Check Expo CLI installed: `npm install -g expo-cli`

### Desktop App Won't Start:
- Check Node.js version
- Check dependencies installed
- Try: `npm install --force`
- Check Electron version compatible

---

## 📝 Test Results Template

```
Backend Health: [ ] Pass [ ] Fail
Backend Full:   [ ] Pass [ ] Fail
Desktop App:    [ ] Pass [ ] Fail
Mobile App:     [ ] Pass [ ] Fail
Web App:        [ ] Pass [ ] Fail

Issues Found:
- 
- 
- 

Notes:
- 
- 
```

---

*Last Updated: $(Get-Date -Format "yyyy-MM-dd")*
