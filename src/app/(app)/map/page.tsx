import { createClient } from '@/lib/supabase/server'
import { MapView } from './_components/MapView'
import type { EventCategory } from '@/types/database.types'

interface MapEvent {
  id: string
  title: string
  category: EventCategory
  event_date: string
  latitude: number
  longitude: number
  address: string | null
}

export default async function MapPage() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('events')
    .select('id, title, category, event_date, latitude, longitude, address')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .order('event_date', { ascending: true })

  // Cast is safe: .not('latitude/longitude', 'is', null) filters out null rows
  const mapEvents = (events ?? []) as unknown as MapEvent[]

  return (
    <div className="h-[calc(100vh-64px)] lg:h-screen w-full">
      <MapView events={mapEvents} />
    </div>
  )
}
