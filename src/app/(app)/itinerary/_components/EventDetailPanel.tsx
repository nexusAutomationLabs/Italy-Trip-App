'use client'

import { useState } from 'react'
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
import { Separator } from '@/components/ui/separator'
import { useMediaQuery } from '@/hooks/use-media-query'
import { CATEGORY_STYLES, CATEGORY_LABELS } from '@/lib/constants/categories'
import type { EventRow } from '@/types/database.types'
import { RsvpButton } from './RsvpButton'
import { AttendeeList } from './AttendeeList'
import { EventActions } from './EventActions'
import { EventFormPanel } from './EventFormPanel'
import { CommentList } from './CommentList'
import { CommentInput } from './CommentInput'

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
  onEdit,
  onDeleted,
}: {
  event: EventRow
  currentUserId: string
  isAdmin: boolean
  onEdit: () => void
  onDeleted: () => void
}) {
  // Noon anchor prevents timezone shift when formatting event_date
  const formattedDate = format(new Date(`${event.event_date}T12:00:00`), 'EEEE, MMMM d')
  const formattedTime = formatTime(event.start_time)
  const dateTimeDisplay = event.start_time
    ? `${formattedDate} at ${formattedTime}`
    : formattedDate

  const isAttending = event.rsvps.some((r) => r.user_id === currentUserId)

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start justify-between gap-2">
        <Badge className={CATEGORY_STYLES[event.category]}>
          {CATEGORY_LABELS[event.category]}
        </Badge>
        <EventActions
          eventId={event.id}
          onEdit={onEdit}
          onDeleted={onDeleted}
        />
      </div>
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
      <Separator />
      <RsvpButton
        eventId={event.id}
        initialIsAttending={isAttending}
      />
      <Separator />
      <AttendeeList attendees={event.rsvps} />
      <Separator />
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Comments</h3>
        <CommentList
          comments={event.comments ?? []}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
        />
        <CommentInput eventId={event.id} />
      </div>
    </div>
  )
}

export function EventDetailPanel({ event, onClose, currentUserId, isAdmin }: EventDetailPanelProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [editingEvent, setEditingEvent] = useState<EventRow | null>(null)

  function handleEdit() {
    if (event) {
      setEditingEvent(event)
      onClose()
    }
  }

  if (isDesktop) {
    return (
      <>
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
                onEdit={handleEdit}
                onDeleted={onClose}
              />
            )}
          </SheetContent>
        </Sheet>
        <EventFormPanel
          open={!!editingEvent}
          onClose={() => setEditingEvent(null)}
          event={editingEvent ?? undefined}
        />
      </>
    )
  }

  return (
    <>
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
                onEdit={handleEdit}
                onDeleted={onClose}
              />
            </div>
          )}
        </DrawerContent>
      </Drawer>
      <EventFormPanel
        open={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        event={editingEvent ?? undefined}
      />
    </>
  )
}
