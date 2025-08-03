-- Fix Supabase RLS (Row Level Security) Issues
-- Run this in Supabase SQL Editor

-- Disable RLS for development (allows full access)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE entries DISABLE ROW LEVEL SECURITY;

-- Alternative: Enable RLS with permissive policies
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
-- CREATE POLICY "Allow all operations on entries" ON entries FOR ALL USING (true);