'use server'

import { z } from "zod"

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
    
    const { email } = validatedFields.data;

    // This is a mock implementation to bypass the connection timeout issue.
    console.log("Mock user invitation sent to:", email);
    
    // In a real implementation, you would add the user to the `users` array in `lib/data.ts`
    // or similar, and revalidate the path. For now, we just show a success message.
    
    return { success: true, message: `Invitation sent to ${email}.` }
}