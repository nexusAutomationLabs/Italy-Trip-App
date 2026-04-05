import { createClient } from '@/lib/supabase/client'

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  // Validate before upload
  if (file.size > 5 * 1024 * 1024) throw new Error('Photo must be under 5 MB. Please choose a smaller file.')
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Please upload a JPEG, PNG, or WebP image.')
  }

  const supabase = createClient()
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const path = `${userId}/avatar.${ext}`

  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return data.publicUrl
}

export async function uploadEventCover(file: File, eventId: string): Promise<string> {
  if (file.size > 5 * 1024 * 1024) throw new Error('Photo must be under 5 MB. Please choose a smaller file.')
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Please upload a JPEG, PNG, or WebP image.')
  }

  const supabase = createClient()
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const path = `${eventId}/cover.${ext}`

  const { error } = await supabase.storage
    .from('event-covers')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from('event-covers').getPublicUrl(path)
  return data.publicUrl
}
