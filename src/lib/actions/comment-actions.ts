'use server'

import { revalidatePath } from 'next/cache'
import { createClient, createServiceClient } from '@/lib/supabase/server'
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
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    const isAdmin = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

    const { data: comment, error: fetchError } = await supabase
      .from('comments')
      .select('id, user_id')
      .eq('id', commentId)
      .maybeSingle()

    if (fetchError) return { success: false, error: fetchError.message }
    if (!comment) return { success: false, error: 'Comment not found' }

    const isOwner = comment.user_id === user.id
    if (!isOwner && !isAdmin) {
      return { success: false, error: 'Not authorized' }
    }

    // Admin deletes can bypass RLS ownership checks using service role.
    // If service role key is unavailable, fall back to the user-scoped client
    // and return a normal authorization error instead of crashing.
    const canUseServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
    const deleteClient = isAdmin && canUseServiceRole ? createServiceClient() : supabase

    const { error, count } = await deleteClient
      .from('comments')
      .delete({ count: 'exact' })
      .eq('id', commentId)

    if (error) return { success: false, error: error.message }
    if ((count ?? 0) === 0) return { success: false, error: 'Comment not found' }

    revalidatePath('/itinerary')
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to delete comment. Please try again.' }
  }
}
