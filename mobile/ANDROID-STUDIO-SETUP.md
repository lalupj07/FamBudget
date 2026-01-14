# 🚀 Android Studio Setup for FamBudget APK Build

## Step 1: Download and Install Android Studio

### Download
1. Go to: https://developer.android.com/studio
2. Click **Download Android Studio**
3. Download the Windows installer

### Install
1. **Run the installer**
2. **Choose Standard installation** (recommended)
3. **Install components:**
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (optional, for emulator)
4. **Complete installation**
5. **Launch Android Studio**

## Step 2: First Time Setup

When Android Studio opens for the first time:

1. **Welcome Screen:**
   - Click **More Actions** → **SDK Manager**

2. **SDK Manager:**
   - Go to **SDK Platforms** tab
   - Check **Android 13.0 (Tiramisu)** or **Android 14.0 (API 33 or 34)**
   - Click **Apply** and install
   
   - Go to **SDK Tools** tab
   - Ensure these are checked:
     - ✅ Android SDK Build-Tools
     - ✅ Android SDK Platform-Tools
     - ✅ Android SDK Command-line Tools
     - ✅ Google Play services
   - Click **Apply** and install

3. **Wait for installation** (5-10 minutes)

## Step 3: Open Your Project

1. **In Android Studio:**
   - Click **Open** (or File → Open)
   - Navigate to: `C:\Users\lalup\OneDrive\Desktop\Project Cipher\FamBudget\mobile\android`
   - Click **OK**

2. **Android Studio will:**
   - Index the project
   - Sync Gradle files
   - Download dependencies
   - **This takes 5-15 minutes on first open**

## Step 4: Wait for Gradle Sync

You'll see:
- **"Gradle Sync in Progress..."** at the bottom
- Progress bar showing sync status
- **Auto-fixes configuration issues**

### If Sync Fails:
- Click **Sync Now** button (if shown)
- Or: File → Sync Project with Gradle Files

## Step 5: Build APK

Once sync completes (no errors):

### Method 1: Via Menu
1. Click **Build** menu
2. Select **Build Bundle(s) / APK(s)**
3. Click **Build APK(s)**
4. Wait for build (~5-10 minutes)

### Method 2: Via Terminal (in Android Studio)
1. Open **Terminal** tab (bottom of Android Studio)
2. Run:
   ```powershell
   .\gradlew assembleDebug
   ```

## Step 6: Find Your APK

**Location:**
```
mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

**Full Path:**
```
C:\Users\lalup\OneDrive\Desktop\Project Cipher\FamBudget\mobile\android\app\build\outputs\apk\debug\app-debug.apk
```

Android Studio will also show a notification when build completes with a link to locate the APK.

## 🔧 Troubleshooting

### Issue: "SDK location not found"
**Solution:**
- File → Settings → Appearance & Behavior → System Settings → Android SDK
- Set SDK location: `C:\Users\lalup\AppData\Local\Android\Sdk`

### Issue: "Gradle Sync Failed"
**Solution:**
1. File → Invalidate Caches → Invalidate and Restart
2. After restart, File → Sync Project with Gradle Files

### Issue: "Build Failed - Missing Dependencies"
**Solution:**
- Android Studio will auto-download missing dependencies during sync
- Check internet connection
- Wait for sync to complete

### Issue: "NDK not found"
**Solution:**
- SDK Manager → SDK Tools → Check "NDK (Side by side)"
- Install version 25.1.8937393 (as specified in build.gradle)

## ✅ Quick Checklist

- [ ] Android Studio installed
- [ ] Android SDK Platform 33+ installed
- [ ] Android SDK Build-Tools installed
- [ ] Project opened in Android Studio
- [ ] Gradle sync completed successfully
- [ ] APK built successfully

## 🎯 Expected Timeline

- **Android Studio Setup:** 10-15 minutes
- **First Project Sync:** 5-15 minutes
- **First Build:** 5-10 minutes
- **Total:** ~20-40 minutes

---

**Once setup is complete, building APKs will be much faster!** 🚀

