export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: string
          xp: number
          level: number
          hearts: number
          max_hearts: number
          streak_count: number
          streak_last_updated: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          xp?: number
          level?: number
          hearts?: number
          max_hearts?: number
          streak_count?: number
          streak_last_updated?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          xp?: number
          level?: number
          hearts?: number
          max_hearts?: number
          streak_count?: number
          streak_last_updated?: string
          created_at?: string
          updated_at?: string
        }
      }
      modules: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string | null
          order_index: number
          required_level: number
          is_premium: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url?: string | null
          order_index: number
          required_level?: number
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string | null
          order_index?: number
          required_level?: number
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          module_id: string
          title: string
          description: string | null
          image_url: string | null
          order_index: number
          xp_reward: number
          is_premium: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          module_id: string
          title: string
          description?: string | null
          image_url?: string | null
          order_index: number
          xp_reward?: number
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          module_id?: string
          title?: string
          description?: string | null
          image_url?: string | null
          order_index?: number
          xp_reward?: number
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          lesson_id: string
          question_text: string
          question_type: string
          image_url: string | null
          order_index: number
          xp_value: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          question_text: string
          question_type: string
          image_url?: string | null
          order_index: number
          xp_value?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          question_text?: string
          question_type?: string
          image_url?: string | null
          order_index?: number
          xp_value?: number
          created_at?: string
          updated_at?: string
        }
      }
      answers: {
        Row: {
          id: string
          question_id: string
          answer_text: string
          is_correct: boolean
          explanation: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question_id: string
          answer_text: string
          is_correct: boolean
          explanation?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          answer_text?: string
          is_correct?: boolean
          explanation?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed: boolean
          score: number
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed?: boolean
          score?: number
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed?: boolean
          score?: number
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      badges: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          requirement_type: string
          requirement_value: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          requirement_type: string
          requirement_value: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          requirement_type?: string
          requirement_value?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          earned_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          earned_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_id?: string
          earned_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_type: string
          start_date: string
          end_date: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_type: string
          start_date?: string
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_type?: string
          start_date?: string
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      daily_goals: {
        Row: {
          id: string
          user_id: string
          xp_goal: number
          lessons_goal: number
          date: string
          xp_earned: number
          lessons_completed: number
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          xp_goal?: number
          lessons_goal?: number
          date: string
          xp_earned?: number
          lessons_completed?: number
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          xp_goal?: number
          lessons_goal?: number
          date?: string
          xp_earned?: number
          lessons_completed?: number
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_stats: {
        Row: {
          id: string
          user_id: string
          total_xp: number
          total_lessons_completed: number
          total_questions_answered: number
          correct_answers: number
          longest_streak: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_xp?: number
          total_lessons_completed?: number
          total_questions_answered?: number
          correct_answers?: number
          longest_streak?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_xp?: number
          total_lessons_completed?: number
          total_questions_answered?: number
          correct_answers?: number
          longest_streak?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
