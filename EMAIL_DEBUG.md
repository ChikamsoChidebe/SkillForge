# 🔍 Email Debug Guide

## Current Issue
Netlify function returns 400 Bad Request when trying to send emails via Resend API.

## Possible Causes & Solutions

### 1. **API Key Issues**
- **Problem**: Invalid or missing API key
- **Check**: Verify `RESEND_API_KEY` in Netlify environment variables
- **Solution**: Ensure key starts with `re_` and is exactly: `re_182Ve4zV_NwzabtQkVwm61jdFUaQLxBz6`

### 2. **Domain Verification**
- **Problem**: Resend requires domain verification for custom emails
- **Current**: Using `onboarding@resend.dev` (should work)
- **Alternative**: Try `noreply@resend.dev`

### 3. **Rate Limiting**
- **Problem**: Too many requests to Resend API
- **Solution**: Wait a few minutes and try again

### 4. **API Key Permissions**
- **Problem**: API key doesn't have email sending permissions
- **Solution**: Check Resend dashboard for key permissions

## Debug Steps

### Step 1: Check Netlify Function Logs
1. Go to Netlify dashboard
2. **Functions** tab → **send-email**
3. Check recent invocations for error details

### Step 2: Test API Key Manually
```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer re_182Ve4zV_NwzabtQkVwm61jdFUaQLxBz6' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "SkillForge <onboarding@resend.dev>",
    "to": ["test@example.com"],
    "subject": "Test Email",
    "html": "<p>Test message</p>"
  }'
```

### Step 3: Alternative Email Service
If Resend continues failing, we can switch to:
- **EmailJS** (browser-based)
- **Formspree** (form-based)
- **Console-only** (development)

## Quick Fix Options

### Option A: Disable Email Temporarily
```javascript
// In LogEntryForm.jsx, comment out email sending:
// await realEmailService.sendBadgeUnlockedEmail(...)
```

### Option B: Use Console-Only Mode
The app already falls back to beautiful console previews when email fails.

### Option C: Switch to Different Domain
Try changing the "from" address in the Netlify function:
```javascript
from: 'SkillForge <noreply@resend.dev>'
```

## Expected Behavior After Fix

### Success:
```
✅ Real email sent via Netlify + Resend!
📧 Email ID: [resend-email-id]
```

### Current (Fallback):
```
📧 ✨ EMAIL PREVIEW (Development) ✨
📬 To: eugochukwu0606@gmail.com
📝 Subject: 🏆 Badge Unlocked: First Steps!
```

The app works perfectly even without email - users still get badge notifications and all functionality works. Email is just a nice-to-have feature! 📧