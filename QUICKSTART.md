# FamBudget - Quick Start Guide 🚀

Get FamBudget running in 5 minutes!

## ⚡ Prerequisites

Make sure you have installed:
- ✅ Node.js (v18+)
- ✅ PostgreSQL (v14+)
- ✅ npm or yarn

## 🎯 5-Minute Setup

### 1️⃣ Install Everything (2 minutes)

```bash
# Clone and install
git clone <your-repo>
cd FamBudget

# Install all dependencies
npm install
cd backend && npm install
cd ../mobile && npm install
cd ..
```

### 2️⃣ Set Up Database (1 minute)

```bash
# Create PostgreSQL database
createdb fambudget

# Or using psql:
psql -U postgres -c "CREATE DATABASE fambudget;"
```

### 3️⃣ Configure Backend (1 minute)

```bash
cd backend

# Create .env file
cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=fambudget

JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRATION=7d

PORT=3000
NODE_ENV=development

ENCRYPTION_KEY=$(openssl rand -base64 32)
EOF
```

### 4️⃣ Start Backend (30 seconds)

```bash
# From backend directory
npm run start:dev
```

✅ Backend running at `http://localhost:3000`

### 5️⃣ Start Mobile App (30 seconds)

Open a new terminal:

```bash
cd mobile

# Update API URL (edit src/services/api.ts if needed)

# Start Expo
npm start
```

✅ Scan QR code with Expo Go app!

## 📱 First Run

1. **Tap "Get Started"** on the onboarding screen
2. **Register** with:
   - Your name
   - Email
   - Household name (e.g., "My Family")
   - Password (8+ characters)
3. **Create Budget** - Tap "Create Default Categories" in Budget tab
4. **Add Transaction** - Tap "+" in Transactions tab
5. **Explore!** 🎉

## 🔧 Common Issues

### ❌ Database Connection Failed
```bash
# Check PostgreSQL is running
brew services list  # Mac
# or
sudo service postgresql status  # Linux

# Restart if needed
brew services restart postgresql  # Mac
sudo service postgresql restart  # Linux
```

### ❌ Can't Connect from Mobile
- **iOS Simulator**: Use `http://localhost:3000`
- **Android Emulator**: Use `http://10.0.2.2:3000`
- **Physical Device**: 
  1. Find your IP: `ifconfig | grep "inet "` (Mac/Linux)
  2. Use `http://YOUR_IP:3000`
  3. Ensure same WiFi network

### ❌ Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9  # Mac/Linux
```

## 🎨 Test Data

Want to see the app in action immediately?

```bash
# Coming soon: seed script
cd backend
npm run seed
```

## 📚 Next Steps

- Read [SETUP.md](./SETUP.md) for detailed setup
- See [README.md](./README.md) for features
- Check [API docs](./backend/README.md) for endpoints

## 💡 Pro Tips

**Backend Development:**
```bash
# Auto-reload on changes
cd backend && npm run start:dev

# View logs
# Logs appear in terminal
```

**Mobile Development:**
```bash
# Clear cache if issues
cd mobile && npm start -- --reset-cache

# iOS Simulator
npm run ios

# Android Emulator
npm run android
```

**Database Management:**
```bash
# View tables
psql fambudget -c "\dt"

# View data
psql fambudget -c "SELECT * FROM households;"

# Reset database
dropdb fambudget && createdb fambudget
# Then restart backend to recreate tables
```

## 🆘 Need Help?

1. Check [SETUP.md](./SETUP.md) for detailed troubleshooting
2. Look at [GitHub Issues](your-repo/issues)
3. Review error messages carefully

## ✨ You're All Set!

Your family budget app is ready. Start tracking expenses and achieving goals together! 💰

---

**Happy Budgeting!** 🎯

