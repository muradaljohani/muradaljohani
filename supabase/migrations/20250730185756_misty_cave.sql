/*
  # إنشاء قاعدة البيانات الأساسية

  1. الجداول الجديدة
    - `user_profiles` - ملفات المستخدمين الشخصية
    - `game_scores` - نتائج الألعاب وأفضل النقاط
    - `favorite_sites` - المواقع المفضلة للمستخدمين
    - `user_reflections` - تأملات ويوميات المستخدمين
    - `user_achievements` - إنجازات المستخدمين
    - `user_challenges` - التحديات المكتملة
    - `user_stats` - إحصائيات عامة للمستخدمين

  2. الأمان
    - تفعيل RLS على جميع الجداول
    - إضافة سياسات للوصول الآمن للبيانات
    - حماية بيانات المستخدمين

  3. الفهارس
    - فهارس لتحسين الأداء
    - فهارس للاستعلامات الشائعة
*/

-- إنشاء جدول ملفات المستخدمين الشخصية
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  points INTEGER DEFAULT 0,
  total_games_played INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء جدول نتائج الألعاب
CREATE TABLE IF NOT EXISTS game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL, -- 'math', 'memory', 'word', 'color', 'number_guess'
  score INTEGER NOT NULL DEFAULT 0,
  best_time INTEGER DEFAULT NULL, -- بالثواني
  attempts INTEGER DEFAULT NULL,
  difficulty TEXT DEFAULT 'normal',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء جدول المواقع المفضلة
CREATE TABLE IF NOT EXISTS favorite_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id TEXT NOT NULL,
  site_name TEXT NOT NULL,
  site_url TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء جدول التأملات واليوميات
CREATE TABLE IF NOT EXISTS user_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT DEFAULT '',
  content TEXT NOT NULL,
  reflection_type TEXT DEFAULT 'general', -- 'achievement', 'gratitude', 'general'
  mood INTEGER DEFAULT 5, -- 1-10 scale
  tags TEXT[] DEFAULT '{}',
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء جدول الإنجازات
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  points_earned INTEGER DEFAULT 0,
  badge_icon TEXT DEFAULT '🏆',
  unlocked_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء جدول التحديات المكتملة
CREATE TABLE IF NOT EXISTS user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  challenge_type TEXT NOT NULL, -- 'daily', 'weekly', 'special'
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  points_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  date_completed DATE DEFAULT CURRENT_DATE
);

-- إنشاء جدول الإحصائيات العامة
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stat_name TEXT NOT NULL,
  stat_value INTEGER DEFAULT 0,
  stat_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- تفعيل Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للملفات الشخصية
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- سياسات الأمان لنتائج الألعاب
CREATE POLICY "Users can view own game scores"
  ON game_scores
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game scores"
  ON game_scores
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- سياسات الأمان للمواقع المفضلة
CREATE POLICY "Users can manage own favorite sites"
  ON favorite_sites
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- سياسات الأمان للتأملات
CREATE POLICY "Users can manage own reflections"
  ON user_reflections
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- سياسات الأمان للإنجازات
CREATE POLICY "Users can view own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- سياسات الأمان للتحديات
CREATE POLICY "Users can manage own challenges"
  ON user_challenges
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- سياسات الأمان للإحصائيات
CREATE POLICY "Users can manage own stats"
  ON user_stats
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_user_id ON game_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_game_type ON game_scores(game_type);
CREATE INDEX IF NOT EXISTS idx_favorite_sites_user_id ON favorite_sites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reflections_user_id ON user_reflections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user_id ON user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);

-- فهارس للتواريخ
CREATE INDEX IF NOT EXISTS idx_game_scores_created_at ON game_scores(created_at);
CREATE INDEX IF NOT EXISTS idx_user_reflections_created_at ON user_reflections(created_at);
CREATE INDEX IF NOT EXISTS idx_user_challenges_date_completed ON user_challenges(date_completed);

-- فهارس مركبة للاستعلامات الشائعة
CREATE INDEX IF NOT EXISTS idx_game_scores_user_game_type ON game_scores(user_id, game_type);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user_date ON user_challenges(user_id, date_completed);

-- دالة لتحديث timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- تطبيق دالة التحديث على الجداول المناسبة
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_reflections_updated_at
  BEFORE UPDATE ON user_reflections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();