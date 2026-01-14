# How to Get Your Microsoft Partner Center Publisher Name

## Step 1: Access Partner Center

1. Go to: https://partner.microsoft.com/dashboard
2. Sign in with your Microsoft account

## Step 2: Find Your Publisher Name

1. Click on **Account Settings** (gear icon at top right)
2. Navigate to **Developer Account** or **Account Settings**
3. Find **Publisher Display Name** or **Publisher Identity**
4. Copy the exact publisher name (e.g., `CN=Your Company Name, O=Your Company, C=US`)

## Step 3: Update package.json

Once you have your publisher name from Partner Center:

1. Open `desktop-app/package.json`
2. Find the `appx` section
3. Update the `publisher` field to match exactly:

```json
{
  "appx": {
    "publisher": "CN=Your Exact Publisher Name from Partner Center"
  }
}
```

## Example

If your Partner Center publisher is: `CN=My Company, O=My Company Inc, L=City, S=State, C=US`

Then in `package.json`:
```json
{
  "appx": {
    "publisher": "CN=My Company, O=My Company Inc, L=City, S=State, C=US"
  }
}
```

## ⚠️ Important

- The publisher name **MUST match exactly** what's in Partner Center
- Even small differences (spacing, capitalization) will cause certification to fail
- Rebuild the package after updating the publisher name

