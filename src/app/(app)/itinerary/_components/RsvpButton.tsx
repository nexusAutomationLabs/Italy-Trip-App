'use client'

import { useOptimistic, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { toggleRsvp } from '@/lib/actions/rsvp-actions'

interface RsvpButtonProps {
  eventId: string
  initialIsAttending: boolean
}

export function RsvpButton({ eventId, initialIsAttending }: RsvpButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [isAttending, setOptimisticAttending] = useOptimistic(initialIsAttending)

  function handleClick() {
    startTransition(async () => {
      setOptimisticAttending(!isAttending)
      await toggleRsvp(eventId, !isAttending)
    })
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      variant={isAttending ? 'default' : 'outline'}
      className={isAttending
        ? 'bg-primary hover:bg-primary/90 text-primary-foreground w-full'
        : 'border-primary text-primary hover:bg-primary/10 w-full'
      }
    >
      {isAttending ? (
        <>
          <Check className="size-4 mr-2" />
          Attending
        </>
      ) : (
        "I'm in"
      )}
    </Button>
  )
}
