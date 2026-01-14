# Fix Gradle Build Errors

## Current Errors

1. **Plugin [id: 'expo-module-gradle-plugin'] was not found**
2. **Could not get unknown property 'release' for SoftwareComponent**

## Solution: Use Android Studio

The Gradle configuration issues are complex and related to Expo modules integration. **Android Studio** will automatically:
- Fix Gradle sync issues
- Download missing dependencies
- Configure plugin repositories
- Resolve module conflicts

### Steps

1. **Open Android Studio**
2. **File → Open** → Select `mobile/android` folder
3. **Wait for sync** (Android Studio will fix issues automatically)
4. **Build → Build Bundle(s) / APK(s) → Build APK(s)**

Android Studio's auto-sync will resolve the expo-module-gradle-plugin configuration.

## Alternative: Manual Fix (Advanced)

If you want to fix manually, you need to:

1. **Ensure expo-modules-core is properly linked:**
   ```powershell
   cd mobile
   npx expo install expo-modules-core
   ```

2. **Check settings.gradle includes the plugin:**
   The `useExpoModules()` should include the plugin build

3. **Clean and rebuild:**
   ```powershell
   cd android
   .\gradlew clean
   .\gradlew assembleDebug
   ```

## Recommendation

**Use Android Studio** - it's the easiest and most reliable solution. The errors you're seeing are common with Expo projects and Android Studio's auto-sync will fix them automatically.

