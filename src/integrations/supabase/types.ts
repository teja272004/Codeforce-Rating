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
      contests: {
        Row: {
          contest_date: string
          contest_id: string
          created_at: string | null
          id: string
          name: string
          new_rating: number | null
          problems_solved: number | null
          rank: number | null
          rating_change: number | null
          student_id: string | null
          total_problems: number | null
        }
        Insert: {
          contest_date: string
          contest_id: string
          created_at?: string | null
          id?: string
          name: string
          new_rating?: number | null
          problems_solved?: number | null
          rank?: number | null
          rating_change?: number | null
          student_id?: string | null
          total_problems?: number | null
        }
        Update: {
          contest_date?: string
          contest_id?: string
          created_at?: string | null
          id?: string
          name?: string
          new_rating?: number | null
          problems_solved?: number | null
          rank?: number | null
          rating_change?: number | null
          student_id?: string | null
          total_problems?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          email_type: string
          id: string
          sent_at: string | null
          status: string
          student_id: string | null
        }
        Insert: {
          email_type: string
          id?: string
          sent_at?: string | null
          status: string
          student_id?: string | null
        }
        Update: {
          email_type?: string
          id?: string
          sent_at?: string | null
          status?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          auto_email_enabled: boolean | null
          codeforces_handle: string
          created_at: string | null
          current_rating: number | null
          email: string
          id: string
          last_updated: string | null
          max_rating: number | null
          name: string
          phone: string | null
          reminder_count: number | null
        }
        Insert: {
          auto_email_enabled?: boolean | null
          codeforces_handle: string
          created_at?: string | null
          current_rating?: number | null
          email: string
          id?: string
          last_updated?: string | null
          max_rating?: number | null
          name: string
          phone?: string | null
          reminder_count?: number | null
        }
        Update: {
          auto_email_enabled?: boolean | null
          codeforces_handle?: string
          created_at?: string | null
          current_rating?: number | null
          email?: string
          id?: string
          last_updated?: string | null
          max_rating?: number | null
          name?: string
          phone?: string | null
          reminder_count?: number | null
        }
        Relationships: []
      }
      submissions: {
        Row: {
          created_at: string | null
          id: string
          language: string | null
          problem_name: string
          rating: number | null
          student_id: string | null
          submission_id: string
          submission_time: string
          verdict: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          language?: string | null
          problem_name: string
          rating?: number | null
          student_id?: string | null
          submission_id: string
          submission_time: string
          verdict: string
        }
        Update: {
          created_at?: string | null
          id?: string
          language?: string | null
          problem_name?: string
          rating?: number | null
          student_id?: string | null
          submission_id?: string
          submission_time?: string
          verdict?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_logs: {
        Row: {
          error_message: string | null
          id: string
          status: string
          student_id: string | null
          sync_type: string
          synced_at: string | null
        }
        Insert: {
          error_message?: string | null
          id?: string
          status: string
          student_id?: string | null
          sync_type: string
          synced_at?: string | null
        }
        Update: {
          error_message?: string | null
          id?: string
          status?: string
          student_id?: string | null
          sync_type?: string
          synced_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sync_logs_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
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
