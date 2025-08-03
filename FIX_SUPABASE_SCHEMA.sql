-- Fix Supabase schema to match the app data structure

-- Add missing columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{"theme": "system", "notifications": true, "publicProfile": true}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;

-- Update users table to handle the data structure properly
ALTER TABLE users ALTER COLUMN id TYPE TEXT;
ALTER TABLE users ALTER COLUMN createdAt TYPE TIMESTAMP DEFAULT NOW();

-- Make sure entries table references work properly  
ALTER TABLE entries ALTER COLUMN id TYPE TEXT;
ALTER TABLE entries ALTER COLUMN userId TYPE TEXT;
ALTER TABLE entries ALTER COLUMN createdAt TYPE TIMESTAMP DEFAULT NOW();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_entries_userId ON entries(userId);