// Placeholder database types for the Tuscany Trip App.
// These will be replaced by Supabase CLI-generated types after the project is linked:
//   supabase gen types typescript --linked > src/types/database.types.ts

export type EventCategory = 'dinner' | 'excursion' | 'group_activity' | 'travel' | 'open_day'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          display_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_date: string
          start_time: string | null
          end_time: string | null
          category: EventCategory
          location_name: string | null
          location_url: string | null
          cover_image_url: string | null
          address: string | null
          latitude: number | null
          longitude: number | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_date: string
          start_time?: string | null
          end_time?: string | null
          category: EventCategory
          location_name?: string | null
          location_url?: string | null
          cover_image_url?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          event_date?: string
          start_time?: string | null
          end_time?: string | null
          category?: EventCategory
          location_name?: string | null
          location_url?: string | null
          cover_image_url?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          created_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          id: string
          event_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          id: string
          event_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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
      event_category: EventCategory
    }
  }
}

export type EventRow = Database['public']['Tables']['events']['Row'] & {
  rsvps: { user_id: string; profiles: { display_name: string | null; avatar_url: string | null } | null }[]
  comments: CommentRow[]
}

export type CommentRow = Database['public']['Tables']['comments']['Row'] & {
  profiles: { display_name: string | null; avatar_url: string | null } | null
}
