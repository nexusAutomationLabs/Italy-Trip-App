import { createClient } from '@/lib/supabase/server'
import { ItineraryClient } from './_components/ItineraryClient'
import type { EventRow } from '@/types/database.types'

export default async function ItineraryPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  const { data: events } = await supabase
    .from('events')
    .select('*, rsvps(user_id, profiles(display_name, avatar_url)), comments(id, user_id, content, created_at, profiles(display_name))')
    .order('event_date', { ascending: true })
    .order('start_time', { ascending: true })
    .order('created_at', { ascending: true, referencedTable: 'comments' })

  return (
    <div className="flex flex-col">
      {/* Timezone notice */}
      <p className="text-xs text-muted-foreground italic px-4 lg:px-8 pt-6">
        All times are Italy time (CEST)
      </p>

      {/* Itinerary */}
      <ItineraryClient
        events={(events as unknown as EventRow[]) ?? []}
        currentUserId={user?.id ?? ''}
        isAdmin={isAdmin ?? false}
      />
    </div>
  )
}
