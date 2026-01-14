# Quick Test Guide - FamBudget

**Let's test your project step by step!**

---

## 🎯 Testing Strategy

We'll test in this order (easiest to hardest):

1. **Backend Health Check** ⭐ (No database needed - SIMPLEST)
2. **Desktop App** (No setup needed)
3. **Mobile App** (Requires Expo)
4. **Backend Full Test** (Requires database)

---

## ✅ Test 1: Backend Health Check (START HERE!)

**This is the easiest test - the health endpoint works without a database!**

### Step 1: Start Backend Server

Open PowerShell in the `backend` folder and run:

```powershell
cd "C:\Users\lalup\OneDrive\Desktop\GenXis Inc\FamBudget\backend"
npm run start:dev
```

**Expected Output:**
```
🚀 Starting FamBudget API...
📊 Environment: development
🔌 Port: 3000
✅ SERVER IS LISTENING!
   URL: http://0.0.0.0:3000
   Health: http://0.0.0.0:3000/health
```

### Step 2: Test Health Endpoint

**Option A: Browser**
1. Open browser
2. Go to: `http://localhost:3000/health`
3. Should see JSON response

**Option B: PowerShell (in new terminal)**
```powershell
Invoke-WebRequest -Uri http://localhost:3000/health | Select-Object -ExpandProperty Content
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "FamBudget API is running",
  "timestamp": "2025-01-XX...",
  "uptime": ...
}
```

**✅ Success Criteria:**
- Server starts without errors
- Health endpoint returns JSON
- Status is "ok"

---

## ✅ Test 2: Desktop App

**Simple test - just run the app!**

### Step 1: Start Desktop App

Open PowerShell in the `desktop-app` folder:

```powershell
cd "C:\Users\lalup\OneDrive\Desktop\GenXis Inc\FamBudget\desktop-app"
npm start
```

**Expected:**
- Electron window opens
- App loads
- Dashboard visible

### Step 2: Test Basic Features

- [ ] App opens successfully
- [ ] Can see dashboard
- [ ] Can add a transaction
- [ ] No errors in console (if DevTools open)

**✅ Success Criteria:**
- App launches
- UI renders
- Basic interactions work

---

## ✅ Test 3: Mobile App

**Requires Expo to be set up**

### Step 1: Start Mobile App

Open PowerShell in the `mobile` folder:

```powershell
cd "C:\Users\lalup\OneDrive\Desktop\GenXis Inc\FamBudget\mobile"
npm start
```

**Expected:**
- Expo Dev Tools opens in browser
- QR code displayed
- Terminal shows "Metro waiting on..."

### Step 2: Test on Device/Emulator

**Option A: Physical Device (Easiest)**
1. Install "Expo Go" app on phone
2. Scan QR code
3. App loads on device

**Option B: Android Emulator**
1. Start Android Studio
2. Start emulator
3. Press `a` in Expo terminal

**✅ Success Criteria:**
- Expo starts
- App loads on device/emulator
- Navigation works

---

## ✅ Test 4: Backend Full Test (Optional)

**Requires PostgreSQL database**

### Prerequisites:
- PostgreSQL installed
- Database created
- `.env` file configured

### Test Steps:

1. **Setup Database:**
   ```sql
   CREATE DATABASE fambudget;
   ```

2. **Configure `.env`** (in `backend/` folder):
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=fambudget
   JWT_SECRET=test-secret-key
   ENCRYPTION_KEY=test-encryption-key-32-chars
   NODE_ENV=development
   PORT=3000
   ```

3. **Start Backend:**
   ```powershell
   cd backend
   npm run start:dev
   ```

4. **Test Registration:**
   ```powershell
   $body = @{
       email = "test@example.com"
       password = "test123"
       name = "Test User"
   } | ConvertTo-Json

   Invoke-WebRequest -Uri http://localhost:3000/auth/register -Method POST -Body $body -ContentType "application/json"
   ```

**✅ Success Criteria:**
- Database connects
- Can register user
- Can login
- Receive JWT token

---

## 🎯 Quick Start (Recommended)

**Start with Test 1 (Backend Health) - it's the simplest!**

```powershell
# Terminal 1: Start Backend
cd "C:\Users\lalup\OneDrive\Desktop\GenXis Inc\FamBudget\backend"
npm run start:dev

# Terminal 2: Test Health (after server starts)
Invoke-WebRequest -Uri http://localhost:3000/health
```

---

## 📋 Test Checklist

- [ ] **Backend Health Check** - Server starts, health endpoint works
- [ ] **Desktop App** - App opens, basic features work
- [ ] **Mobile App** - Expo starts, app loads
- [ ] **Backend Full** - Database connects, auth works (optional)

---

## 🐛 Troubleshooting

### Backend won't start:
- ✅ Check Node.js installed (you have v22.17.1 - perfect!)
- ✅ Check dependencies installed (run `npm install` in backend folder)
- ⚠️ Check port 3000 not in use: `netstat -ano | findstr :3000`

### Health endpoint not working:
- ✅ Wait for server to fully start (look for "SERVER IS LISTENING")
- ✅ Check URL is correct: `http://localhost:3000/health`
- ✅ Try browser instead of PowerShell

### Desktop app won't start:
- ✅ Check dependencies: `npm install` in desktop-app folder
- ✅ Try: `npm install --force`

### Mobile app won't start:
- ✅ Check dependencies: `npm install` in mobile folder
- ✅ Clear cache: `npm start -- --clear`

---

## 🚀 Ready to Test?

**Let's start with the backend health check!**

I can help you run the tests step by step. Which test would you like to start with?

1. **Backend Health Check** (Recommended - easiest)
2. **Desktop App**
3. **Mobile App**
4. **All Tests**

---

*Created: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")*
