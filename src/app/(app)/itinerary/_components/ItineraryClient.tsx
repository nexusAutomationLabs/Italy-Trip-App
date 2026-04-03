'use client'

import { useState, useMemo } from 'react'
import { DayCard } from './DayCard'
import { EventDetailPanel } from './EventDetailPanel'
import { EventFormPanel } from './EventFormPanel'
import type { EventRow } from '@/types/database.types'

interface ItineraryClientProps {
  events: EventRow[]
  currentUserId: string
  isAdmin: boolean
}

export function ItineraryClient({ events, currentUserId, isAdmin }: ItineraryClientProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null)
  const [createFormOpen, setCreateFormOpen] = useState(false)
  const [createFormDate, setCreateFormDate] = useState<string>('')

  const groupedDays = useMemo(() => {
    const map = new Map<string, EventRow[]>()
    for (const event of events) {
      const key = event.event_date
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(event)
    }
    return map
  }, [events])

  const allDates = useMemo(() => {
    const dates: string[] = []
    for (let day = 7; day <= 16; day++) {
      dates.push(`2026-05-${day.toString().padStart(2, '0')}`)
    }
    return dates
  }, [])

  function handleAddEvent(date: string) {
    setCreateFormDate(date)
    setCreateFormOpen(true)
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {allDates.map((date) => (
          <DayCard
            key={date}
            date={date}
            events={groupedDays.get(date) ?? []}
            onEventClick={setSelectedEvent}
            onAddEvent={handleAddEvent}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
          />
        ))}
      </div>
      <EventDetailPanel
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        currentUserId={currentUserId}
        isAdmin={isAdmin}
      />
      <EventFormPanel
        open={createFormOpen}
        onClose={() => setCreateFormOpen(false)}
        defaultDate={createFormDate}
      />
    </>
  )
}
