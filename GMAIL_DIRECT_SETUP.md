# 📧 Direct Gmail Integration Setup

## Option A: EmailJS (Current - Easier)
- ✅ No server needed
- ✅ Works in browser
- ✅ 200 emails/month free
- ❌ Limited customization

## Option B: Direct Gmail (Advanced)
- ✅ Full control over emails
- ✅ Unlimited emails
- ❌ Requires backend server
- ❌ More complex setup

## Gmail App Password Setup

### Step 1: Enable 2FA on Gmail
1. Go to Google Account settings
2. Enable 2-Factor Authentication

### Step 2: Generate App Password
1. Go to **Security** → **App passwords**
2. Select **Mail** and **Other**
3. Name it "SkillForge App"
4. Copy the 16-character password

### Step 3: Backend Email Service
```javascript
// server/emailService.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password' // 16-char app password
  }
});

export const sendWelcomeEmail = async (userEmail, userName) => {
  await transporter.sendMail({
    from: 'your-email@gmail.com',
    to: userEmail,
    subject: '🎉 Welcome to SkillForge!',
    html: `
      <h1>Welcome ${userName}!</h1>
      <p>Your learning journey starts now...</p>
    `
  });
};
```

## Recommendation
**Stick with EmailJS for now** because:
- Works immediately without backend
- Perfect for hackathon demo
- Can upgrade to direct Gmail later