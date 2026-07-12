
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_PUBLIC_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'not-configured';
export const hasSupabaseConfig = SUPABASE_PUBLIC_KEY !== 'not-configured' && SUPABASE_URL.length > 0;

console.log('Supabase Client: Initializing with URL:', SUPABASE_URL);
if (SUPABASE_PUBLIC_KEY === 'not-configured') {
  console.warn('Supabase Client: running without cloud authentication configuration.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export const auth = supabase.auth;
