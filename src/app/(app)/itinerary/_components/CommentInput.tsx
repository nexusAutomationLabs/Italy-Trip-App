'use client'

import { useState, useTransition } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { createComment } from '@/lib/actions/comment-actions'

interface CommentInputProps {
  eventId: string
}

export function CommentInput({ eventId }: CommentInputProps) {
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit() {
    if (!content.trim()) return
    startTransition(async () => {
      const result = await createComment({ content: content.trim(), event_id: eventId })
      if (result.success) {
        setContent('')
      }
    })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex gap-2 items-end">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a comment..."
        rows={1}
        className="min-h-9 resize-none"
        maxLength={500}
      />
      <Button
        size="icon"
        onClick={handleSubmit}
        disabled={isPending || !content.trim()}
        className="shrink-0"
      >
        <Send className="size-4" />
        <span className="sr-only">Send comment</span>
      </Button>
    </div>
  )
}
