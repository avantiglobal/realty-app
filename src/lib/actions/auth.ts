'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required." }),
})

export async function login(values: z.infer<typeof loginFormSchema>) {
  // This is a mock implementation to bypass the connection timeout issue.
  // It allows UI development to continue while network issues are resolved.
  console.log("Mock login successful for:", values.email);
  redirect('/dashboard')
}

export async function logout() {
  // This is a mock implementation to bypass the connection timeout issue.
  console.log("Mock logout successful.");
  redirect('/login')
}