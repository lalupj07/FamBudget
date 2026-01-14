# 📱 Build APK Using Android Studio

## ✅ What's Already Done

- ✅ Dependencies installed
- ✅ Native Android project generated (`android/` folder)
- ✅ Assets created (icon, adaptive-icon, splash)
- ✅ Gradle project structure ready

## 🚀 Steps to Build APK

### Step 1: Open Android Studio

1. **Launch Android Studio**
2. **Click:** "Open" (or File → Open)
3. **Navigate to:** `C:\Users\lalup\OneDrive\Desktop\Project Cipher\FamBudget\mobile\android`
4. **Click:** OK

### Step 2: Wait for Sync

- Android Studio will automatically:
  - Sync Gradle files
  - Download dependencies
  - Configure build settings
  - This takes 2-5 minutes

### Step 3: Build APK

**Method 1: Via Menu**
1. **Click:** Build menu
2. **Select:** Build Bundle(s) / APK(s)
3. **Click:** Build APK(s)
4. **Wait** for build to complete (~5-10 minutes)

**Method 2: Via Terminal (in Android Studio)**
1. **Open:** Terminal tab (bottom)
2. **Run:**
   ```powershell
   .\gradlew assembleDebug
   ```

### Step 4: Find Your APK

**Location:**
```
mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

**Full Path:**
```
C:\Users\lalup\OneDrive\Desktop\Project Cipher\FamBudget\mobile\android\app\build\outputs\apk\debug\app-debug.apk
```

### Step 5: Install APK

1. **Transfer APK** to your Android device:
   - Via USB (enable USB debugging)
   - Via email/cloud storage
   - Via ADB: `adb install app-debug.apk`

2. **On Device:**
   - Open APK file
   - Allow installation from unknown sources (if prompted)
   - Install

## 🔧 Troubleshooting

### Issue: "Gradle Sync Failed"
- **Solution:** Click "Sync Now" button
- Or: File → Sync Project with Gradle Files

### Issue: "SDK Not Found"
- **Solution:** Tools → SDK Manager → Install Android SDK Platform 33+

### Issue: "Build Failed"
- **Solution:** 
  1. Build → Clean Project
  2. Build → Rebuild Project
  3. Try again

## ✅ Quick Summary

1. Open Android Studio
2. Open `mobile/android` folder
3. Wait for sync
4. Build → Build APK(s)
5. Find APK in outputs folder
6. Install on device

---

**That's it! Your APK will be ready in a few minutes! 🎉**

