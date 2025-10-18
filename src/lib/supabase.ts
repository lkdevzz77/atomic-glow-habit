import { createClient } from '@supabase/supabase-js';
import type { Database as GeneratedDatabase } from '@/integrations/supabase/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Re-use the generated Database types from integrations to ensure consistency
export type Database = GeneratedDatabase;

// Criar cliente tipado do Supabase
export type TypedSupabaseClient = ReturnType<typeof createClient<Database>>;

// Criar e exportar cliente
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);