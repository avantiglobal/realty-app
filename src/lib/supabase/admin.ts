import { createClient } from '@supabase/supabase-js'

// This client is used for admin-level operations that require the service_role key.
// It should only be used in server-side code and must not be exposed to the browser.
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)
