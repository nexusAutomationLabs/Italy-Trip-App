import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HorizontalDayRow } from './HorizontalDayRow'
import type { EventRow } from '@/types/database.types'

const DAY_ORDINALS = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN']

function getDayNumber(date: string): string {
  const tripStart = new Date('2026-05-07T12:00:00')
  const current = new Date(`${date}T12:00:00`)
  const diff = Math.round((current.getTime() - tripStart.getTime()) / (1000 * 60 * 60 * 24))
  return DAY_ORDINALS[diff] ?? `${diff + 1}`
}

interface DayCardProps {
  date: string
  events: EventRow[]
  onEventClick: (event: EventRow) => void
  onAddEvent: (date: string) => void
  currentUserId: string
  isAdmin: boolean
}

export function DayCard({ date, events, onEventClick, onAddEvent, currentUserId, isAdmin }: DayCardProps) {
  const isArrival = date === '2026-05-07'
  const isDeparture = date === '2026-05-16'
  const isSpecialDay = isArrival || isDeparture

  // Noon anchor prevents UTC midnight → previous day shift in North American timezones
  const formattedDate = format(new Date(`${date}T12:00:00`), 'EEEE, MMMM d')
  const dayOrdinal = getDayNumber(date)

  void currentUserId
  void isAdmin

  return (
    <section className={`space-y-3 ${isSpecialDay ? 'border-l-4 border-primary pl-4' : ''}`}>
      {/* Day header */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          {/* "DAY ONE" ornamental label */}
          <p
            className="text-[12px] font-bold text-accent"
            style={{ letterSpacing: '0.1em' }}
          >
            DAY {dayOrdinal}
          </p>
          {/* "Thursday, May 7" date */}
          <h2 className="text-[18px] font-bold font-sans leading-[1.3]">
            {formattedDate}
          </h2>
          {/* Arrival/departure sub-label */}
          {isArrival && (
            <p className="text-[12px] text-muted-foreground">Arrival Day</p>
          )}
          {isDeparture && (
            <p className="text-[12px] text-muted-foreground">Departure Day</p>
          )}
        </div>

        {/* Inline "+ Add Event" button in header area */}
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 text-muted-foreground hover:text-foreground"
          onClick={() => onAddEvent(date)}
        >
          <Plus className="size-4" />
          <span className="sr-only">Add Event</span>
        </Button>
      </div>

      {/* Events or empty state */}
      {events.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-2">
          <p className="text-[14px] font-bold">Nothing planned yet</p>
          <p className="text-[12px] text-muted-foreground">
            Add something for the group to do on this day.
          </p>
          <Button
            variant="ghost"
            className="w-full mt-1"
            onClick={() => onAddEvent(date)}
          >
            <Plus className="size-4 mr-1" />
            Add Event
          </Button>
        </div>
      ) : (
        <HorizontalDayRow events={events} onEventClick={onEventClick} />
      )}
    </section>
  )
}
