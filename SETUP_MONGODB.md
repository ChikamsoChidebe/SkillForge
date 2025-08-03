# 🚀 MongoDB Atlas Setup for Cross-Device Sync

## Step 1: Create MongoDB Atlas Account
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Sign up for free account
3. Create new cluster (free M0 tier)

## Step 2: Setup Database
1. **Database Name**: `skillforge`
2. **Collections**: 
   - `users` (user profiles)
   - `entries` (learning entries)

## Step 3: Get API Credentials
1. **Choose "Drivers"** from connection options
2. Select **"Node.js"** driver
3. Go to **"Data API"** in left sidebar
4. **Enable Data API**
5. **Create API Key** 
6. **Copy endpoint URL** (looks like: `https://data.mongodb-api.com/app/data-xxxxx/endpoint/data/v1`)

## Step 4: Update Environment Variables
Replace in `.env.local`:
```env
VITE_MONGODB_API_URL=https://data.mongodb-api.com/app/YOUR-APP-ID/endpoint/data/v1
VITE_MONGODB_API_KEY=your-actual-api-key-here
VITE_MONGODB_CLUSTER=Cluster0
```

## Step 5: Test Cross-Device Sync
1. **Phone**: Sign up with email/password
2. **Laptop**: Login with same email/password
3. **Result**: Same data on both devices! 🎉

## Features Enabled:
✅ **Cross-device login** - Same account everywhere  
✅ **Data sync** - Learning entries sync automatically  
✅ **Offline fallback** - Works without internet  
✅ **Real-time updates** - Changes sync in background  

## Security:
- API keys in environment variables only
- No sensitive data in client code
- Automatic fallback to localStorage