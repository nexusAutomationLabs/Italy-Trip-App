import { createClient } from '@/lib/supabase/server'
import { ItineraryClient } from './_components/ItineraryClient'
import type { EventRow } from '@/types/database.types'

export default async function ItineraryPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  const { data: events } = await supabase
    .from('events')
    .select('*, rsvps(user_id, profiles(display_name, avatar_url)), comments(id, user_id, content, created_at, profiles(display_name, avatar_url))')
    .order('event_date', { ascending: true })
    .order('start_time', { ascending: true })
    .order('created_at', { ascending: true, referencedTable: 'comments' })

  const HERO_IMAGE_URL =
    'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0'

  return (
    <div className="flex flex-col">
      {/* Hero image with fade */}
      <div className="relative h-[260px] lg:h-[340px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-10 left-4 lg:left-8 right-4 lg:right-8">
          <h1 className="font-heading text-4xl lg:text-5xl italic text-foreground leading-tight">
            Berwick goes to Tuscany
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A ten-day journey through the heart of Tuscany — May 7 to 16, 2026
          </p>
        </div>
      </div>

      {/* Timezone notice */}
      <p className="text-xs text-muted-foreground italic px-4 lg:px-8 pt-4">
        All times are Italy time (CEST)
      </p>

      {/* Itinerary */}
      <ItineraryClient
        events={(events as unknown as EventRow[]) ?? []}
        currentUserId={user?.id ?? ''}
        isAdmin={isAdmin ?? false}
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      />
    </div>
  )
}
