# 🚀 Supabase Setup for Cross-Device Sync

## Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for free account
3. Create new project

## Step 2: Create Database Tables ✅ DONE!
**Tables created successfully!** You can see "Success. No rows returned" ✅

### Users Table:
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  fullName TEXT,
  avatar TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  totalEntries INTEGER DEFAULT 0,
  totalBadges INTEGER DEFAULT 0,
  learningStreak INTEGER DEFAULT 0,
  lastEntryDate TIMESTAMP
);
```

### Entries Table:
```sql
CREATE TABLE entries (
  id TEXT PRIMARY KEY,
  userId TEXT REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  transactionId TEXT,
  blockchainStatus TEXT
);
```

## Step 3: Get Credentials ✅ DONE!
**Your Supabase credentials:**
- **URL**: `https://ijptjwzssclsvljbwdrl.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 4: Update Environment ✅ READY!
Add to `.env.local`:
```env
VITE_SUPABASE_URL=https://ijptjwzssclsvljbwdrl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqcHRqd3pzc2Nsc3ZsamJ3ZHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMjY5OTgsImV4cCI6MjA2OTgwMjk5OH0.yoOsAvf-eRIW35_V0lehs8BxmKEKAPj1Hj9GVz-md6c
```

## Step 5: Test Cross-Device Sync
1. **Laptop**: Sign up with email/password
2. **Phone**: Login with same credentials
3. **Result**: Same data on both devices! 🎉

## Features:
✅ **Real database** - PostgreSQL powered
✅ **Cross-device sync** - Works everywhere
✅ **Offline fallback** - localStorage backup
✅ **Free tier** - 50,000 rows, 500MB storage
✅ **Real-time updates** - Instant sync

**Much more reliable than JSONBin!** 🎯