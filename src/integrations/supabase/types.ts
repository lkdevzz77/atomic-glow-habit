export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          category: string
          description: string
          hidden: boolean | null
          icon: string
          id: string
          name: string
          target: number
          tier: string | null
          xp_reward: number | null
        }
        Insert: {
          category: string
          description: string
          hidden?: boolean | null
          icon: string
          id: string
          name: string
          target: number
          tier?: string | null
          xp_reward?: number | null
        }
        Update: {
          category?: string
          description?: string
          hidden?: boolean | null
          icon?: string
          id?: string
          name?: string
          target?: number
          tier?: string | null
          xp_reward?: number | null
        }
        Relationships: []
      }
      habit_completions: {
        Row: {
          completed_at: string
          date: string
          habit_id: number
          id: number
          percentage: number
          user_id: string
        }
        Insert: {
          completed_at?: string
          date?: string
          habit_id: number
          id?: number
          percentage?: number
          user_id: string
        }
        Update: {
          completed_at?: string
          date?: string
          habit_id?: number
          id?: number
          percentage?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_completions_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "habit_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          accountability_partner: string | null
          created_at: string
          current_phase: number
          environment_prep: string | null
          goal_current: number
          goal_target: number
          goal_unit: string
          habit_stack: string | null
          icon: string
          id: number
          identity_goal: string | null
          immediate_reward: string | null
          last_completed: string | null
          longest_streak: number
          reward_milestone: Json | null
          social_reinforcement: string | null
          sound_enabled: boolean | null
          status: string
          streak: number
          temptation_bundle: string | null
          title: string
          total_completions: number
          tracking_preferences: Json | null
          trigger_activity: string | null
          two_minute_rule: Json | null
          two_minute_version: string | null
          updated_at: string
          user_id: string
          vibration_enabled: boolean | null
          when_time: string
          where_location: string
        }
        Insert: {
          accountability_partner?: string | null
          created_at?: string
          current_phase?: number
          environment_prep?: string | null
          goal_current?: number
          goal_target: number
          goal_unit?: string
          habit_stack?: string | null
          icon?: string
          id?: number
          identity_goal?: string | null
          immediate_reward?: string | null
          last_completed?: string | null
          longest_streak?: number
          reward_milestone?: Json | null
          social_reinforcement?: string | null
          sound_enabled?: boolean | null
          status?: string
          streak?: number
          temptation_bundle?: string | null
          title: string
          total_completions?: number
          tracking_preferences?: Json | null
          trigger_activity?: string | null
          two_minute_rule?: Json | null
          two_minute_version?: string | null
          updated_at?: string
          user_id: string
          vibration_enabled?: boolean | null
          when_time: string
          where_location: string
        }
        Update: {
          accountability_partner?: string | null
          created_at?: string
          current_phase?: number
          environment_prep?: string | null
          goal_current?: number
          goal_target?: number
          goal_unit?: string
          habit_stack?: string | null
          icon?: string
          id?: number
          identity_goal?: string | null
          immediate_reward?: string | null
          last_completed?: string | null
          longest_streak?: number
          reward_milestone?: Json | null
          social_reinforcement?: string | null
          sound_enabled?: boolean | null
          status?: string
          streak?: number
          temptation_bundle?: string | null
          title?: string
          total_completions?: number
          tracking_preferences?: Json | null
          trigger_activity?: string | null
          two_minute_rule?: Json | null
          two_minute_version?: string | null
          updated_at?: string
          user_id?: string
          vibration_enabled?: boolean | null
          when_time?: string
          where_location?: string
        }
        Relationships: [
          {
            foreignKeyName: "habits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_color: string | null
          avatar_icon: string | null
          avatar_type: string | null
          avatar_url: string | null
          created_at: string
          desired_identity: string | null
          id: string
          language: string | null
          level: number | null
          longest_streak: number
          name: string
          points: number
          specific_change: string | null
          updated_at: string
          xp: number | null
        }
        Insert: {
          avatar_color?: string | null
          avatar_icon?: string | null
          avatar_type?: string | null
          avatar_url?: string | null
          created_at?: string
          desired_identity?: string | null
          id: string
          language?: string | null
          level?: number | null
          longest_streak?: number
          name: string
          points?: number
          specific_change?: string | null
          updated_at?: string
          xp?: number | null
        }
        Update: {
          avatar_color?: string | null
          avatar_icon?: string | null
          avatar_type?: string | null
          avatar_url?: string | null
          created_at?: string
          desired_identity?: string | null
          id?: string
          language?: string | null
          level?: number | null
          longest_streak?: number
          name?: string
          points?: number
          specific_change?: string | null
          updated_at?: string
          xp?: number | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          id: number
          progress: number
          unlocked: boolean
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          badge_id: string
          id?: number
          progress?: number
          unlocked?: boolean
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          badge_id?: string
          id?: number
          progress?: number
          unlocked?: boolean
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_xp: {
        Args: { p_user_id: string; p_xp_amount: number }
        Returns: undefined
      }
      calculate_habit_streak: {
        Args: { p_habit_id: number }
        Returns: {
          current_streak: number
          longest_streak: number
        }[]
      }
      check_and_reset_broken_streaks: { Args: never; Returns: undefined }
      get_habit_completion_xp: {
        Args: { p_date: string; p_habit_id: number; p_user_id: string }
        Returns: {
          reasons: string[]
          total_xp: number
        }[]
      }
      get_server_date: { Args: never; Returns: string }
      get_user_todays_completions: {
        Args: { p_user_id: string }
        Returns: {
          completed_at: string
          date: string
          habit_id: number
          percentage: number
        }[]
      }
      get_user_xp_earned_today: { Args: { p_user_id: string }; Returns: number }
      initialize_user_badges: {
        Args: { p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
