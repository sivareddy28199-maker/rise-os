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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          category: string
          content: string
          id: string
          published_at: string
          read_minutes: number
          slug: string
          summary: string
          title: string
        }
        Insert: {
          category?: string
          content: string
          id?: string
          published_at?: string
          read_minutes?: number
          slug: string
          summary: string
          title: string
        }
        Update: {
          category?: string
          content?: string
          id?: string
          published_at?: string
          read_minutes?: number
          slug?: string
          summary?: string
          title?: string
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          created_at: string
          id: string
          question_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      current_affairs: {
        Row: {
          category: string
          content: string
          created_at: string
          date: string
          id: string
          source: string | null
          ssc_relevance: string | null
          title: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          date?: string
          id?: string
          source?: string | null
          ssc_relevance?: string | null
          title: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          date?: string
          id?: string
          source?: string | null
          ssc_relevance?: string | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          daily_goal: number
          id: string
          name: string
          preparation_level: string
          show_on_leaderboard: boolean
          target_exam: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          daily_goal?: number
          id: string
          name?: string
          preparation_level?: string
          show_on_leaderboard?: boolean
          target_exam?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          daily_goal?: number
          id?: string
          name?: string
          preparation_level?: string
          show_on_leaderboard?: boolean
          target_exam?: string
        }
        Relationships: []
      }
      question_attempts: {
        Row: {
          attempted_at: string
          id: string
          is_correct: boolean
          mode: string
          question_id: string
          selected_answer: string | null
          time_taken: number
          user_id: string
        }
        Insert: {
          attempted_at?: string
          id?: string
          is_correct: boolean
          mode?: string
          question_id: string
          selected_answer?: string | null
          time_taken?: number
          user_id: string
        }
        Update: {
          attempted_at?: string
          id?: string
          is_correct?: boolean
          mode?: string
          question_id?: string
          selected_answer?: string | null
          time_taken?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_reports: {
        Row: {
          created_at: string
          id: string
          question_id: string
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_reports_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          correct_answer: string
          created_at: string
          difficulty: string
          explanation: string
          id: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          source: string | null
          subject_id: string
          topic_id: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          difficulty?: string
          explanation?: string
          id?: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          source?: string | null
          subject_id: string
          topic_id: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          difficulty?: string
          explanation?: string
          id?: string
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          question?: string
          source?: string | null
          subject_id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      study_progress: {
        Row: {
          accuracy: number
          attempts: number
          id: string
          last_studied: string
          progress: number
          questions_solved: number
          topic_id: string
          user_id: string
        }
        Insert: {
          accuracy?: number
          attempts?: number
          id?: string
          last_studied?: string
          progress?: number
          questions_solved?: number
          topic_id: string
          user_id: string
        }
        Update: {
          accuracy?: number
          attempts?: number
          id?: string
          last_studied?: string
          progress?: number
          questions_solved?: number
          topic_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_progress_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          description: string | null
          id: string
          name: string
          short_name: string
          slug: string
          sort_order: number
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          short_name: string
          slug: string
          sort_order?: number
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          short_name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      test_attempts: {
        Row: {
          accuracy: number
          attempted: number
          completed_at: string
          correct: number
          id: string
          review: Json
          score: number
          skipped: number
          subject_breakdown: Json
          test_id: string | null
          test_type: string
          time_taken: number
          title: string
          topic_breakdown: Json
          total_marks: number
          total_questions: number
          user_id: string
          wrong: number
        }
        Insert: {
          accuracy: number
          attempted: number
          completed_at?: string
          correct: number
          id?: string
          review?: Json
          score: number
          skipped: number
          subject_breakdown?: Json
          test_id?: string | null
          test_type: string
          time_taken: number
          title: string
          topic_breakdown?: Json
          total_marks: number
          total_questions: number
          user_id: string
          wrong: number
        }
        Update: {
          accuracy?: number
          attempted?: number
          completed_at?: string
          correct?: number
          id?: string
          review?: Json
          score?: number
          skipped?: number
          subject_breakdown?: Json
          test_id?: string | null
          test_type?: string
          time_taken?: number
          title?: string
          topic_breakdown?: Json
          total_marks?: number
          total_questions?: number
          user_id?: string
          wrong?: number
        }
        Relationships: [
          {
            foreignKeyName: "test_attempts_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          duration: number
          id: string
          title: string
          total_marks: number
          total_questions: number
          type: string
        }
        Insert: {
          duration: number
          id?: string
          title: string
          total_marks: number
          total_questions: number
          type: string
        }
        Update: {
          duration?: number
          id?: string
          title?: string
          total_marks?: number
          total_questions?: number
          type?: string
        }
        Relationships: []
      }
      topics: {
        Row: {
          description: string | null
          id: string
          name: string
          notes: Json | null
          slug: string
          sort_order: number
          subject_id: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          notes?: Json | null
          slug: string
          sort_order?: number
          subject_id: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          notes?: Json | null
          slug?: string
          sort_order?: number
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
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
      check_answer: {
        Args: { p_question_id: string; p_selected: string; p_time?: number }
        Returns: Json
      }
      get_mock_questions: {
        Args: { p_per_subject?: number }
        Returns: {
          difficulty: string
          id: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          subject_id: string
          subject_name: string
          topic_id: string
          topic_name: string
        }[]
      }
      get_my_stats: { Args: never; Returns: Json }
      get_questions: {
        Args: {
          p_ids?: string[]
          p_limit?: number
          p_seed?: string
          p_subject_id?: string
          p_topic_id?: string
        }
        Returns: {
          difficulty: string
          id: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          subject_id: string
          subject_name: string
          topic_id: string
          topic_name: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      submit_test: {
        Args: {
          p_answers: Json
          p_time: number
          p_title: string
          p_type: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "student"
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
    Enums: {
      app_role: ["admin", "student"],
    },
  },
} as const
