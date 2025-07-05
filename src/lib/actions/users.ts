'use server'

import { z } from "zod"
import { cookies } from "next/headers"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient } from "@supabase/supabase-js"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.enum(["Admin", "User"]),
})

export async function addUser(values: z.infer<typeof formSchema>) {
    const validatedFields = formSchema.safeParse(values)

    if (!validatedFields.success) {
        return { success: false, message: "Invalid data provided." }
    }

    const { name, email, role } = validatedFields.data

    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, message: "Authentication required." }
    }

    const { data: currentUserProfile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', 'ea77207e-7b13-4e64-8fb0-c7418b4f6fad') // Use hardcoded user ID for operations
        .single()

    if (profileError || !currentUserProfile || currentUserProfile.role !== 'Admin') {
        return { success: false, message: "Unauthorized. You must be an admin to add users." }
    }
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        return { success: false, message: "Server configuration error: Supabase keys not set." }
    }
    
    const supabaseAdmin = createClient(
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
        // Provide a more user-friendly error message for common cases
        if (inviteError.message.includes('unique constraint')) {
             return { success: false, message: `A user with email ${email} already exists.` }
        }
        return { success: false, message: `Failed to invite user: ${inviteError.message}` }
    }

    return { success: true, message: `Invitation sent to ${email}.` }
}
