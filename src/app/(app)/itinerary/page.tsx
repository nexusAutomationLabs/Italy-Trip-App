import { createClient } from '@/lib/supabase/server'
import { ItineraryClient } from './_components/ItineraryClient'
import type { EventRow } from '@/types/database.types'

export default async function ItineraryPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  const { data: events } = await supabase
    .from('events')
    .select('*, rsvps(user_id, profiles(display_name))')
    .order('event_date', { ascending: true })
    .order('start_time', { ascending: true })

  return (
    <div className="flex flex-col">
      {/* Hero section — preserved from Phase 1 */}
      <div
        className="relative w-full min-h-[40vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=1920&q=80&auto=format&fit=crop)',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-heading font-semibold drop-shadow-lg">
            Berwick goes to Tuscany 2026
          </h1>
          <p className="mt-3 text-base md:text-lg text-white/90 drop-shadow">
            May 7 – 16, 2026
          </p>
        </div>
      </div>

      {/* Itinerary */}
      <ItineraryClient
        events={(events as unknown as EventRow[]) ?? []}
        currentUserId={user?.id ?? ''}
        isAdmin={isAdmin ?? false}
      />
    </div>
  )
}
