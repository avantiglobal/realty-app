'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { redirect } from 'next/navigation'

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required." }),
})

export async function login(values: z.infer<typeof loginFormSchema>) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { email, password } = values;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Supabase login error response:', error)
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function logout() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Supabase logout error:', error)
  }

  redirect('/login')
}
