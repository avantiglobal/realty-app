import { createClient } from '@supabase/supabase-js'

// This client is used for admin-level operations that require the service_role key.
// It should only be used in server-side code and must not be exposed to the browser.
// We use a function to ensure that environment variables are available at runtime.
export function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error('Supabase URL and/or Service Role Key are not defined. Please check your .env.local file.');
    }
    
    return createClient(
        supabaseUrl,
        supabaseServiceRoleKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
}
