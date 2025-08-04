-- SkillForge Learning Platform Database Schema
-- This schema supports the comprehensive learning platform with courses, workshops, community, and gamification

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (existing, enhanced)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  total_points INTEGER DEFAULT 0,
  level VARCHAR(20) DEFAULT 'Beginner',
  learning_streak INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course enrollments
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id VARCHAR(100) NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active', -- active, completed, dropped
  completed_at TIMESTAMP WITH TIME ZONE,
  final_score INTEGER,
  UNIQUE(user_id, course_id)
);

-- Lesson progress tracking
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id VARCHAR(100) NOT NULL,
  module_id INTEGER NOT NULL,
  lesson_id INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent INTEGER DEFAULT 0, -- in seconds
  UNIQUE(user_id, course_id, module_id, lesson_id)
);

-- Quiz submissions
CREATE TABLE IF NOT EXISTS quiz_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id VARCHAR(100) NOT NULL,
  module_id INTEGER NOT NULL,
  lesson_id INTEGER NOT NULL,
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attempt_number INTEGER DEFAULT 1
);

-- Workshop registrations
CREATE TABLE IF NOT EXISTS workshop_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  workshop_id VARCHAR(100) NOT NULL,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'registered', -- registered, attended, cancelled
  attended BOOLEAN DEFAULT FALSE,
  attended_at TIMESTAMP WITH TIME ZONE,
  feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  feedback_comment TEXT,
  UNIQUE(user_id, workshop_id)
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- course_completion, workshop_attendance, skill_mastery, learning_streak
  title VARCHAR(255) NOT NULL,
  description TEXT,
  metadata JSONB,
  nft_token_id VARCHAR(100),
  nft_serial_number VARCHAR(50),
  blockchain_hash VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending', -- pending, issued, failed
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum categories (could be managed in code, but stored for flexibility)
CREATE TABLE IF NOT EXISTS forum_categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  color VARCHAR(20),
  post_count INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum posts
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id VARCHAR(50) REFERENCES forum_categories(id),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum replies
CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  parent_reply_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum post likes
CREATE TABLE IF NOT EXISTS forum_post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Forum reply likes
CREATE TABLE IF NOT EXISTS forum_reply_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, reply_id)
);

-- Forum reports (for moderation)
CREATE TABLE IF NOT EXISTS forum_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_type VARCHAR(20) NOT NULL, -- post, reply
  content_id UUID NOT NULL,
  reason VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, reviewed, resolved
  moderator_id UUID REFERENCES users(id),
  moderator_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- User points tracking
CREATE TABLE IF NOT EXISTS user_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- courseCompletion, quizPassed, workshopAttendance, etc.
  points INTEGER NOT NULL,
  details JSONB,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id VARCHAR(100) NOT NULL,
  achievement_name VARCHAR(255) NOT NULL,
  points_awarded INTEGER NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- User badges (existing table, enhanced)
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_type VARCHAR(50) NOT NULL,
  badge_name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_url TEXT,
  rarity VARCHAR(20) DEFAULT 'common', -- common, uncommon, rare, legendary
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  blockchain_hash VARCHAR(255),
  nft_token_id VARCHAR(100)
);

-- Learning entries (existing table)
CREATE TABLE IF NOT EXISTS learning_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  date_completed DATE NOT NULL,
  blockchain_hash VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions (for tracking activity)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in seconds
  pages_visited TEXT[],
  activities JSONB
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_course ON lesson_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_user_id ON workshop_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_user ON forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_replies_post ON forum_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_users_total_points ON users(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_users_learning_streak ON users(learning_streak DESC);

-- Insert default forum categories
INSERT INTO forum_categories (id, name, description, icon, color) VALUES
  ('general', 'General Discussion', 'General discussions about learning and development', '💬', 'blue'),
  ('react', 'React & Frontend', 'Discussions about React, JavaScript, and frontend development', '⚛️', 'cyan'),
  ('python', 'Python & Data Science', 'Python programming, data science, and machine learning discussions', '🐍', 'green'),
  ('blockchain', 'Blockchain & Web3', 'Blockchain development, DApps, and cryptocurrency discussions', '⛓️', 'purple'),
  ('career', 'Career & Jobs', 'Career advice, job opportunities, and professional development', '💼', 'orange'),
  ('help', 'Help & Support', 'Get help with courses, technical issues, and platform questions', '🆘', 'red')
ON CONFLICT (id) DO NOTHING;

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON forum_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forum_replies_updated_at BEFORE UPDATE ON forum_replies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_entries_updated_at BEFORE UPDATE ON learning_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update forum post counts
CREATE OR REPLACE FUNCTION update_forum_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE forum_categories SET post_count = post_count + 1, last_activity = NOW() WHERE id = NEW.category_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE forum_categories SET post_count = post_count - 1 WHERE id = OLD.category_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger for forum post count
CREATE TRIGGER update_forum_category_post_count
    AFTER INSERT OR DELETE ON forum_posts
    FOR EACH ROW EXECUTE FUNCTION update_forum_post_count();

-- Function to update reply counts
CREATE OR REPLACE FUNCTION update_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE forum_posts SET reply_count = reply_count + 1, updated_at = NOW() WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE forum_posts SET reply_count = reply_count - 1, updated_at = NOW() WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger for reply count
CREATE TRIGGER update_post_reply_count
    AFTER INSERT OR DELETE ON forum_replies
    FOR EACH ROW EXECUTE FUNCTION update_reply_count();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can access their own data)
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view their own enrollments" ON course_enrollments FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own enrollments" ON course_enrollments FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own enrollments" ON course_enrollments FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own progress" ON lesson_progress FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own progress" ON lesson_progress FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own progress" ON lesson_progress FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own quiz submissions" ON quiz_submissions FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own quiz submissions" ON quiz_submissions FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own workshop registrations" ON workshop_registrations FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own workshop registrations" ON workshop_registrations FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own workshop registrations" ON workshop_registrations FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own certificates" ON certificates FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own certificates" ON certificates FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Forum policies (more open for community interaction)
CREATE POLICY "Anyone can view forum posts" ON forum_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON forum_posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own posts" ON forum_posts FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Anyone can view forum replies" ON forum_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON forum_replies FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own replies" ON forum_replies FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Points and achievements policies
CREATE POLICY "Users can view their own points" ON user_points FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "System can insert points" ON user_points FOR INSERT WITH CHECK (true); -- System-managed

CREATE POLICY "Users can view their own achievements" ON user_achievements FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "System can insert achievements" ON user_achievements FOR INSERT WITH CHECK (true); -- System-managed

CREATE POLICY "Users can view their own badges" ON user_badges FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "System can insert badges" ON user_badges FOR INSERT WITH CHECK (true); -- System-managed

CREATE POLICY "Users can view their own entries" ON learning_entries FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own entries" ON learning_entries FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own entries" ON learning_entries FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete their own entries" ON learning_entries FOR DELETE USING (auth.uid()::text = user_id::text);

-- Views for common queries
CREATE OR REPLACE VIEW user_leaderboard AS
SELECT 
  u.id,
  u.username,
  u.full_name,
  u.avatar_url,
  u.total_points,
  u.level,
  u.learning_streak,
  COUNT(DISTINCT ce.id) as courses_completed,
  COUNT(DISTINCT c.id) as certificates_earned,
  COUNT(DISTINCT wr.id) as workshops_attended,
  COUNT(DISTINCT fp.id) as forum_posts,
  RANK() OVER (ORDER BY u.total_points DESC) as rank
FROM users u
LEFT JOIN course_enrollments ce ON u.id = ce.user_id AND ce.status = 'completed'
LEFT JOIN certificates c ON u.id = c.user_id AND c.status = 'issued'
LEFT JOIN workshop_registrations wr ON u.id = wr.user_id AND wr.attended = true
LEFT JOIN forum_posts fp ON u.id = fp.user_id
GROUP BY u.id, u.username, u.full_name, u.avatar_url, u.total_points, u.level, u.learning_streak
ORDER BY u.total_points DESC;

-- View for course progress
CREATE OR REPLACE VIEW course_progress_view AS
SELECT 
  ce.user_id,
  ce.course_id,
  ce.progress,
  ce.status,
  COUNT(lp.id) as lessons_completed,
  AVG(qs.score) as average_quiz_score
FROM course_enrollments ce
LEFT JOIN lesson_progress lp ON ce.user_id = lp.user_id AND ce.course_id = lp.course_id AND lp.completed = true
LEFT JOIN quiz_submissions qs ON ce.user_id = qs.user_id AND ce.course_id = qs.course_id
GROUP BY ce.user_id, ce.course_id, ce.progress, ce.status;

-- View for forum activity
CREATE OR REPLACE VIEW forum_activity_view AS
SELECT 
  fc.id as category_id,
  fc.name as category_name,
  COUNT(DISTINCT fp.id) as post_count,
  COUNT(DISTINCT fr.id) as reply_count,
  MAX(GREATEST(fp.updated_at, fr.updated_at)) as last_activity
FROM forum_categories fc
LEFT JOIN forum_posts fp ON fc.id = fp.category_id
LEFT JOIN forum_replies fr ON fp.id = fr.post_id
GROUP BY fc.id, fc.name;

COMMENT ON TABLE users IS 'User accounts with gamification data';
COMMENT ON TABLE course_enrollments IS 'User course enrollments and progress';
COMMENT ON TABLE lesson_progress IS 'Individual lesson completion tracking';
COMMENT ON TABLE quiz_submissions IS 'Quiz attempts and scores';
COMMENT ON TABLE workshop_registrations IS 'Workshop registrations and attendance';
COMMENT ON TABLE certificates IS 'Blockchain-verified certificates';
COMMENT ON TABLE forum_posts IS 'Community forum posts';
COMMENT ON TABLE forum_replies IS 'Replies to forum posts';
COMMENT ON TABLE user_points IS 'Point tracking for gamification';
COMMENT ON TABLE user_achievements IS 'Achievement unlocks';
COMMENT ON TABLE user_badges IS 'NFT badges earned by users';
COMMENT ON TABLE learning_entries IS 'User learning milestone entries';