# 🔧 Real Google OAuth Setup

## Step 1: Get Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Add authorized origins:
   - `http://localhost:3000`
   - `https://skillforgehedera.vercel.app`

## Step 2: Update Environment

Replace in `.env`:
```
VITE_GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE.apps.googleusercontent.com
```

## Step 3: Test with Real Accounts

The button will then show real Google accounts logged into the browser.