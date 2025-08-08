-- Create learning_entries table
CREATE TABLE IF NOT EXISTS learning_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'learning',
  transaction_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  rarity TEXT DEFAULT 'common',
  token_id TEXT,
  transaction_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_learning_entries_user_id ON learning_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_entries_created_at ON learning_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_created_at ON user_badges(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE learning_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Create policies for learning_entries
CREATE POLICY "Users can view their own learning entries" ON learning_entries
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own learning entries" ON learning_entries
  FOR INSERT WITH CHECK (true);

-- Create policies for user_badges
CREATE POLICY "Users can view their own badges" ON user_badges
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own badges" ON user_badges
  FOR INSERT WITH CHECK (true);