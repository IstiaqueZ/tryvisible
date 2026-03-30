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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      ai_monitor_keywords: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          keyword: string
          next_run_at: string
          project_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          keyword: string
          next_run_at?: string
          project_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          keyword?: string
          next_run_at?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_monitor_keywords_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      deep_audits: {
        Row: {
          competitor_analysis: Json | null
          created_at: string
          id: string
          improvement_suggestions: Json | null
          keyword_research_id: string
          project_id: string
          pros_cons: Json | null
          top_citations: Json | null
          top_competitors: Json | null
        }
        Insert: {
          competitor_analysis?: Json | null
          created_at?: string
          id?: string
          improvement_suggestions?: Json | null
          keyword_research_id: string
          project_id: string
          pros_cons?: Json | null
          top_citations?: Json | null
          top_competitors?: Json | null
        }
        Update: {
          competitor_analysis?: Json | null
          created_at?: string
          id?: string
          improvement_suggestions?: Json | null
          keyword_research_id?: string
          project_id?: string
          pros_cons?: Json | null
          top_citations?: Json | null
          top_competitors?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "deep_audits_keyword_research_id_fkey"
            columns: ["keyword_research_id"]
            isOneToOne: false
            referencedRelation: "keyword_researches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deep_audits_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      keyword_researches: {
        Row: {
          avg_quality_score: number | null
          avg_visibility_score: number | null
          created_at: string
          gemini_citations: Json | null
          gemini_is_cited: boolean | null
          gemini_quality_score: number | null
          gemini_response: string | null
          gemini_visibility_score: number | null
          id: string
          is_cited: boolean | null
          is_named: boolean | null
          keyword: string
          openai_citations: Json | null
          openai_is_cited: boolean | null
          openai_quality_score: number | null
          openai_response: string | null
          openai_visibility_score: number | null
          perplexity_citations: Json | null
          perplexity_is_cited: boolean | null
          perplexity_quality_score: number | null
          perplexity_response: string | null
          perplexity_visibility_score: number | null
          project_id: string
          sentiment: Database["public"]["Enums"]["sentiment_type"] | null
        }
        Insert: {
          avg_quality_score?: number | null
          avg_visibility_score?: number | null
          created_at?: string
          gemini_citations?: Json | null
          gemini_is_cited?: boolean | null
          gemini_quality_score?: number | null
          gemini_response?: string | null
          gemini_visibility_score?: number | null
          id?: string
          is_cited?: boolean | null
          is_named?: boolean | null
          keyword: string
          openai_citations?: Json | null
          openai_is_cited?: boolean | null
          openai_quality_score?: number | null
          openai_response?: string | null
          openai_visibility_score?: number | null
          perplexity_citations?: Json | null
          perplexity_is_cited?: boolean | null
          perplexity_quality_score?: number | null
          perplexity_response?: string | null
          perplexity_visibility_score?: number | null
          project_id: string
          sentiment?: Database["public"]["Enums"]["sentiment_type"] | null
        }
        Update: {
          avg_quality_score?: number | null
          avg_visibility_score?: number | null
          created_at?: string
          gemini_citations?: Json | null
          gemini_is_cited?: boolean | null
          gemini_quality_score?: number | null
          gemini_response?: string | null
          gemini_visibility_score?: number | null
          id?: string
          is_cited?: boolean | null
          is_named?: boolean | null
          keyword?: string
          openai_citations?: Json | null
          openai_is_cited?: boolean | null
          openai_quality_score?: number | null
          openai_response?: string | null
          openai_visibility_score?: number | null
          perplexity_citations?: Json | null
          perplexity_is_cited?: boolean | null
          perplexity_quality_score?: number | null
          perplexity_response?: string | null
          perplexity_visibility_score?: number | null
          project_id?: string
          sentiment?: Database["public"]["Enums"]["sentiment_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "keyword_researches_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      monitor_history: {
        Row: {
          id: string
          keyword_research_id: string
          monitor_keyword_id: string
          recorded_at: string
        }
        Insert: {
          id?: string
          keyword_research_id: string
          monitor_keyword_id: string
          recorded_at?: string
        }
        Update: {
          id?: string
          keyword_research_id?: string
          monitor_keyword_id?: string
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "monitor_history_keyword_research_id_fkey"
            columns: ["keyword_research_id"]
            isOneToOne: false
            referencedRelation: "keyword_researches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monitor_history_monitor_keyword_id_fkey"
            columns: ["monitor_keyword_id"]
            isOneToOne: false
            referencedRelation: "ai_monitor_keywords"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          domain: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          deep_audit_credits: number
          id: string
          keyword_credits: number
          plan_tier: Database["public"]["Enums"]["plan_tier"]
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          deep_audit_credits?: number
          id?: string
          keyword_credits?: number
          plan_tier?: Database["public"]["Enums"]["plan_tier"]
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          deep_audit_credits?: number
          id?: string
          keyword_credits?: number
          plan_tier?: Database["public"]["Enums"]["plan_tier"]
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      teaser_usage: {
        Row: {
          created_at: string
          id: string
          ip_address: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      todo_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_completed: boolean
          project_id: string
          source_audit_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          project_id: string
          source_audit_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          project_id?: string
          source_audit_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todo_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_items_source_audit_id_fkey"
            columns: ["source_audit_id"]
            isOneToOne: false
            referencedRelation: "deep_audits"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      plan_tier: "tier_1" | "tier_2" | "tier_3"
      sentiment_type: "positive" | "negative" | "neutral" | "mixed"
      subscription_status:
        | "active"
        | "canceled"
        | "past_due"
        | "trialing"
        | "incomplete"
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
    Enums: {
      plan_tier: ["tier_1", "tier_2", "tier_3"],
      sentiment_type: ["positive", "negative", "neutral", "mixed"],
      subscription_status: [
        "active",
        "canceled",
        "past_due",
        "trialing",
        "incomplete",
      ],
    },
  },
} as const
