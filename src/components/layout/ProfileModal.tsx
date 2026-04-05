'use client'

import { useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { uploadAvatar } from '@/lib/supabase/storage'
import { updateProfile } from '@/lib/actions/profile-actions'

interface ProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  currentDisplayName: string | null
  currentAvatarUrl: string | null
}

export function ProfileModal({
  open,
  onOpenChange,
  userId,
  currentDisplayName,
  currentAvatarUrl,
}: ProfileModalProps) {
  const [displayName, setDisplayName] = useState(currentDisplayName ?? '')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(currentAvatarUrl)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const avatarInitial = (currentDisplayName ?? displayName ?? '?').charAt(0).toUpperCase()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Client-side validation
    if (file.size > 5 * 1024 * 1024) {
      setError('Photo must be under 5 MB. Please choose a smaller file.')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please upload a JPEG, PNG, or WebP image.')
      return
    }

    setError(null)
    setSelectedFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSave() {
    setIsSaving(true)
    setError(null)

    try {
      let avatarUrl: string | undefined

      if (selectedFile) {
        avatarUrl = await uploadAvatar(selectedFile, userId)
      }

      const updateData: { display_name?: string; avatar_url?: string } = {}
      if (displayName.trim()) updateData.display_name = displayName.trim()
      if (avatarUrl) updateData.avatar_url = avatarUrl

      const result = await updateProfile(updateData)
      if (!result.success) {
        setError(result.error ?? 'Something went wrong. Please try again.')
        return
      }

      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Avatar preview + upload */}
          <div className="flex flex-col items-center gap-3">
            <Avatar className="size-16">
              {avatarPreview && <AvatarImage src={avatarPreview} alt={displayName || 'Profile photo'} />}
              <AvatarFallback className="bg-primary/20 text-primary text-xl font-semibold">
                {avatarInitial}
              </AvatarFallback>
            </Avatar>

            <div className="text-center">
              <button
                type="button"
                className="text-sm text-primary hover:underline cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload a photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, or WebP · Max 5 MB</p>
            </div>
          </div>

          {/* Display name */}
          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
