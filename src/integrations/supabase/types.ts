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
          description: string | null
          difficulty: string
          due_date: string | null
          id: string
          quest_type: string
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
          description?: string | null
          difficulty: string
          due_date?: string | null
          id: string
          quest_type: string
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
          description?: string | null
          difficulty?: string
          due_date?: string | null
          id?: string
          quest_type?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
