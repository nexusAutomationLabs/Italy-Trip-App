import { Badge } from '@/components/ui/badge'
import { CATEGORY_STYLES, CATEGORY_LABELS } from '@/lib/constants/categories'
import type { EventRow as EventRowType } from '@/types/database.types'

interface EventRowProps {
  event: EventRowType
  onClick: (event: EventRowType) => void
}

function formatTime(time: string | null): string {
  if (!time) return 'All day'
  // Parse HH:MM:SS string directly — no Date object to avoid timezone issues
  const [hoursStr, minutesStr] = time.split(':')
  const hours = parseInt(hoursStr, 10)
  const minutes = parseInt(minutesStr, 10)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHour = hours % 12 || 12
  const displayMinutes = minutes.toString().padStart(2, '0')
  return `${displayHour}:${displayMinutes} ${period}`
}

export function EventRow({ event, onClick }: EventRowProps) {
  const count = event.rsvps?.[0]?.count ?? 0

  return (
    <button
      className="w-full flex items-center gap-3 py-3 px-2 hover:bg-muted/40 rounded-md text-left min-h-11"
      onClick={() => onClick(event)}
    >
      <span className="text-sm font-sans font-semibold text-muted-foreground w-20 shrink-0">
        {formatTime(event.start_time)}
      </span>
      <span className="flex-1 text-sm font-semibold font-sans text-foreground truncate">
        {event.title}
      </span>
      <Badge className={`${CATEGORY_STYLES[event.category]} text-xs shrink-0`}>
        {CATEGORY_LABELS[event.category]}
      </Badge>
      <span className="text-xs text-muted-foreground shrink-0">{count} attending</span>
    </button>
  )
}
