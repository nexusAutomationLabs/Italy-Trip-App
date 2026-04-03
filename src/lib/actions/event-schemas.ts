import { z } from 'zod'

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  start_time: z.string().nullable().optional(),
  description: z.string().max(2000).nullable().optional(),
  location_name: z.string().max(200).nullable().optional(),
  location_url: z.string().url('Invalid URL').or(z.literal('')).nullable().optional(),
  category: z.enum(['dinner', 'excursion', 'group_activity', 'travel', 'open_day']).default('open_day'),
})

export type EventFormData = z.infer<typeof eventSchema>

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(500),
  event_id: z.string().uuid(),
})

export type CommentFormData = z.infer<typeof commentSchema>
