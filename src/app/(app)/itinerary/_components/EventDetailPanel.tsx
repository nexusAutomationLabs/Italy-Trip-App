'use client'

import { MapPin } from 'lucide-react'
import { format } from 'date-fns'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'
import { Badge } from '@/components/ui/badge'
import { useMediaQuery } from '@/hooks/use-media-query'
import { CATEGORY_STYLES, CATEGORY_LABELS } from '@/lib/constants/categories'
import type { EventRow } from '@/types/database.types'

interface EventDetailPanelProps {
  event: EventRow | null
  onClose: () => void
  currentUserId: string
  isAdmin: boolean
}

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

function EventDetails({
  event,
  currentUserId,
  isAdmin,
}: {
  event: EventRow
  currentUserId: string
  isAdmin: boolean
}) {
  const count = event.rsvps?.length ?? 0
  // Noon anchor prevents timezone shift when formatting event_date
  const formattedDate = format(new Date(`${event.event_date}T12:00:00`), 'EEEE, MMMM d')
  const formattedTime = formatTime(event.start_time)
  const dateTimeDisplay = event.start_time
    ? `${formattedDate} at ${formattedTime}`
    : formattedDate

  void currentUserId
  void isAdmin

  return (
    <div className="space-y-4 p-4">
      <Badge className={CATEGORY_STYLES[event.category]}>
        {CATEGORY_LABELS[event.category]}
      </Badge>
      <p className="text-sm text-muted-foreground">{dateTimeDisplay}</p>
      {event.description && (
        <p className="text-sm leading-relaxed">{event.description}</p>
      )}
      {event.location_url && (
        <a
          href={event.location_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-primary hover:underline"
          aria-label={`Open ${event.location_name ?? 'location'} in Google Maps`}
        >
          <MapPin className="size-4" />
          {event.location_name || 'View location'}
        </a>
      )}
      <p className="text-sm text-muted-foreground">{count} attending</p>
    </div>
  )
}

export function EventDetailPanel({ event, onClose, currentUserId, isAdmin }: EventDetailPanelProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Sheet open={!!event} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="right" className="w-[45%] max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-heading text-xl font-semibold">
              {event?.title}
            </SheetTitle>
            <SheetDescription className="sr-only">Event details</SheetDescription>
          </SheetHeader>
          {event && (
            <EventDetails
              event={event}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          )}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={!!event} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="font-heading text-xl font-semibold">
            {event?.title}
          </DrawerTitle>
          <DrawerDescription className="sr-only">Event details</DrawerDescription>
        </DrawerHeader>
        {event && (
          <div className="px-4 pb-6">
            <EventDetails
              event={event}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}
