'use server'

import { createServerClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type VisitedCountry = {
  id: string
  user_id: string
  country_name: string
  country_code: string | null
  visited_at: string
  notes: string | null
  created_at: string
}

export async function getVisitedCountries(): Promise<VisitedCountry[]> {
  const supabase = createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }
  
  const { data, error } = await supabase
    .from('visited_countries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching countries:', error)
    return []
  }

  return data || []
}

export async function addVisitedCountry(
  countryName: string,
  countryCode?: string,
  notes?: string
) {
  const supabase = createServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'User not authenticated' }
  }

  // Check if country already exists for this user
  const { data: existingCountries } = await supabase
    .from('visited_countries')
    .select('country_name, country_code')
    .eq('user_id', user.id)

  if (existingCountries) {
    const isDuplicate = existingCountries.some(
      (existing) =>
        existing.country_name.toLowerCase() === countryName.toLowerCase() ||
        (existing.country_code && countryCode &&
         existing.country_code.toUpperCase() === countryCode.toUpperCase())
    )

    if (isDuplicate) {
      return { error: `You have already added ${countryName}. Please select a different country.` }
    }
  }

  const { data, error } = await supabase
    .from('visited_countries')
    .insert([
      {
        user_id: user.id,
        country_name: countryName,
        country_code: countryCode || null,
        notes: notes || null,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error adding country:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  return { data, error: null }
}

export async function deleteVisitedCountry(id: string) {
  const supabase = createServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'User not authenticated' }
  }

  const { error } = await supabase
    .from('visited_countries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user can only delete their own countries

  if (error) {
    console.error('Error deleting country:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  return { error: null }
}

export async function updateVisitedCountryDate(
  id: string,
  visitedDate: string
) {
  const supabase = createServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'User not authenticated' }
  }

  // Convert date string to ISO format with time
  const date = new Date(visitedDate)
  if (isNaN(date.getTime())) {
    return { error: 'Invalid date format' }
  }

  const { data, error } = await supabase
    .from('visited_countries')
    .update({
      visited_at: date.toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user can only update their own countries
    .select()
    .single()

  if (error) {
    console.error('Error updating country date:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  return { data, error: null }
}
