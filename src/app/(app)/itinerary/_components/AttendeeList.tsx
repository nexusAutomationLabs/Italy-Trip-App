import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Attendee {
  user_id: string
  profiles: { display_name: string | null; avatar_url: string | null } | null
}

interface AttendeeListProps {
  attendees: Attendee[]
}

const AVATAR_COLORS = [
  'bg-[oklch(0.65_0.12_50)]',   // terracotta
  'bg-[oklch(0.60_0.10_140)]',  // sage
  'bg-[oklch(0.65_0.08_200)]',  // dusty blue
  'bg-[oklch(0.70_0.09_280)]',  // lavender
  'bg-[oklch(0.62_0.11_30)]',   // burnt sienna
  'bg-[oklch(0.68_0.07_170)]',  // muted green
  'bg-[oklch(0.66_0.10_310)]',  // mauve
  'bg-[oklch(0.64_0.09_60)]',   // ochre
]

function getInitials(name: string | null): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function AttendeeList({ attendees }: AttendeeListProps) {
  if (attendees.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No one has RSVP&apos;d yet</p>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">
        {attendees.length} attending
      </h3>
      <div className="space-y-2">
        {attendees.map((attendee, index) => (
          <div key={attendee.user_id} className="flex items-center gap-2">
            <Avatar className="size-8">
              {attendee.profiles?.avatar_url && (
                <AvatarImage
                  src={attendee.profiles.avatar_url}
                  alt={attendee.profiles?.display_name ?? 'Attendee'}
                />
              )}
              <AvatarFallback
                className={`${AVATAR_COLORS[index % AVATAR_COLORS.length]} text-white text-xs font-semibold`}
              >
                {getInitials(attendee.profiles?.display_name ?? null)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">
              {attendee.profiles?.display_name ?? 'Unknown'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
