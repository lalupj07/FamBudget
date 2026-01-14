# Backend Testing Instructions

## 🎯 Step 1: Health Check Test (No Database Required)

### Instructions:

**Step 1:** Open PowerShell and navigate to backend folder:
```powershell
cd "C:\Users\lalup\OneDrive\Desktop\GenXis Inc\FamBudget\backend"
```

**Step 2:** Start the backend server:
```powershell
npm run start:dev
```

**Step 3:** Wait for this message:
```
✅ SERVER IS LISTENING!
   URL: http://0.0.0.0:3000
   Health: http://0.0.0.0:3000/health
```

**Step 4:** Open a NEW PowerShell window (keep the server running in the first window) and run:
```powershell
cd "C:\Users\lalup\OneDrive\Desktop\GenXis Inc\FamBudget"
.\test-backend-health.ps1
```

**OR test manually:**
```powershell
Invoke-WebRequest -Uri http://localhost:3000/health
```

**OR open in browser:**
```
http://localhost:3000/health
```

### ✅ Expected Result:
```json
{
  "status": "ok",
  "message": "FamBudget API is running",
  "timestamp": "2025-01-13T...",
  "uptime": 5.123
}
```

---

## 🔌 Step 2: Full Backend Test (With Database)

**Prerequisites:**
- PostgreSQL installed and running
- Database `fambudget` created
- `.env` file configured with database credentials

### Setup Database (if not done):

1. **Install PostgreSQL** (if needed):
   - Download: https://www.postgresql.org/download/windows/

2. **Create Database:**
   ```sql
   CREATE DATABASE fambudget;
   ```

3. **Check `.env` file** in `backend/` folder has:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=fambudget
   JWT_SECRET=your-secret-key-here
   ENCRYPTION_KEY=your-32-character-encryption-key
   NODE_ENV=development
   PORT=3000
   ```

### Test Full Backend:

**Step 1:** Start backend (if not running):
```powershell
cd backend
npm run start:dev
```

**Step 2:** Test Registration (in new PowerShell):
```powershell
$body = @{
    email = "test@example.com"
    password = "test123"
    name = "Test User"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri http://localhost:3000/auth/register `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

$response.Content
```

**Step 3:** Test Login:
```powershell
$body = @{
    email = "test@example.com"
    password = "test123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri http://localhost:3000/auth/login `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

$response.Content
```

**Expected:** JSON with `access_token` field

---

## 📋 Test Checklist

### Health Check:
- [ ] Server starts without errors
- [ ] Health endpoint returns `"status": "ok"`
- [ ] Response includes timestamp and uptime

### Full Backend Test:
- [ ] Database connection successful (no errors in server logs)
- [ ] User registration works
- [ ] User login works
- [ ] JWT token received
- [ ] Can use token for authenticated requests

---

## 🐛 Troubleshooting

### Server Won't Start:
- Check Node.js version: `node --version` (need 18+)
- Check dependencies: `npm install` in backend folder
- Check `.env` file exists
- Check port 3000 not in use: `netstat -ano | findstr :3000`

### Health Endpoint Not Working:
- Wait for server to fully start
- Check server terminal for errors
- Try browser instead of PowerShell
- Check firewall settings

### Database Connection Failed:
- Check PostgreSQL is running
- Check database exists: `psql -U postgres -l`
- Check `.env` credentials match PostgreSQL
- Check PostgreSQL is accepting connections

---

## ✅ Success Criteria

**Health Check:**
- ✅ Server starts
- ✅ Health endpoint accessible
- ✅ Returns valid JSON

**Full Test:**
- ✅ Database connects
- ✅ Can register user
- ✅ Can login
- ✅ Receives JWT token
- ✅ Token can be used for auth

---

*Ready to test! Start with Step 1 (Health Check)*
