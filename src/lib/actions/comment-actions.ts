'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { commentSchema } from './event-schemas'

export async function createComment(data: { content: string; event_id: string }): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const parsed = commentSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from('comments').insert({
    event_id: parsed.data.event_id,
    user_id: user.id,
    content: parsed.data.content,
  })

  if (error) return { success: false, error: error.message }

  revalidatePath('/itinerary')
  return { success: true }
}

export async function deleteComment(commentId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const isAdmin = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  // Check ownership (admin can delete any)
  if (!isAdmin) {
    const { data: comment } = await supabase
      .from('comments')
      .select('user_id')
      .eq('id', commentId)
      .single()

    if (!comment) return { success: false, error: 'Comment not found' }
    if (comment.user_id !== user.id) {
      return { success: false, error: 'Not authorized' }
    }
  }

  const { error } = await supabase.from('comments').delete().eq('id', commentId)
  if (error) return { success: false, error: error.message }

  revalidatePath('/itinerary')
  return { success: true }
}
