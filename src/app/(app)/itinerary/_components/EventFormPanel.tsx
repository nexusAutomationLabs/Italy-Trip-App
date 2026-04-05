'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useTransition, useState, useRef } from 'react'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMediaQuery } from '@/hooks/use-media-query'
import { eventSchema } from '@/lib/actions/event-schemas'
import type { EventFormData } from '@/lib/actions/event-schemas'
import { createEvent, updateEvent } from '@/lib/actions/event-actions'
import { uploadEventCover } from '@/lib/supabase/storage'
import { CATEGORY_LABELS } from '@/lib/constants/categories'
import type { EventRow, EventCategory } from '@/types/database.types'
import { z } from 'zod'

// Use the input type (allows category to be optional with default) for form state
type EventFormInput = z.input<typeof eventSchema>

interface EventFormPanelProps {
  open: boolean
  onClose: () => void
  defaultDate?: string
  event?: EventRow // if provided, edit mode
}

export function EventFormPanel({ open, onClose, defaultDate, event }: EventFormPanelProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [isPending, startTransition] = useTransition()
  const isEditMode = !!event
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(
    event?.cover_image_url ?? null
  )
  const [coverError, setCoverError] = useState<string | null>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<EventFormInput>({
    resolver: zodResolver(eventSchema) as never,
    defaultValues: event
      ? {
          title: event.title,
          event_date: event.event_date,
          start_time: event.start_time ?? undefined,
          description: event.description ?? undefined,
          location_name: event.location_name ?? undefined,
          location_url: event.location_url ?? undefined,
          address: event.address ?? undefined,
          category: event.category,
          cover_image_url: event.cover_image_url ?? undefined,
        }
      : {
          title: '',
          event_date: defaultDate ?? '',
          category: 'open_day' as EventCategory,
        },
  })

  useEffect(() => {
    if (event) {
      form.reset({
        title: event.title,
        event_date: event.event_date,
        start_time: event.start_time ?? undefined,
        description: event.description ?? undefined,
        location_name: event.location_name ?? undefined,
        location_url: event.location_url ?? undefined,
        address: event.address ?? undefined,
        category: event.category,
        cover_image_url: event.cover_image_url ?? undefined,
      })
      setCoverPreview(event.cover_image_url ?? null)
      setCoverFile(null)
    } else {
      form.reset({
        title: '',
        event_date: defaultDate ?? '',
        category: 'open_day' as EventCategory,
      })
      setCoverPreview(null)
      setCoverFile(null)
    }
  }, [event, defaultDate, form])

  function handleCoverFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setCoverError('Photo must be under 5 MB. Please choose a smaller file.')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setCoverError('Please upload a JPEG, PNG, or WebP image.')
      return
    }

    setCoverError(null)
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  function onSubmit(data: EventFormInput) {
    startTransition(async () => {
      let coverImageUrl: string | undefined = data.cover_image_url ?? undefined

      if (coverFile) {
        // For new events, use a temp UUID for the upload path
        const uploadId = isEditMode ? event!.id : crypto.randomUUID()
        try {
          coverImageUrl = await uploadEventCover(coverFile, uploadId)
        } catch (err) {
          setCoverError(err instanceof Error ? err.message : 'Upload failed.')
          return
        }
      }

      const submitData: EventFormData = {
        ...(data as EventFormData),
        cover_image_url: coverImageUrl ?? null,
      }

      const result = isEditMode
        ? await updateEvent(event!.id, submitData)
        : await createEvent(submitData)
      if (result.success) {
        form.reset()
        setCoverFile(null)
        setCoverPreview(null)
        onClose()
      }
    })
  }

  const title = isEditMode ? 'Edit Event' : 'Add Event'

  const formContent = (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
      {/* Cover Photo */}
      <div className="space-y-2">
        <Label htmlFor="cover_photo">Cover Photo</Label>
        {coverPreview && (
          <img
            src={coverPreview}
            alt="Cover photo preview"
            className="object-cover rounded-md w-full h-[80px]"
          />
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-sm text-primary hover:underline cursor-pointer"
            onClick={() => coverInputRef.current?.click()}
          >
            {coverPreview ? 'Change photo' : 'Upload a photo'}
          </button>
          <input
            ref={coverInputRef}
            id="cover_photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleCoverFileChange}
          />
          <span className="text-xs text-muted-foreground">JPEG, PNG, or WebP · Max 5 MB</span>
        </div>
        {coverError && (
          <p className="text-sm text-destructive">{coverError}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" {...form.register('title')} placeholder="Event title" />
        {form.formState.errors.title && (
          <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="event_date">Date *</Label>
        <Input id="event_date" type="date" {...form.register('event_date')} />
        {form.formState.errors.event_date && (
          <p className="text-sm text-destructive">{form.formState.errors.event_date.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="start_time">Time</Label>
        <Input id="start_time" type="time" {...form.register('start_time')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={form.watch('category') ?? 'open_day'}
          onValueChange={(value) => form.setValue('category', value as EventCategory)}
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              {CATEGORY_LABELS[(form.watch('category') ?? 'open_day') as EventCategory]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(CATEGORY_LABELS) as [EventCategory, string][]).map(
              ([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...form.register('description')}
          placeholder="Add details..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location_name">Location name</Label>
        <Input
          id="location_name"
          {...form.register('location_name')}
          placeholder="e.g. Trattoria Mario"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          {...form.register('address')}
          placeholder="Street address or place name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location_url">Location URL</Label>
        <Input
          id="location_url"
          {...form.register('location_url')}
          placeholder="https://maps.google.com/..."
        />
        {form.formState.errors.location_url && (
          <p className="text-sm text-destructive">{form.formState.errors.location_url.message}</p>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Event'}
        </Button>
      </div>
    </form>
  )

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
        <SheetContent side="right" className="w-[45%] max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-heading text-xl font-semibold">{title}</SheetTitle>
            <SheetDescription className="sr-only">{title} form</SheetDescription>
          </SheetHeader>
          {formContent}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="font-heading text-xl font-semibold">{title}</DrawerTitle>
          <DrawerDescription className="sr-only">{title} form</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-6 overflow-y-auto max-h-[80vh]">
          {formContent}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
