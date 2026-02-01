import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing! Authentication functionality will mock or fail.")
}

// Fallback to a valid-looking URL if env vars are missing/placeholder to prevent crash
const validUrl = (url) => url && url.startsWith('http') ? url : 'https://example.supabase.co';
const validKey = (key) => key || 'mock-key';

export const supabase = createClient(validUrl(supabaseUrl), validKey(supabaseAnonKey));
