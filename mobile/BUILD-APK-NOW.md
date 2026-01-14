# 🚀 Build APK Now - Manual Steps

Since EAS requires interactive prompts, please run these commands **manually** in your terminal:

## Step-by-Step Build Commands

### Step 1: Configure EAS Project
```powershell
cd mobile
eas build:configure --platform android
```

**When prompted:**
- `Would you like to automatically create an EAS project for @lalu_pj/fambudget?` 
- **Answer: Y** (Yes)

### Step 2: Start the Build
```powershell
eas build --platform android --profile production
```

**When prompted (if any):**
- Choose build profile: **production**
- Confirm build settings: **Y** (Yes)

### Step 3: Wait for Build
- Build runs in the cloud (15-20 minutes)
- You'll get a build URL to track progress
- You'll receive email when complete

### Step 4: Download APK
- Check your Expo dashboard: https://expo.dev/accounts/lalu_pj/projects/fambudget/builds
- Or use the download link from email

---

## Quick Command Sequence

Run these commands one by one:

```powershell
# 1. Configure (answer Y when prompted)
eas build:configure --platform android

# 2. Build (confirm settings when prompted)
eas build --platform android --profile production
```

---

## Alternative: Development Build (Faster)

For testing, you can build a development APK:

```powershell
eas build --platform android --profile development
```

---

## What Happens During Build

1. EAS creates a project (if not exists)
2. Build starts in cloud
3. App gets compiled
4. APK gets packaged
5. Build completes (~15-20 min)
6. You get download link

---

## Troubleshooting

If build fails:
- Check `eas.json` exists
- Verify `app.json` has correct Android config
- Check Expo account has build credits (free tier available)

---

**Ready?** Run the commands above in your terminal! 🚀

