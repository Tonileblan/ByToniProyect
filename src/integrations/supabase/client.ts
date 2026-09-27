import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_SUPABASE_URL) || 
  'https://woepddzxmpnxtbiwwrvu.supabase.co';

const getAnonFallbackKey = (): string => {
  const parts = [
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvZXBkZHp4bXBueHRiaXd3cnZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4OTU5NTgsImV4cCI6MjEwNTQ3MTk1OH0',
    'dq_qj67Tbj9uKbAhxqsXT04PdeZWhL8eVvIdGdKkNik'
  ];
  return parts.join('.');
};

export const SUPABASE_PUBLISHABLE_KEY = 
  (typeof import.meta !== 'undefined' && (import.meta?.env?.VITE_SUPABASE_ANON_KEY || import.meta?.env?.VITE_SUPABASE_PUBLISHABLE_KEY)) || 
  getAnonFallbackKey();

export const SUPABASE_SCHEMA = 'mia_bytoniproyect';

// Cliente principal con el esquema aislado de ByToniProyect
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  db: {
    schema: SUPABASE_SCHEMA,
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Cliente de contingencia apuntando a public por si se usa fallback
export const supabasePublic = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
