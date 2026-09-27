import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://woepddzxmpnxtbiwwrvu.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvZXBkZHp4bXBueHRiaXd3cnZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4OTU5NTgsImV4cCI6MjEwNTQ3MTk1OH0.dq_qj67Tbj9uKbAhxqsXT04PdeZWhL8eVvIdGdKkNik';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: {
    schema: 'mia_bytoniproyect',
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
