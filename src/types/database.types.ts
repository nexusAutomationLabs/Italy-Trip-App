// Placeholder database types for the Tuscany Trip App.
// These will be replaced by Supabase CLI-generated types after the project is linked:
//   supabase gen types typescript --linked > src/types/database.types.ts

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          display_name?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          display_name?: string | null
          updated_at?: string | null
        }
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
  }
}
