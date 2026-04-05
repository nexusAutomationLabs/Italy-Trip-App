'use client'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface AvatarStripProps {
  attendees: {
    user_id: string
    profiles: { display_name: string | null; avatar_url: string | null } | null
  }[]
  maxVisible?: number
}

export function AvatarStrip({ attendees, maxVisible = 3 }: AvatarStripProps) {
  if (!attendees || attendees.length === 0) return null

  const visible = attendees.slice(0, maxVisible)
  const overflow = attendees.length - maxVisible

  return (
    <div className="flex items-center">
      {visible.map((attendee, index) => {
        const name = attendee.profiles?.display_name ?? null
        const avatarUrl = attendee.profiles?.avatar_url ?? null
        const fallbackLetter = name ? name.charAt(0).toUpperCase() : '?'
        return (
          <Avatar
            key={attendee.user_id}
            className={index > 0 ? '-ml-1' : ''}
            title={name ?? undefined}
          >
            {avatarUrl && <AvatarImage src={avatarUrl} alt={name ?? 'Attendee'} />}
            <AvatarFallback className="text-xs bg-muted text-muted-foreground">
              {fallbackLetter}
            </AvatarFallback>
          </Avatar>
        )
      })}
      {overflow > 0 && (
        <div className="-ml-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground ring-2 ring-background">
          +{overflow}
        </div>
      )}
    </div>
  )
}
