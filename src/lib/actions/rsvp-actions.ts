'use server'

import { createClient } from '@/lib/supabase/server'

export async function toggleRsvp(
  eventId: string,
  attending: boolean
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  if (attending) {
    const { error } = await supabase
      .from('rsvps')
      .insert({ event_id: eventId, user_id: user.id })
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase
      .from('rsvps')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id)
    if (error) throw new Error(error.message)
  }
  // No revalidatePath — optimistic UI handles state locally (see Pitfall 3 in RESEARCH.md)
}
