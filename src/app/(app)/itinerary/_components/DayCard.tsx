import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EventRow } from './EventRow'
import type { EventRow as EventRowType } from '@/types/database.types'

interface DayCardProps {
  date: string
  events: EventRowType[]
  onEventClick: (event: EventRowType) => void
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

  void currentUserId
  void isAdmin

  return (
    <Card className={isSpecialDay ? 'border-l-4 border-primary' : ''}>
      <CardHeader>
        <h2 className="font-heading text-xl font-semibold">{formattedDate}</h2>
        {isArrival && (
          <span className="text-sm text-muted-foreground">Arrival Day</span>
        )}
        {isDeparture && (
          <span className="text-sm text-muted-foreground">Departure Day</span>
        )}
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing scheduled yet</p>
        ) : (
          <div className="divide-y divide-border">
            {events.map((event) => (
              <EventRow key={event.id} event={event} onClick={onEventClick} />
            ))}
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-muted-foreground hover:text-foreground"
          onClick={() => onAddEvent(date)}
        >
          <Plus className="size-4 mr-1" />
          Add Event
        </Button>
      </CardContent>
    </Card>
  )
}
