export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          coin_reward: number
          created_at: string
          current_count: number | null
          date_unlocked: string | null
          description: string | null
          icon: string | null
          id: string
          required_count: number | null
          special_reward: Json | null
          title: string
          unlocked: boolean
          updated_at: string
          user_id: string
          xp_reward: number
        }
        Insert: {
          category: string
          coin_reward?: number
          created_at?: string
          current_count?: number | null
          date_unlocked?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          required_count?: number | null
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
          current_count?: number | null
          date_unlocked?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          required_count?: number | null
          special_reward?: Json | null
          title?: string
          unlocked?: boolean
          updated_at?: string
          user_id?: string
          xp_reward?: number
        }
        Relationships: []
      }
      challenges: {
        Row: {
          coin_reward: number
          created_at: string
          current_count: number
          description: string | null
          frequency: string
          id: string
          required_count: number
          reset_date: string | null
          special_reward: Json | null
          stat_rewards: Json | null
          status: string
          title: string
          updated_at: string
          user_id: string
          xp_reward: number
        }
        Insert: {
          coin_reward?: number
          created_at?: string
          current_count?: number
          description?: string | null
          frequency: string
          id?: string
          required_count?: number
          reset_date?: string | null
          special_reward?: Json | null
          stat_rewards?: Json | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          xp_reward?: number
        }
        Update: {
          coin_reward?: number
          created_at?: string
          current_count?: number
          description?: string | null
          frequency?: string
          id?: string
          required_count?: number
          reset_date?: string | null
          special_reward?: Json | null
          stat_rewards?: Json | null
          status?: string
          title?: string
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
          name: string
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
          coin_reward: number
          color: string
          completion_history: Json | null
          created_at: string
          custom_days: Json | null
          description: string | null
          frequency: string
          icon: string | null
          id: string
          name: string
          reminder: string | null
          streak: number
          updated_at: string
          user_id: string
          xp_reward: number
        }
        Insert: {
          coin_reward?: number
          color: string
          completion_history?: Json | null
          created_at?: string
          custom_days?: Json | null
          description?: string | null
          frequency: string
          icon?: string | null
          id?: string
          name: string
          reminder?: string | null
          streak?: number
          updated_at?: string
          user_id: string
          xp_reward?: number
        }
        Update: {
          coin_reward?: number
          color?: string
          completion_history?: Json | null
          created_at?: string
          custom_days?: Json | null
          description?: string | null
          frequency?: string
          icon?: string | null
          id?: string
          name?: string
          reminder?: string | null
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
          level_required: number | null
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
          level_required?: number | null
          name: string
          rarity?: string
          stat_bonuses?: Json | null
          type: string
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
          level_required?: number | null
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
          created_at: string | null
          id: string
          is_favorite: boolean | null
          is_private: boolean | null
          mood: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          is_private?: boolean | null
          mood?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          is_private?: boolean | null
          mood?: string | null
          title?: string
          updated_at?: string | null
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
          coin_reward: number
          created_at: string
          custom_reset_days: Json | null
          description: string | null
          difficulty: string
          due_date: string | null
          id: string
          quest_type: string
          repeat_type: string | null
          stat_rewards: Json | null
          status: string
          steps: Json | null
          title: string
          updated_at: string
          user_id: string
          xp_reward: number
        }
        Insert: {
          coin_reward?: number
          created_at?: string
          custom_reset_days?: Json | null
          description?: string | null
          difficulty: string
          due_date?: string | null
          id: string
          quest_type: string
          repeat_type?: string | null
          stat_rewards?: Json | null
          status?: string
          steps?: Json | null
          title: string
          updated_at?: string
          user_id: string
          xp_reward?: number
        }
        Update: {
          coin_reward?: number
          created_at?: string
          custom_reset_days?: Json | null
          description?: string | null
          difficulty?: string
          due_date?: string | null
          id?: string
          quest_type?: string
          repeat_type?: string | null
          stat_rewards?: Json | null
          status?: string
          steps?: Json | null
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
          level_required: number | null
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
          level_required?: number | null
          name: string
          rarity?: string
          stat_bonuses?: Json | null
          type: string
          updated_at?: string
        }
        Update: {
          cost?: number
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          level_required?: number | null
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
          created_at: string | null
          id: string
          list_id: string
          name: string
          notes: string | null
          purchased: boolean | null
          quantity: string | null
          sort_order: number
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          list_id: string
          name: string
          notes?: string | null
          purchased?: boolean | null
          quantity?: string | null
          sort_order?: number
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          list_id?: string
          name?: string
          notes?: string | null
          purchased?: boolean | null
          quantity?: string | null
          sort_order?: number
          updated_at?: string | null
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
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      skill_nodes: {
        Row: {
          connected_to: Json | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          position: Json
          stat_bonuses: Json | null
          unlocked: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          connected_to?: Json | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          position: Json
          stat_bonuses?: Json | null
          unlocked?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          connected_to?: Json | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          position?: Json
          stat_bonuses?: Json | null
          unlocked?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_skills: {
        Row: {
          created_at: string
          id: string
          skill_name: string
          updated_at: string
          user_id: string | null
          xp: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          skill_name: string
          updated_at?: string
          user_id?: string | null
          xp?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          skill_name?: string
          updated_at?: string
          user_id?: string | null
          xp?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_server_time: {
        Args: Record<PropertyKey, never>
        Returns: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
