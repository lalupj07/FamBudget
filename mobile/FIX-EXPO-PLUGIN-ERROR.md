# Fix Expo Module Gradle Plugin Error

## Problem

Two errors occurring:
1. **Plugin [id: 'expo-module-gradle-plugin'] was not found**
2. **Could not get unknown property 'release' for SoftwareComponent**

## Root Cause

The `expo-modules-core` plugin build is not being included in `settings.gradle`, so Gradle can't find the plugin.

## Solution Applied

I've added the expo-modules-core plugin build to `settings.gradle`:

```gradle
// Include expo-modules-core plugin build
includeBuild(new File(["node", "--print", "require.resolve('expo-modules-core/package.json')"].execute(null, rootDir).text.trim(), "../android"))
```

## Next Steps in Android Studio

1. **Sync Project:**
   - Click **Sync Now** button (if shown)
   - Or: File → Sync Project with Gradle Files

2. **If errors persist:**
   - File → Invalidate Caches → Invalidate and Restart
   - After restart, sync again

3. **Build APK:**
   - Build → Build Bundle(s) / APK(s) → Build APK(s)

## Alternative Solutions

### Option 1: Reinstall Dependencies
```powershell
cd mobile
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path "package-lock.json" -Force
npm install
```

### Option 2: Use EAS Build (Cloud)
Since local builds are complex with Expo, consider using EAS Build:
```powershell
eas build --platform android --profile production
```

### Option 3: Use Development Build
For testing, you can use Expo Go or a development build:
```powershell
npx expo start
```

## Verification

After sync:
- Check for no "Plugin not found" errors
- Check for no "release" property errors
- Gradle sync completes successfully

---

**Status:** ✅ Fixed settings.gradle to include expo-modules-core plugin build

