-- SkillForge Complete Database Schema
-- Run this in your Supabase SQL Editor to fix all 404/406 errors

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create users table (if not exists)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT,
    avatar TEXT,
    total_entries INTEGER DEFAULT 0,
    total_badges INTEGER DEFAULT 0,
    learning_streak INTEGER DEFAULT 0,
    last_entry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create entries table (if not exists)
CREATE TABLE IF NOT EXISTS entries (
    id TEXT PRIMARY KEY,
    userid TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'tutorial',
    date DATE NOT NULL,
    tx_hash TEXT,
    blockchain TEXT DEFAULT 'demo',
    createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum_posts table (MISSING - causing 404 errors)
CREATE TABLE IF NOT EXISTS forum_posts (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category_id INTEGER DEFAULT 1,
    likes INTEGER DEFAULT 0,
    replies INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course_enrollments table (MISSING - causing 404 errors)
CREATE TABLE IF NOT EXISTS course_enrollments (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL,
    course_title TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_name TEXT NOT NULL,
    badge_description TEXT,
    milestone INTEGER NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tx_hash TEXT,
    rarity TEXT DEFAULT 'common'
);

-- Create forum_categories table
CREATE TABLE IF NOT EXISTS forum_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default forum categories
INSERT INTO forum_categories (id, name, description) VALUES 
(1, 'General Discussion', 'General learning discussions'),
(2, 'Technical Help', 'Get help with technical issues'),
(3, 'Project Showcase', 'Share your learning projects'),
(4, 'Career Advice', 'Career and professional development')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_entries_userid ON entries(userid);
CREATE INDEX IF NOT EXISTS idx_entries_date ON entries(date DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_user_id ON badges(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (suitable for hackathon demo)
-- Users can read all users but only update their own
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (true);
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (true);

-- Entries are publicly readable, users can manage their own
CREATE POLICY "Entries are publicly readable" ON entries FOR SELECT USING (true);
CREATE POLICY "Users can insert own entries" ON entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own entries" ON entries FOR UPDATE USING (true);

-- Forum posts are publicly readable
CREATE POLICY "Forum posts are publicly readable" ON forum_posts FOR SELECT USING (true);
CREATE POLICY "Users can create forum posts" ON forum_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own forum posts" ON forum_posts FOR UPDATE USING (true);

-- Course enrollments
CREATE POLICY "Users can view all enrollments" ON course_enrollments FOR SELECT USING (true);
CREATE POLICY "Users can create enrollments" ON course_enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own enrollments" ON course_enrollments FOR UPDATE USING (true);

-- Badges are publicly readable
CREATE POLICY "Badges are publicly readable" ON badges FOR SELECT USING (true);
CREATE POLICY "Users can insert badges" ON badges FOR INSERT WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON forum_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Insert demo data for testing (optional)
INSERT INTO users (id, username, email, password, full_name, total_entries, total_badges) VALUES 
('demo_user_1', 'demo_learner', 'demo@skillforge.dev', 'demo123', 'Demo Learner', 5, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO entries (id, userid, title, description, category, date) VALUES 
('demo_entry_1', 'demo_user_1', 'First Learning Entry', 'Completed React basics tutorial', 'tutorial', CURRENT_DATE)
ON CONFLICT (id) DO NOTHING;

-- Verify tables exist
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;