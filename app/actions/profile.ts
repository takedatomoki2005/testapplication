'use server'

import { createServerClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type UserProfile = {
  id: string
  user_id: string
  nationality: string | null
  language: string | null
  hobbies: string[] | null
  created_at: string
  updated_at: string
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "not found" error, which is fine for new users
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

export async function updateUserProfile(
  nationality: string | null,
  language: string | null,
  hobbies: string[]
) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (existingProfile) {
    // Update existing profile
    const { error } = await supabase
      .from('user_profiles')
      .update({
        nationality,
        language,
        hobbies: hobbies.length > 0 ? hobbies : null,
      })
      .eq('user_id', user.id)

    if (error) {
      return { error: error.message }
    }
  } else {
    // Create new profile
    const { error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: user.id,
        nationality,
        language,
        hobbies: hobbies.length > 0 ? hobbies : null,
      })

    if (error) {
      return { error: error.message }
    }
  }

  revalidatePath('/my-page')
  return { success: true }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Verify current password by attempting to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  })

  if (signInError) {
    return { error: 'Current password is incorrect' }
  }

  // Update password
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function changeEmail(newEmail: string, password: string) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Verify password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: password,
  })

  if (signInError) {
    return { error: 'Password is incorrect' }
  }

  // Update email
  const { error } = await supabase.auth.updateUser({
    email: newEmail,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/my-page')
  return { success: true }
}

