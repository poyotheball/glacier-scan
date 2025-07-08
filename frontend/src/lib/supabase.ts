import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export type Database = {
  public: {
    Tables: {
      glaciers: {
        Row: {
          id: string
          name: string
          location: { latitude: number; longitude: number }
          region: string
          country: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          location: { latitude: number; longitude: number }
          region: string
          country: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: { latitude: number; longitude: number }
          region?: string
          country?: string
          updated_at?: string
        }
      }
      measurements: {
        Row: {
          id: string
          glacier_id: string
          date: string
          ice_volume: number
          surface_area: number
          melt_rate: number
          created_at: string
        }
        Insert: {
          id?: string
          glacier_id: string
          date: string
          ice_volume: number
          surface_area: number
          melt_rate: number
          created_at?: string
        }
        Update: {
          id?: string
          glacier_id?: string
          date?: string
          ice_volume?: number
          surface_area?: number
          melt_rate?: number
        }
      }
      glacier_images: {
        Row: {
          id: string
          glacier_id: string
          image_url: string
          upload_date: string
          analysis_status: "pending" | "processing" | "completed" | "failed"
          analysis_results: any
          created_at: string
        }
        Insert: {
          id?: string
          glacier_id: string
          image_url: string
          upload_date: string
          analysis_status?: "pending" | "processing" | "completed" | "failed"
          analysis_results?: any
          created_at?: string
        }
        Update: {
          id?: string
          glacier_id?: string
          image_url?: string
          upload_date?: string
          analysis_status?: "pending" | "processing" | "completed" | "failed"
          analysis_results?: any
        }
      }
    }
  }
}
