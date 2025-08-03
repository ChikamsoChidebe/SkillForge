# 📧 Email Service Setup Guide

## Step 1: Create EmailJS Account
1. Go to [emailjs.com](https://www.emailjs.com/)
2. Sign up for free account
3. Create new email service

## Step 2: Setup Email Service
1. **Choose Email Provider**: Gmail, Outlook, etc.
2. **Connect Your Email**: Follow EmailJS instructions
3. **Get Service ID**: Copy your service ID

## Step 3: Create Email Template ✅ DONE!
**Your template is perfect now:**

✅ **Subject**: `Welcome to SkillForge!`
✅ **To Email**: `{{to_email}}`
✅ **From Name**: `SkillForge`
✅ **Reply To**: `chikamsofavoured@gmail.com`

**Now SAVE the template and copy the Template ID!**

## Step 4: Get Public Key
1. Go to **Account** → **General**
2. Copy your **Public Key**

## Step 5: Update Environment Variables ✅ READY!
Add to `.env.local`:
```env
VITE_EMAILJS_SERVICE_ID=service_shv5hae
VITE_EMAILJS_TEMPLATE_ID=template_ua0fvlr
VITE_EMAILJS_PUBLIC_KEY=5sL-gvSvF0GuBs-PM
```

## Step 6: Test Email
- Sign up for new account
- Should receive welcome email! 📧

**Free tier: 200 emails/month**