# Windows Quick Start ⚡

Get FamBudget running on Windows in 3 steps!

## Step 1: Prerequisites (5 minutes)

### Install Node.js
1. Go to [nodejs.org](https://nodejs.org/)
2. Download "LTS" version for Windows
3. Run installer (keep default options)
4. Verify: Open PowerShell and type:
   ```powershell
   node --version
   ```

### Install PostgreSQL
1. Go to [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Download and run installer
3. Remember your password!
4. Verify: 
   ```powershell
   psql --version
   ```

## Step 2: Setup (2 minutes)

1. **Extract** FamBudget folder to Desktop
2. **Double-click** `setup-windows.bat`
3. **Edit** `backend\.env` with your PostgreSQL password:
   ```
   DB_PASSWORD=your_password_here
   ```

## Step 3: Run (1 minute)

**Double-click** `start-all.bat`

Two windows will open:
- ✅ Backend running at http://localhost:3000
- ✅ Mobile with QR code

## 📱 On Your Phone

1. Install **Expo Go** app
2. Scan the QR code
3. Create your account!

## 🎉 That's It!

You're now running FamBudget!

---

## Need Help?

**Backend won't start?**
- Check PostgreSQL is running (Services)
- Verify password in `backend\.env`

**Mobile won't connect?**
- Ensure phone and PC on same WiFi
- Update IP in `mobile\src\services\api.ts`

**More help:**
- See [SETUP_WINDOWS.md](./SETUP_WINDOWS.md) for detailed guide
- See [README.md](./README.md) for features

---

**Pro Tip:** Use demo data!
```powershell
cd backend
npm run seed
```
Login: alex@demofamily.com / demo123456

**Happy Budgeting! 💰**

