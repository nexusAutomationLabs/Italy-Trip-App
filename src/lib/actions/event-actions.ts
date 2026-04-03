'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { eventSchema, type EventFormData } from './event-schemas'

export async function createEvent(data: EventFormData): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const parsed = eventSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  // Coerce empty location_url to null
  const insertData = {
    ...parsed.data,
    location_url: parsed.data.location_url === '' ? null : parsed.data.location_url,
    created_by: user.id,
  }

  const { error } = await supabase.from('events').insert(insertData)
  if (error) return { success: false, error: error.message }

  revalidatePath('/itinerary')
  return { success: true }
}

export async function updateEvent(eventId: string, data: EventFormData): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const isAdmin = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  // Check ownership
  const { data: event } = await supabase
    .from('events')
    .select('created_by')
    .eq('id', eventId)
    .single()

  if (!event) return { success: false, error: 'Event not found' }
  if (!isAdmin && event.created_by !== user.id) {
    return { success: false, error: 'Not authorized' }
  }

  const parsed = eventSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const updateData = {
    ...parsed.data,
    location_url: parsed.data.location_url === '' ? null : parsed.data.location_url,
  }

  const { error } = await supabase.from('events').update(updateData).eq('id', eventId)
  if (error) return { success: false, error: error.message }

  revalidatePath('/itinerary')
  return { success: true }
}

export async function deleteEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const isAdmin = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  const { data: event } = await supabase
    .from('events')
    .select('created_by')
    .eq('id', eventId)
    .single()

  if (!event) return { success: false, error: 'Event not found' }
  if (!isAdmin && event.created_by !== user.id) {
    return { success: false, error: 'Not authorized' }
  }

  const { error } = await supabase.from('events').delete().eq('id', eventId)
  if (error) return { success: false, error: error.message }

  revalidatePath('/itinerary')
  return { success: true }
}
