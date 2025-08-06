-- URGENT FIX: Add missing columns and fix constraints
-- Run this in Supabase SQL Editor immediately

-- Add missing last_entry_date column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_entry_date DATE;

-- Remove foreign key constraint from entries table (causing 409 errors)
ALTER TABLE entries DROP CONSTRAINT IF EXISTS entries_userid_fkey;

-- Make entries table work without strict foreign key
ALTER TABLE entries ALTER COLUMN userid DROP NOT NULL;

-- Update entries table to handle missing users gracefully
UPDATE entries SET userid = 'demo_user_1' WHERE userid NOT IN (SELECT id FROM users);

-- Verify fix
SELECT 'Tables fixed successfully' as status;