

import { hasSupabaseConfig } from './supabaseClient';

export const isDemoMode = () => {
  if (typeof window === 'undefined') return false;
  return !hasSupabaseConfig;
};
