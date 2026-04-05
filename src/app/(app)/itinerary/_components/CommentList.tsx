'use client'

import { useTransition } from 'react'
import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { deleteComment } from '@/lib/actions/comment-actions'
import type { CommentRow } from '@/types/database.types'

interface CommentListProps {
  comments: CommentRow[]
  currentUserId: string
  isAdmin: boolean
}

export function CommentList({ comments, currentUserId, isAdmin }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No comments yet. Be the first to share a note!
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          canDelete={comment.user_id === currentUserId || isAdmin}
        />
      ))}
    </div>
  )
}

function CommentItem({ comment, canDelete }: { comment: CommentRow; canDelete: boolean }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      await deleteComment(comment.id)
    })
  }

  const displayName = comment.profiles?.display_name ?? 'Unknown'
  const avatarInitial = displayName.charAt(0).toUpperCase()
  const timestamp = format(new Date(comment.created_at), 'MMM d, h:mm a')

  return (
    <div className="flex items-start gap-2 group">
      <Avatar className="size-6 shrink-0 mt-0.5">
        {comment.profiles?.avatar_url && (
          <AvatarImage src={comment.profiles.avatar_url} alt={displayName} />
        )}
        <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-semibold">
          {avatarInitial}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold">{displayName}</span>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>
        <p className="text-sm mt-0.5">{comment.content}</p>
      </div>
      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="size-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          onClick={handleDelete}
          disabled={isPending}
          aria-label="Delete comment"
        >
          <Trash2 className="size-3 text-muted-foreground" />
        </Button>
      )}
    </div>
  )
}
