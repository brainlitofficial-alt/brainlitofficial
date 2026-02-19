import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Registration {
  id?: number;
  parent_name: string;
  whatsapp: string;
  email: string;
  location: string;
  registered_at: string;
  created_at?: string;
}

export interface WebinarSettings {
  id?: number;
  next_webinar_date: string;
  updated_at?: string;
}
