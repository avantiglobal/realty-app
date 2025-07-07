'use server'

import { z } from "zod"
import { cookies } from "next/headers"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.enum(["Admin", "User"]),
})

export async function addUser(values: z.infer<typeof formSchema>) {
    const cookieStore = cookies()
    const validatedFields = formSchema.safeParse(values)

    if (!validatedFields.success) {
        return { success: false, message: "Invalid data provided." }
    }

    const { name, email, role } = validatedFields.data
    
    const supabase = createServerClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, message: "Authentication required." }
    }

    // Check the user's role from their metadata to authorize the action.
    // This avoids an extra database call to the 'users' table.
    if (user.user_metadata?.role !== 'Admin') {
        return { success: false, message: "Unauthorized. You must be an admin to add users." }
    }
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        return { success: false, message: "Server configuration error: Supabase keys not set." }
    }
    
    const supabaseAdmin = createAdminClient(
        supabaseUrl,
        supabaseServiceRoleKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
    const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
        email,
        { data: { name, role } }
    )

    if (inviteError) {
        console.error("Error inviting user:", inviteError)
        // Provide a more user-friendly error message for common cases
        if (inviteError.message.includes('unique constraint')) {
             return { success: false, message: `A user with email ${email} already exists.` }
        }
        return { success: false, message: `Failed to invite user: ${inviteError.message}` }
    }

    return { success: true, message: `Invitation sent to ${email}.` }
}
