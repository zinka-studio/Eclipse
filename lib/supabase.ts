import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type SiteContent = {
  id: string
  section: string
  key: string
  value: string | null
  updated_at: string
}

export type MenuItem = {
  id: string
  category: string
  name: string
  description: string | null
  price: number | null
  sort_order: number
  active: boolean
  created_at: string
  updated_at: string
}

export type Reservation = {
  id: string
  full_name: string
  email: string
  date: string
  guests: number
  special_requests: string | null
  status: 'new' | 'confirmed' | 'cancelled'
  created_at: string
}
