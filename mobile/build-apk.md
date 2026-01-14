# Build FamBudget APK for Android

## Quick Build Options

### Option 1: EAS Build (Recommended - Cloud Build)

This uses Expo's cloud build service. Best for production builds.

#### Setup EAS

```bash
cd mobile
npm install -g eas-cli
eas login
eas build:configure
```

#### Build APK

```bash
# Development APK (for testing)
eas build --platform android --profile development

# Production APK (for release)
eas build --platform android --profile production
```

### Option 2: Local Build (Expo Prebuild)

For local builds, you'll need Android Studio and the Android SDK.

#### Prerequisites

1. **Install Android Studio:** https://developer.android.com/studio
2. **Install Android SDK:**
   - Open Android Studio
   - Tools → SDK Manager
   - Install Android SDK Platform 33 or higher
   - Install Android SDK Build-Tools

3. **Set Environment Variables:**
   ```bash
   # Windows PowerShell
   $env:ANDROID_HOME = "C:\Users\YourUser\AppData\Local\Android\Sdk"
   $env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"
   ```

#### Build Steps

```bash
cd mobile

# Install dependencies
npm install

# Generate native Android project
npx expo prebuild --platform android

# Build APK (debug)
cd android
.\gradlew assembleDebug

# APK will be at: android/app/build/outputs/apk/debug/app-debug.apk

# Build APK (release - requires signing)
.\gradlew assembleRelease
```

### Option 3: Expo Build (Legacy - Deprecated)

```bash
cd mobile
npx expo build:android -t apk
```

**Note:** This method is deprecated but may still work.

## Configuration

### Update app.json

Ensure Android configuration is correct:

```json
{
  "expo": {
    "android": {
      "package": "com.fambudget.app",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1565C0"
      },
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

## Required Assets

Make sure these exist in `mobile/assets/`:
- `icon.png` (1024x1024px)
- `adaptive-icon.png` (1024x1024px)
- `splash.png` (1284x2778px recommended)

## Signing APK (for Release)

For production release, you need to sign your APK:

1. Generate keystore:
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Create `android/keystore.properties`:
   ```
   MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
   MYAPP_RELEASE_KEY_ALIAS=my-key-alias
   MYAPP_RELEASE_STORE_PASSWORD=yourpassword
   MYAPP_RELEASE_KEY_PASSWORD=yourpassword
   ```

3. Update `android/app/build.gradle` to use keystore

## Output Location

- **EAS Build:** Download from Expo dashboard
- **Local Debug:** `android/app/build/outputs/apk/debug/app-debug.apk`
- **Local Release:** `android/app/build/outputs/apk/release/app-release.apk`

## Troubleshooting

### Issue: "SDK location not found"
- Set ANDROID_HOME environment variable
- Verify Android SDK is installed

### Issue: "Gradle sync failed"
- Update Gradle wrapper
- Check internet connection for dependencies

### Issue: "Build failed"
- Check app.json configuration
- Verify all required assets exist
- Check Android SDK version compatibility

