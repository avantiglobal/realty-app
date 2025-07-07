'use server'

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.enum(["Admin", "User"]),
})

export async function addUser(values: z.infer<typeof formSchema>) {
    if (process.env.FB_DEV === 'true') {
      return { success: true, message: `DEV MODE: Invitation sent to ${values.email}.` };
    }

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const validatedFields = formSchema.safeParse(values)

    if (!validatedFields.success) {
        return { success: false, message: "Invalid data provided." }
    }
    
    const { name, email, role } = validatedFields.data;

    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.user_metadata?.role !== 'Admin') {
        return { success: false, message: "Unauthorized action." }
    }
    
    // The admin client is required to invite users.
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
        data: {
            name: name,
            role: role,
        }
    })

    if (error) {
        console.error('Supabase invite error:', error)
        return { success: false, message: error.message }
    }

    return { success: true, message: `Invitation sent to ${email}.` }
}
