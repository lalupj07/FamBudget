# 🚀 Quick Guide: Build FamBudget APK

## Fastest Method: EAS Build (Recommended)

### Step 1: Install EAS CLI
```powershell
npm install -g eas-cli
```

### Step 2: Login to Expo
```powershell
eas login
```
(If you don't have an Expo account, it will prompt you to create one - it's free!)

### Step 3: Configure EAS
```powershell
cd mobile
eas build:configure
```
This will create `eas.json` if it doesn't exist.

### Step 4: Build APK
```powershell
# For testing/development
eas build --platform android --profile development

# For production release
eas build --platform android --profile production
```

### Step 5: Download APK
- The build will run in the cloud (takes 10-20 minutes)
- You'll get a download link when it's ready
- APK will be available in your Expo dashboard

---

## Alternative: Local Build

If you prefer to build locally (requires Android Studio):

```powershell
cd mobile
npm install
npx expo prebuild --platform android
cd android
.\gradlew assembleDebug
```

APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## Configuration Files Created

✅ `eas.json` - EAS build configuration
✅ `build-apk.md` - Detailed build guide
✅ `build-apk.ps1` - Interactive build script

---

## Quick Start Command

```powershell
cd mobile
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile production
```

That's it! The APK will be ready for download in about 15-20 minutes. 🎉

