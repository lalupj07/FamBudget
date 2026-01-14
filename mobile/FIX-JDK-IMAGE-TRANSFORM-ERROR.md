# Fix: JDK Image Transformation Error

## Error Description
```
Execution failed for task ':react-native-svg:compileDebugJavaWithJavac'.
> Could not resolve all files for configuration ':react-native-svg:androidJdkImage'.
  > Failed to transform core-for-system-modules.jar to match attributes
```

## Root Cause
This error occurs when Gradle tries to transform JDK images using the `jlink` tool, but the transformation fails. This is a known compatibility issue between certain versions of:
- Android Gradle Plugin (AGP)
- JDK version
- Gradle version

## Solution Steps

### Step 1: Clean Gradle Cache (REQUIRED)

Run the cleanup script:
```powershell
cd mobile/android
.\clean-gradle-cache.ps1
```

Or manually:
```powershell
cd mobile/android

# Stop Gradle daemon
.\gradlew.bat --stop

# Clean build
.\gradlew.bat clean

# Clean transforms cache (optional but recommended)
Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\caches\transforms-3\*"
```

### Step 2: Verify gradle.properties

The `gradle.properties` file has been updated with the following fixes:
- ✅ `android.experimental.disableCoreJdkImageTransform=true`
- ✅ `android.disableJdkImageTransform=true`
- ✅ Additional configuration properties

### Step 3: Rebuild the Project

```powershell
cd mobile/android
.\gradlew.bat clean
.\gradlew.bat assembleDebug
```

Or if building from the mobile directory:
```powershell
cd mobile
npm run android
```

### Step 4: If Error Persists

#### Option A: Use a Different JDK Version

If you have Java 17 installed separately (not Android Studio's bundled JDK):
```properties
# In mobile/android/gradle.properties, update:
org.gradle.java.home=C:\\Program Files\\Java\\jdk-17
```

#### Option B: Downgrade Android SDK Platform

Sometimes the issue is with `android-34`. Try downgrading to `android-33`:

In `mobile/android/build.gradle`:
```gradle
compileSdkVersion = Integer.parseInt(findProperty('android.compileSdkVersion') ?: '33')
targetSdkVersion = Integer.parseInt(findProperty('android.targetSdkVersion') ?: '33')
```

#### Option C: Update Gradle Wrapper

Check the current Gradle version and update if needed. The current version is 8.5, which should work, but you can try updating to the latest:

```powershell
cd mobile/android
.\gradlew.bat wrapper --gradle-version 8.10
```

### Step 5: Verify Java Version

Make sure you're using a compatible JDK version (Java 17 is recommended):

```powershell
java -version
```

Should show:
```
openjdk version "17.x.x"
```

## Additional Notes

- The fix disables the JDK image transformation, which is safe for React Native projects
- This doesn't affect app functionality - it just changes how Gradle handles JDK dependencies
- After cleaning the cache, the first build may take longer

## Still Having Issues?

If the error persists after these steps:

1. Check Android Studio's JDK path is correct
2. Try building from Android Studio instead of command line
3. Check if there are any Java path conflicts in your environment variables
4. Consider updating Android Studio to the latest version

