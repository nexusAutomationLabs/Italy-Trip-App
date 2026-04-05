'use client'

import { Badge } from '@/components/ui/badge'
import { CATEGORY_STYLES, CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/constants/categories'
import { AvatarStrip } from './AvatarStrip'
import type { EventRow } from '@/types/database.types'

interface EventCardProps {
  event: EventRow
  onClick: (event: EventRow) => void
}

// Parse HH:MM:SS string directly — no Date object to avoid timezone issues (research pitfall 5)
function formatTime(time: string | null): string {
  if (!time) return 'All day'
  const [hoursStr, minutesStr] = time.split(':')
  const hours = parseInt(hoursStr, 10)
  const minutes = parseInt(minutesStr, 10)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHour = hours % 12 || 12
  const displayMinutes = minutes.toString().padStart(2, '0')
  return `${displayHour}:${displayMinutes} ${period}`
}

// Extract only the background color class from CATEGORY_STYLES for the color strip
function getCategoryBgColor(category: EventRow['category']): string {
  const style = CATEGORY_STYLES[category]
  // Extract the bg-* class(es) from the full style string
  const bgClass = style.split(' ').filter(c => c.startsWith('bg-')).join(' ')
  return bgClass || 'bg-muted'
}

export function EventCard({ event, onClick }: EventCardProps) {
  const CategoryIcon = CATEGORY_ICONS[event.category]

  return (
    <button
      className="min-w-[260px] max-w-[320px] flex-shrink-0 flex flex-col bg-card rounded-lg border border-border cursor-pointer text-left hover:shadow-md hover:border-l-2 hover:border-l-primary transition-all"
      onClick={() => onClick(event)}
      type="button"
    >
      {/* Cover photo or category color strip */}
      {event.cover_image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.cover_image_url}
          alt={event.title}
          className="w-full h-[80px] object-cover rounded-t-lg"
        />
      ) : (
        <div className={`w-full h-2 rounded-t-lg ${getCategoryBgColor(event.category)}`} />
      )}

      {/* Card body */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        {/* Top row: category badge + time */}
        <div className="flex items-center justify-between gap-2">
          <Badge className={`${CATEGORY_STYLES[event.category]} text-xs`}>
            {CATEGORY_LABELS[event.category]}
          </Badge>
          <span className="text-[12px] text-muted-foreground shrink-0">
            {formatTime(event.start_time)}
          </span>
        </div>

        {/* Title: Playfair Display, bold italic, single line truncate */}
        <h3 className="font-heading text-[18px] font-bold italic leading-[1.2] truncate">
          {event.title}
        </h3>

        {/* Description snippet: 2-line clamp */}
        {event.description && (
          <p className="text-[14px] text-muted-foreground line-clamp-2 leading-[1.5]">
            {event.description}
          </p>
        )}

        {/* Bottom row: avatars + category icon */}
        <div className="flex items-end justify-between mt-auto pt-1">
          <AvatarStrip attendees={event.rsvps} maxVisible={3} />
          <CategoryIcon className="size-5 text-muted-foreground shrink-0" />
        </div>
      </div>
    </button>
  )
}
