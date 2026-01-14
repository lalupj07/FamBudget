# Build APK Locally

## Prerequisites

### Required Software

1. **Android Studio** (with Android SDK)
   - Download: https://developer.android.com/studio
   - Install Android SDK Platform 33+ (Tools → SDK Manager)
   - Install Android SDK Build-Tools

2. **Java JDK 11 or 17**
   - Usually comes with Android Studio

3. **Set Environment Variables** (Windows)
   
   ```powershell
   # Set ANDROID_HOME (usually one of these locations):
   $env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
   # OR
   $env:ANDROID_HOME = "C:\Program Files\Android\Android Studio\sdk"
   
   # Add to PATH
   $env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\tools\bin"
   
   # Make permanent (run in PowerShell as Admin):
   [System.Environment]::SetEnvironmentVariable("ANDROID_HOME", $env:ANDROID_HOME, "User")
   ```

## Build Steps

### Step 1: Install Dependencies

```powershell
cd mobile
npm install
```

### Step 2: Generate Native Android Project

```powershell
npx expo prebuild --platform android
```

This creates the `android/` folder with native Android project.

### Step 3: Build Debug APK (No Signing Required)

```powershell
cd android
.\gradlew assembleDebug
```

**Output location:**
```
android\app\build\outputs\apk\debug\app-debug.apk
```

### Step 4: Build Release APK (Requires Signing)

For release builds, you need to sign the APK:

1. **Generate keystore:**
   ```powershell
   keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Create `android/keystore.properties`:**
   ```
   MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
   MYAPP_RELEASE_KEY_ALIAS=my-key-alias
   MYAPP_RELEASE_STORE_PASSWORD=yourpassword
   MYAPP_RELEASE_KEY_PASSWORD=yourpassword
   ```

3. **Update `android/app/build.gradle`:**
   Add signing config section

4. **Build release:**
   ```powershell
   cd android
   .\gradlew assembleRelease
   ```

## Quick Start (If Android Studio Installed)

```powershell
cd mobile
npm install
npx expo prebuild --platform android
cd android
.\gradlew assembleDebug
```

APK will be at: `android\app\build\outputs\apk\debug\app-debug.apk`

## Troubleshooting

### Error: "SDK location not found"
- Set ANDROID_HOME environment variable
- Verify Android SDK is installed

### Error: "Gradle sync failed"
- Check internet connection
- Try: `cd android && .\gradlew clean`

### Error: "Command not found: gradlew"
- Make sure you're in the `android/` directory
- On Windows, use `.\gradlew` or `gradlew.bat`

