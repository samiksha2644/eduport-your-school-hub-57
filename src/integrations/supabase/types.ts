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
      achievements: {
        Row: {
          created_at: string
          desc_en: string
          desc_mr: string
          id: string
          title_en: string
          title_mr: string
        }
        Insert: {
          created_at?: string
          desc_en?: string
          desc_mr?: string
          id?: string
          title_en?: string
          title_mr?: string
        }
        Update: {
          created_at?: string
          desc_en?: string
          desc_mr?: string
          id?: string
          title_en?: string
          title_mr?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          category: string
          created_at: string
          date: string
          desc_en: string
          desc_mr: string
          id: string
          title_en: string
          title_mr: string
        }
        Insert: {
          category?: string
          created_at?: string
          date?: string
          desc_en?: string
          desc_mr?: string
          id?: string
          title_en?: string
          title_mr?: string
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          desc_en?: string
          desc_mr?: string
          id?: string
          title_en?: string
          title_mr?: string
        }
        Relationships: []
      }
      career_streams: {
        Row: {
          career_options_en: string
          career_options_mr: string
          category: string
          created_at: string
          future_scope_en: string
          future_scope_mr: string
          id: string
          name_en: string
          name_mr: string
          skills_en: string
          skills_mr: string
          sort_order: number
          subjects_en: string
          subjects_mr: string
          video_url: string
        }
        Insert: {
          career_options_en?: string
          career_options_mr?: string
          category: string
          created_at?: string
          future_scope_en?: string
          future_scope_mr?: string
          id?: string
          name_en: string
          name_mr?: string
          skills_en?: string
          skills_mr?: string
          sort_order?: number
          subjects_en?: string
          subjects_mr?: string
          video_url?: string
        }
        Update: {
          career_options_en?: string
          career_options_mr?: string
          category?: string
          created_at?: string
          future_scope_en?: string
          future_scope_mr?: string
          id?: string
          name_en?: string
          name_mr?: string
          skills_en?: string
          skills_mr?: string
          sort_order?: number
          subjects_en?: string
          subjects_mr?: string
          video_url?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          date: string
          email: string
          id: string
          message: string
          name: string
          phone: string
        }
        Insert: {
          created_at?: string
          date?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string
        }
        Update: {
          created_at?: string
          date?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      entrance_exams: {
        Row: {
          created_at: string
          description_en: string
          description_mr: string
          id: string
          name_en: string
          name_mr: string
          sort_order: number
          video_url: string
        }
        Insert: {
          created_at?: string
          description_en?: string
          description_mr?: string
          id?: string
          name_en: string
          name_mr?: string
          sort_order?: number
          video_url?: string
        }
        Update: {
          created_at?: string
          description_en?: string
          description_mr?: string
          id?: string
          name_en?: string
          name_mr?: string
          sort_order?: number
          video_url?: string
        }
        Relationships: []
      }
      exam_resources: {
        Row: {
          created_at: string
          exam_id: string
          file_name: string
          file_url: string
          id: string
        }
        Insert: {
          created_at?: string
          exam_id: string
          file_name: string
          file_url: string
          id?: string
        }
        Update: {
          created_at?: string
          exam_id?: string
          file_name?: string
          file_url?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_resources_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          created_at: string
          eligibility_en: string
          eligibility_mr: string
          exam_pattern_en: string
          exam_pattern_mr: string
          id: string
          name_en: string
          name_mr: string
          overview_en: string
          overview_mr: string
          reference_links: Json
          sort_order: number
          syllabus_en: string
          syllabus_mr: string
        }
        Insert: {
          created_at?: string
          eligibility_en?: string
          eligibility_mr?: string
          exam_pattern_en?: string
          exam_pattern_mr?: string
          id?: string
          name_en: string
          name_mr?: string
          overview_en?: string
          overview_mr?: string
          reference_links?: Json
          sort_order?: number
          syllabus_en?: string
          syllabus_mr?: string
        }
        Update: {
          created_at?: string
          eligibility_en?: string
          eligibility_mr?: string
          exam_pattern_en?: string
          exam_pattern_mr?: string
          id?: string
          name_en?: string
          name_mr?: string
          overview_en?: string
          overview_mr?: string
          reference_links?: Json
          sort_order?: number
          syllabus_en?: string
          syllabus_mr?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          caption_en: string
          caption_mr: string
          category: string
          created_at: string
          id: string
          url: string
        }
        Insert: {
          caption_en?: string
          caption_mr?: string
          category?: string
          created_at?: string
          id?: string
          url: string
        }
        Update: {
          caption_en?: string
          caption_mr?: string
          category?: string
          created_at?: string
          id?: string
          url?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          banner_image: string
          id: string
          map_embed_url: string
          mission_en: string
          mission_mr: string
          principal_message_en: string
          principal_message_mr: string
          school_address: string
          school_email: string
          school_phone: string
          spotlight_en: string
          spotlight_mr: string
          updated_at: string
          vision_en: string
          vision_mr: string
          visiting_hours_en: string
          visiting_hours_mr: string
        }
        Insert: {
          banner_image?: string
          id?: string
          map_embed_url?: string
          mission_en?: string
          mission_mr?: string
          principal_message_en?: string
          principal_message_mr?: string
          school_address?: string
          school_email?: string
          school_phone?: string
          spotlight_en?: string
          spotlight_mr?: string
          updated_at?: string
          vision_en?: string
          vision_mr?: string
          visiting_hours_en?: string
          visiting_hours_mr?: string
        }
        Update: {
          banner_image?: string
          id?: string
          map_embed_url?: string
          mission_en?: string
          mission_mr?: string
          principal_message_en?: string
          principal_message_mr?: string
          school_address?: string
          school_email?: string
          school_phone?: string
          spotlight_en?: string
          spotlight_mr?: string
          updated_at?: string
          vision_en?: string
          vision_mr?: string
          visiting_hours_en?: string
          visiting_hours_mr?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
