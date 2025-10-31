# 🎉 Welcome to FamBudget!

## 🪟 For Windows Users - START HERE!

### Quick Start (3 Steps - 5 Minutes)

1. **Install Prerequisites**
   - [Node.js](https://nodejs.org/) - Download and install
   - [PostgreSQL](https://www.postgresql.org/download/windows/) - Download and install

2. **Run Setup**
   - Double-click `setup-windows.bat`
   - Edit `backend\.env` with your PostgreSQL password

3. **Start App**
   - Double-click `start-all.bat`
   - Scan QR code with Expo Go app on your phone!

**That's it! You're running FamBudget!** 🚀

---

## 📚 Documentation Guide

**New to the project?** Read in this order:

1. **[README.md](./README.md)** - Project overview and features
2. **[WINDOWS_QUICKSTART.md](./WINDOWS_QUICKSTART.md)** - Windows quick start (3 steps)
3. **[SETUP_WINDOWS.md](./SETUP_WINDOWS.md)** - Detailed Windows setup guide

**Want more details?**

4. **[FEATURES.md](./FEATURES.md)** - Complete feature list
5. **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Technical overview
6. **[SETUP.md](./SETUP.md)** - General setup (all platforms)

**Ready to deploy?**

7. **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide

**Want to contribute?**

8. **[CONTRIBUTING.md](./CONTRIBUTING.md)** - How to contribute

**Final notes:**

9. **[FINAL_NOTES.md](./FINAL_NOTES.md)** - Development summary & next steps

---

## 🎯 What You Can Do Right Now

### Try Demo Data
```bash
cd backend
npm run seed
```
Login with:
- **Email:** alex@demofamily.com
- **Password:** demo123456

### Features to Test
- ✅ Register new account
- ✅ Create budget envelopes
- ✅ Add transactions
- ✅ Create accounts
- ✅ Transfer money
- ✅ Set goals
- ✅ View reports with charts
- ✅ Export to CSV/PDF

---

## 📱 What's Included

### Backend (NestJS + PostgreSQL)
- ✅ Full REST API with 25+ endpoints
- ✅ JWT authentication
- ✅ 8 database entities
- ✅ CSV/PDF export
- ✅ Transaction management
- ✅ Account transfers
- ✅ Reports & analytics

### Mobile App (React Native + Expo)
- ✅ Beautiful Material Design UI
- ✅ 8 complete screens
- ✅ Real-time budget sliders
- ✅ Interactive charts
- ✅ Account management
- ✅ Goal tracking
- ✅ Transaction filtering

### Windows Support
- ✅ One-click setup script
- ✅ One-click start script
- ✅ Comprehensive Windows guides
- ✅ Troubleshooting help
- ✅ PowerShell commands

---

## 🎨 Screenshots Preview

### Dashboard
- Combined balance view
- Budget overview cards
- Category progress bars
- Quick actions

### Budget Planner
- Interactive percentage sliders
- Real-time preview
- Over-budget warnings
- Category cards with colors

### Transactions
- Timeline view
- Category filtering
- Quick add modal
- Visual icons

### Reports
- Pie charts (category breakdown)
- Line charts (5-month trends)
- Bar charts (spending analysis)
- Insights & tips

### Accounts
- Multiple account cards
- Joint & personal accounts
- Transfer functionality
- Quick deposit/withdraw

### Goals
- Progress bars
- Target tracking
- Contributor support
- Deadline monitoring

---

## 🔧 Project Structure

```
FamBudget/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── entities/    # Database models
│   │   ├── modules/     # Feature modules
│   │   └── main.ts
│   └── package.json
├── mobile/              # React Native app
│   ├── src/
│   │   ├── screens/    # UI screens
│   │   ├── navigation/ # Navigation
│   │   └── theme.ts    # Design system
│   └── package.json
├── setup-windows.bat    # 🪟 One-click setup
├── start-all.bat        # 🪟 One-click start
├── start-backend.bat    # Backend only
├── start-mobile.bat     # Mobile only
└── [Documentation files]
```

---

## ✅ System Requirements

### Minimum
- **OS:** Windows 10/11, macOS 10.15+, Ubuntu 20.04+
- **Node.js:** 18.0 or higher
- **PostgreSQL:** 14.0 or higher
- **RAM:** 4GB (8GB recommended)
- **Storage:** 2GB free space

### For Mobile Development
- **Android:** Android Studio + Emulator OR Physical device
- **iOS:** Xcode + Simulator (Mac only) OR Physical device
- **Expo Go:** Install on your phone for easiest testing

---

## 🎓 Learning Path

### Beginner Path
1. Run the app with demo data
2. Explore all screens
3. Try adding transactions
4. Adjust budget sliders
5. View reports

### Developer Path
1. Read backend code structure
2. Understand database schema
3. Review API endpoints
4. Explore mobile components
5. Study navigation flow

### Advanced Path
1. Add new features
2. Customize theme
3. Deploy to production
4. Set up CI/CD
5. Add integrations

---

## 💡 Pro Tips

### Development
- Backend auto-reloads on save
- Mobile hot-reloads (shake for dev menu)
- Use VS Code for best experience
- Install recommended extensions

### Windows
- Use Windows Terminal (better than CMD)
- Keep both services running in separate windows
- Check firewall if mobile can't connect
- Use your IP address for physical devices

### Debugging
- Check backend logs in terminal
- Use React Native Debugger
- Enable remote JS debugging
- Check PostgreSQL logs in pgAdmin

---

## 🆘 Common Issues

### ❌ "Port 3000 already in use"
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### ❌ "Cannot connect to database"
- Check PostgreSQL is running
- Verify password in `backend\.env`
- Ensure database `fambudget` exists

### ❌ "Mobile app won't load"
- Check backend is running
- Verify API_URL in `mobile\src\services\api.ts`
- Ensure phone and PC on same WiFi
- Try tunnel mode: `npm start -- --tunnel`

### ❌ "Module not found"
```powershell
rm -r node_modules
npm install
```

---

## 🎯 Next Steps

1. **Try it:** Run the app and explore
2. **Customize:** Change theme colors, add features
3. **Test:** Get feedback from family/friends
4. **Deploy:** Put it online (see DEPLOYMENT.md)
5. **Share:** Show off your work!

---

## 📞 Get Help

- **Setup Issues:** See [SETUP_WINDOWS.md](./SETUP_WINDOWS.md)
- **Feature Questions:** See [FEATURES.md](./FEATURES.md)
- **Deployment:** See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Contributing:** See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 🌟 What's Special About This Project

1. **Complete MVP** - 90%+ features implemented
2. **Production-Ready** - Real-world ready code
3. **Beautiful Design** - Material Design 3
4. **Windows-Optimized** - One-click scripts (unique!)
5. **Well-Documented** - 15+ guide documents
6. **Modern Stack** - TypeScript, NestJS, React Native
7. **Secure** - JWT, bcrypt, validation
8. **Scalable** - Clean architecture

---

## 🚀 You're All Set!

Everything you need is here:
- ✅ Backend API (complete)
- ✅ Mobile app (complete)
- ✅ Database schema (complete)
- ✅ Documentation (comprehensive)
- ✅ Windows scripts (convenient)
- ✅ Demo data (helpful)
- ✅ Export features (CSV/PDF)
- ✅ Charts & reports (beautiful)

**Start with `setup-windows.bat` and you'll be budgeting in 5 minutes!**

---

## 💰 Happy Budgeting!

Built with ❤️ for families who want to manage money together.

**Questions? Check the docs above or dive into the code!**

*Version 1.0.0 MVP - October 2025*

