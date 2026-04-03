'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema, signupSchema } from './schemas'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const raw = {
    display_name: formData.get('display_name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Server-side validation (trusted -- client validation is for UX only)
  const parsed = signupSchema.safeParse(raw)
  if (!parsed.success) {
    redirect('/signup?error=' + encodeURIComponent(parsed.error.errors[0].message))
  }

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        display_name: parsed.data.display_name,
      },
    },
  })

  if (error) {
    redirect('/signup?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/itinerary')
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    redirect('/login?error=' + encodeURIComponent(parsed.error.errors[0].message))
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/itinerary')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
