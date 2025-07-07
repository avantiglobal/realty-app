'use server'

import { z } from 'zod'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required." }),
})

export async function login(values: z.infer<typeof loginFormSchema>) {
  const cookieStore = cookies()
  const validatedFields = loginFormSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { email, password } = validatedFields.data
  const supabase = createClient(cookieStore)

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return redirect('/dashboard')
}

export async function logout() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Error logging out:", error)
  }

  return redirect('/login')
}
