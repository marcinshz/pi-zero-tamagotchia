import {createClient, SupabaseClient} from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export function initializeDB(): SupabaseClient | undefined {
    if (supabaseKey && supabaseUrl) {
        return createClient(supabaseUrl, supabaseKey)
    }
}
