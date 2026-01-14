# Debug Your Web App

## What to Check

### 1. Open Browser Console

Press `F12` or `Right-click → Inspect → Console tab`

### 2. Look for These Messages

You should see:
- ✅ `"HTML loaded, waiting for app.js..."`
- ✅ `"FamBudget app.js loaded"`
- ✅ `"Initializing FamBudget app..."`
- ✅ `"FamBudget app initialized successfully"`

### 3. If You See Errors

**Red errors** mean JavaScript failed. Share the error message.

**Common errors:**
- `ReferenceError: FamBudgetApp is not defined` - App class not loaded
- `TypeError: Cannot read property...` - Something is undefined
- `SyntaxError` - JavaScript syntax error

### 4. Test If App Initialized

In the console, type:
```javascript
window.app
```

If you see an object, the app initialized! ✅

If you see `undefined`, the app didn't initialize. ❌

### 5. Manual Initialization Test

Try manually initializing:
```javascript
window.app = new FamBudgetApp();
```

If this works, the app class is fine. The problem is automatic initialization.

## Quick Fixes

### If Nothing Works:

1. **Clear browser cache**:
   - Press `Ctrl+Shift+Delete`
   - Select "Cached images and files"
   - Click "Clear data"

2. **Hard refresh**:
   - Press `Ctrl+F5` or `Ctrl+Shift+R`

3. **Check if JavaScript is enabled**:
   - Settings → Privacy → Site settings → JavaScript (should be ON)

### Check Your URL

Make sure you're visiting:
```
https://lalupj07.github.io/FamBudget
```

NOT:
- `https://lalupj07.github.io/FamBudget/index.html` ❌
- Any other path ❌

## What to Share

If it's still not working, share:
1. What you see in the browser console (any messages or errors)
2. What happens when you type `window.app` in console
3. Screenshot of the console if possible

