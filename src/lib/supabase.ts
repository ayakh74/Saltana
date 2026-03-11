import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type Reservation = {
  id?: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  party_size: number;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  created_at?: string;
};

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url === 'your_supabase_project_url') {
    throw new Error('Supabase environment variables are not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.');
  }

  _supabase = createClient(url, key);
  return _supabase;
}

// Named export for convenience — will throw at runtime if env vars missing
export const supabase = {
  from: (table: string) => {
    return getSupabase().from(table);
  },
};
