import type { EventCategory } from '@/types/database.types'

export const CATEGORY_STYLES: Record<EventCategory, string> = {
  dinner:         'bg-primary/15 text-primary',
  excursion:      'bg-secondary/15 text-secondary',
  group_activity: 'bg-accent/20 text-accent-foreground',
  travel:         'bg-muted text-muted-foreground',
  open_day:       'bg-muted/50 text-muted-foreground border border-border',
}

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  dinner:         'Dinner',
  excursion:      'Excursion',
  group_activity: 'Group Activity',
  travel:         'Travel',
  open_day:       'Open Day',
}
