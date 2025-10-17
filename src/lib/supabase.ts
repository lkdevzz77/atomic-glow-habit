import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Tipos para as tabelas do Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          email: string;
          avatar_url?: string;
          desired_identity?: string;
          points: number;
          completed_onboarding: boolean;
          onboarding_step?: number;
          onboarding_data?: Record<string, any>;
          longest_streak: number;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          avatar_url?: string;
          desired_identity?: string;
          points?: number;
          completed_onboarding?: boolean;
          onboarding_step?: number;
          onboarding_data?: Record<string, any>;
          longest_streak?: number;
        };
        Update: {
          name?: string;
          email?: string;
          avatar_url?: string;
          desired_identity?: string;
          points?: number;
          completed_onboarding?: boolean;
          onboarding_step?: number;
          onboarding_data?: Record<string, any>;
          longest_streak?: number;
        };
      };
      habits: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          title: string;
          description?: string;
          icon: string;
          status: 'active' | 'archived' | 'completed';
          frequency: 'daily' | 'weekly';
          target_value?: number;
          reminder_time?: string;
          location?: string;
          trigger?: string;
          streak: number;
          longest_streak: number;
          start_date: string;
          last_completion?: string;
        };
        Insert: {
          user_id: string;
          title: string;
          description?: string;
          icon?: string;
          status?: 'active' | 'archived' | 'completed';
          frequency?: 'daily' | 'weekly';
          target_value?: number;
          reminder_time?: string;
          location?: string;
          trigger?: string;
          start_date: string;
        };
        Update: {
          title?: string;
          description?: string;
          icon?: string;
          status?: 'active' | 'archived' | 'completed';
          frequency?: 'daily' | 'weekly';
          target_value?: number;
          reminder_time?: string;
          location?: string;
          trigger?: string;
          streak?: number;
          longest_streak?: number;
          last_completion?: string;
        };
      };
      completions: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          habit_id: string;
          date: string;
          percentage: number;
          notes?: string;
        };
        Insert: {
          user_id: string;
          habit_id: string;
          date: string;
          percentage: number;
          notes?: string;
        };
        Update: {
          percentage?: number;
          notes?: string;
        };
      };
      user_badges: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          badge_id: string;
          unlocked_at: string;
        };
        Insert: {
          user_id: string;
          badge_id: string;
          unlocked_at: string;
        };
        Update: {
          unlocked_at?: string;
        };
      };
    };
  };
}

// Criar cliente tipado do Supabase
export type TypedSupabaseClient = ReturnType<typeof createClient<Database>>;

// Criar e exportar cliente
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);