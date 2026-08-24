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
      admin_notes: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          note: string
          record_id: string
          record_type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          note: string
          record_id: string
          record_type: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string
          record_id?: string
          record_type?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          about: string
          created_at: string
          email: string
          experience: string | null
          full_name: string
          heard_from: string | null
          id: string
          location: string | null
          phone: string
          resume_url: string | null
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          about: string
          created_at?: string
          email: string
          experience?: string | null
          full_name: string
          heard_from?: string | null
          id?: string
          location?: string | null
          phone: string
          resume_url?: string | null
          role: string
          status?: string
          updated_at?: string
        }
        Update: {
          about?: string
          created_at?: string
          email?: string
          experience?: string | null
          full_name?: string
          heard_from?: string | null
          id?: string
          location?: string | null
          phone?: string
          resume_url?: string | null
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          alternate_phone: string | null
          amount_paid: number | null
          assigned_coach: string | null
          balance_amount: string | null
          chess_id: string | null
          city: string
          class_schedule: string | null
          confirmation_email_attempts: number
          confirmation_email_error: string | null
          confirmation_email_sent_at: string | null
          confirmation_email_status: string
          country: string
          created_at: string
          custom_plan_note: string | null
          email: string
          guardian_whatsapp: string
          id: string
          notes: string | null
          parent_name: string
          payment_date: string
          payment_method: string | null
          payment_note: string | null
          payment_proof_url: string | null
          payment_status: string
          payment_type: string
          payment_verified_at: string | null
          phone: string
          plan: string
          preferred_coach: string
          preferred_timezone: string | null
          receipt_number: string | null
          registration_number: string
          rubiks_addon: boolean
          sessions_total: string | null
          state: string
          status: string
          student_counsellor: string
          student_dob: string
          student_name: string
          student_whatsapp: string | null
          transaction_id: string
          updated_at: string
        }
        Insert: {
          alternate_phone?: string | null
          amount_paid?: number | null
          assigned_coach?: string | null
          balance_amount?: string | null
          chess_id?: string | null
          city: string
          class_schedule?: string | null
          confirmation_email_attempts?: number
          confirmation_email_error?: string | null
          confirmation_email_sent_at?: string | null
          confirmation_email_status?: string
          country: string
          created_at?: string
          custom_plan_note?: string | null
          email: string
          guardian_whatsapp: string
          id?: string
          notes?: string | null
          parent_name: string
          payment_date: string
          payment_method?: string | null
          payment_note?: string | null
          payment_proof_url?: string | null
          payment_status?: string
          payment_type: string
          payment_verified_at?: string | null
          phone: string
          plan: string
          preferred_coach?: string
          preferred_timezone?: string | null
          receipt_number?: string | null
          registration_number: string
          rubiks_addon?: boolean
          sessions_total?: string | null
          state: string
          status?: string
          student_counsellor?: string
          student_dob: string
          student_name: string
          student_whatsapp?: string | null
          transaction_id: string
          updated_at?: string
        }
        Update: {
          alternate_phone?: string | null
          amount_paid?: number | null
          assigned_coach?: string | null
          balance_amount?: string | null
          chess_id?: string | null
          city?: string
          class_schedule?: string | null
          confirmation_email_attempts?: number
          confirmation_email_error?: string | null
          confirmation_email_sent_at?: string | null
          confirmation_email_status?: string
          country?: string
          created_at?: string
          custom_plan_note?: string | null
          email?: string
          guardian_whatsapp?: string
          id?: string
          notes?: string | null
          parent_name?: string
          payment_date?: string
          payment_method?: string | null
          payment_note?: string | null
          payment_proof_url?: string | null
          payment_status?: string
          payment_type?: string
          payment_verified_at?: string | null
          phone?: string
          plan?: string
          preferred_coach?: string
          preferred_timezone?: string | null
          receipt_number?: string | null
          registration_number?: string
          rubiks_addon?: boolean
          sessions_total?: string | null
          state?: string
          status?: string
          student_counsellor?: string
          student_dob?: string
          student_name?: string
          student_whatsapp?: string | null
          transaction_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          child_age: string
          child_name: string
          country: string | null
          created_at: string
          current_level: string
          demo_scheduled_at: string | null
          demo_status: string
          follow_up_at: string | null
          id: string
          message: string | null
          parent_email: string
          parent_name: string
          parent_phone: string
          phone_country: string | null
          preferred_language: string
          priority: string
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          child_age: string
          child_name: string
          country?: string | null
          created_at?: string
          current_level: string
          demo_scheduled_at?: string | null
          demo_status?: string
          follow_up_at?: string | null
          id?: string
          message?: string | null
          parent_email: string
          parent_name: string
          parent_phone: string
          phone_country?: string | null
          preferred_language?: string
          priority?: string
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          child_age?: string
          child_name?: string
          country?: string | null
          created_at?: string
          current_level?: string
          demo_scheduled_at?: string | null
          demo_status?: string
          follow_up_at?: string | null
          id?: string
          message?: string | null
          parent_email?: string
          parent_name?: string
          parent_phone?: string
          phone_country?: string | null
          preferred_language?: string
          priority?: string
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_receipt_number: {
        Args: { _enrollment_id: string }
        Returns: string
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
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
