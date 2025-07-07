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
  if (process.env.FB_DEV === 'true') {
    return redirect('/dashboard');
  }

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { email, password } = values;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Supabase login error response:', error)
    // Redirecting with an error message in the URL is not ideal,
    // but it was the state before the last change.
    return redirect(`/login?message=${error.message}`)
  }

  redirect('/dashboard')
}

export async function logout() {
  if (process.env.FB_DEV === 'true') {
    return redirect('/login');
  }

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Supabase logout error:', error)
  }

  redirect('/login')
}
