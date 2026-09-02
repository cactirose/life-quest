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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          coin_reward: number
          created_at: string
          current_count: number
          date_unlocked: string | null
          description: string | null
          icon: string | null
          id: string
          required_count: number
          special_reward: Json | null
          title: string
          unlocked: boolean
          updated_at: string
          user_id: string
          xp_reward: number
        }
        Insert: {
          category?: string
          coin_reward?: number
          created_at?: string
          current_count?: number
          date_unlocked?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          required_count?: number
          special_reward?: Json | null
          title: string
          unlocked?: boolean
          updated_at?: string
          user_id: string
          xp_reward?: number
        }
        Update: {
          category?: string
          coin_reward?: number
          created_at?: string
          current_count?: number
          date_unlocked?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          required_count?: number
          special_reward?: Json | null
          title?: string
          unlocked?: boolean
          updated_at?: string
          user_id?: string
          xp_reward?: number
        }
        Relationships: []
      }
      characters: {
        Row: {
          bio: string | null
          coins: number
          created_at: string
          daily_bonus_claimed: boolean
          id: string
          last_login_date: string | null
          level: number
          login_streak: number
          name: string
          next_level_xp: number
          portrait: string | null
          stats: Json
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          bio?: string | null
          coins?: number
          created_at?: string
          daily_bonus_claimed?: boolean
          id?: string
          last_login_date?: string | null
          level?: number
          login_streak?: number
          name?: string
          next_level_xp?: number
          portrait?: string | null
          stats?: Json
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          bio?: string | null
          coins?: number
          created_at?: string
          daily_bonus_claimed?: boolean
          id?: string
          last_login_date?: string | null
          level?: number
          login_streak?: number
          name?: string
          next_level_xp?: number
          portrait?: string | null
          stats?: Json
          updated_at?: string
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
      habits: {
        Row: {
          achievement_id: string | null
          achievement_xp_reward: number | null
          coin_reward: number
          color: string | null
          completion_history: Json | null
          created_at: string
          custom_days: Json | null
          description: string | null
          frequency: string
          icon: string | null
          id: string
          name: string
          reminder: string | null
          skill_id: string | null
          skill_xp_reward: number | null
          steps: Json | null
          streak: number
          updated_at: string
          user_id: string
          xp_reward: number
        }
        Insert: {
          achievement_id?: string | null
          achievement_xp_reward?: number | null
          coin_reward?: number
          color?: string | null
          completion_history?: Json | null
          created_at?: string
          custom_days?: Json | null
          description?: string | null
          frequency?: string
          icon?: string | null
          id?: string
          name: string
          reminder?: string | null
          skill_id?: string | null
          skill_xp_reward?: number | null
          steps?: Json | null
          streak?: number
          updated_at?: string
          user_id: string
          xp_reward?: number
        }
        Update: {
          achievement_id?: string | null
          achievement_xp_reward?: number | null
          coin_reward?: number
          color?: string | null
          completion_history?: Json | null
          created_at?: string
          custom_days?: Json | null
          description?: string | null
          frequency?: string
          icon?: string | null
          id?: string
          name?: string
          reminder?: string | null
          skill_id?: string | null
          skill_xp_reward?: number | null
          steps?: Json | null
          streak?: number
          updated_at?: string
          user_id?: string
          xp_reward?: number
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          cost: number
          created_at: string
          description: string | null
          equipped: boolean
          icon: string | null
          id: string
          level_required: number
          name: string
          rarity: string
          stat_bonuses: Json | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cost?: number
          created_at?: string
          description?: string | null
          equipped?: boolean
          icon?: string | null
          id?: string
          level_required?: number
          name: string
          rarity?: string
          stat_bonuses?: Json | null
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cost?: number
          created_at?: string
          description?: string | null
          equipped?: boolean
          icon?: string | null
          id?: string
          level_required?: number
          name?: string
          rarity?: string
          stat_bonuses?: Json | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string
          id: string
          is_favorite: boolean
          is_private: boolean
          mood: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          is_favorite?: boolean
          is_private?: boolean
          mood?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_favorite?: boolean
          is_private?: boolean
          mood?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mood_entries: {
        Row: {
          created_at: string
          date: string
          id: string
          mood: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          mood: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          mood?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      quests: {
        Row: {
          achievement_id: string | null
          achievement_xp_reward: number | null
          coin_reward: number
          created_at: string
          custom_reset_days: number[] | null
          description: string | null
          difficulty: string
          due_date: string | null
          id: string
          quest_type: string
          repeat_type: string | null
          skill_id: string | null
          skill_xp_reward: number | null
          stat_rewards: Json | null
          status: string
          steps: Json | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          xp_reward: number
        }
        Insert: {
          achievement_id?: string | null
          achievement_xp_reward?: number | null
          coin_reward?: number
          created_at?: string
          custom_reset_days?: number[] | null
          description?: string | null
          difficulty?: string
          due_date?: string | null
          id?: string
          quest_type?: string
          repeat_type?: string | null
          skill_id?: string | null
          skill_xp_reward?: number | null
          stat_rewards?: Json | null
          status?: string
          steps?: Json | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          xp_reward?: number
        }
        Update: {
          achievement_id?: string | null
          achievement_xp_reward?: number | null
          coin_reward?: number
          created_at?: string
          custom_reset_days?: number[] | null
          description?: string | null
          difficulty?: string
          due_date?: string | null
          id?: string
          quest_type?: string
          repeat_type?: string | null
          skill_id?: string | null
          skill_xp_reward?: number | null
          stat_rewards?: Json | null
          status?: string
          steps?: Json | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          xp_reward?: number
        }
        Relationships: []
      }
      shop_items: {
        Row: {
          cost: number
          created_at: string
          description: string | null
          icon: string | null
          id: string
          level_required: number
          name: string
          rarity: string
          stat_bonuses: Json | null
          type: string
          updated_at: string
        }
        Insert: {
          cost?: number
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          level_required?: number
          name: string
          rarity?: string
          stat_bonuses?: Json | null
          type?: string
          updated_at?: string
        }
        Update: {
          cost?: number
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          level_required?: number
          name?: string
          rarity?: string
          stat_bonuses?: Json | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      shopping_items: {
        Row: {
          category: string | null
          created_at: string
          id: string
          list_id: string
          name: string
          notes: string | null
          purchased: boolean
          quantity: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          list_id: string
          name: string
          notes?: string | null
          purchased?: boolean
          quantity?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          list_id?: string
          name?: string
          notes?: string | null
          purchased?: boolean
          quantity?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_items_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "shopping_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_lists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_server_time: { Args: never; Returns: string }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
