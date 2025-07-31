import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.envmuradxxxx.run;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// أنواع البيانات
export interface UserProfile {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string;
  avatar_url: string;
  points: number;
  total_games_played: number;
  created_at: string;
  updated_at: string;
}

export interface GameScore {
  id: string;
  user_id: string;
  game_type: string;
  score: number;
  best_time: number | null;
  attempts: number | null;
  difficulty: string;
  created_at: string;
}

export interface FavoriteSite {
  id: string;
  user_id: string;
  site_id: string;
  site_name: string;
  site_url: string;
  category: string;
  added_at: string;
}

export interface UserReflection {
  id: string;
  user_id: string;
  title: string;
  content: string;
  reflection_type: string;
  mood: number;
  tags: string[];
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: string;
  title: string;
  description: string;
  points_earned: number;
  badge_icon: string;
  unlocked_at: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  challenge_type: string;
  title: string;
  description: string;
  points_earned: number;
  completed_at: string;
  date_completed: string;
}

export interface UserStat {
  id: string;
  user_id: string;
  stat_name: string;
  stat_value: number;
  stat_date: string;
  created_at: string;
  updated_at: string;
}