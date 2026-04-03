'use client'

import Link from 'next/link'
import { signOut } from '@/lib/auth/actions'
import { Button } from '@/components/ui/button'
import type { User } from '@supabase/supabase-js'

interface HeaderProps {
  user: User
  isAdmin: boolean
}

export function Header({ user, isAdmin }: HeaderProps) {
  const displayName =
    (user.user_metadata?.display_name as string | undefined) ?? user.email ?? 'User'

  return (
    <header className="bg-background border-b px-4 py-3 flex items-center justify-between">
      {/* Left: App name */}
      <Link
        href="/itinerary"
        className="font-heading text-xl font-semibold text-foreground hover:text-primary transition-colors"
      >
        <span className="hidden sm:inline">Berwick goes to Tuscany 2026</span>
        <span className="sm:hidden">Tuscany 2026</span>
      </Link>

      {/* Right: User info + sign out */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-[200px]">
          {displayName}
        </span>
        {isAdmin && (
          <span className="inline-flex items-center rounded-full bg-accent/30 px-2 py-0.5 text-xs font-medium text-accent-foreground border border-accent/50 shrink-0">
            Admin
          </span>
        )}
        <form action={signOut} className="shrink-0">
          <Button type="submit" variant="ghost" size="sm">
            Sign Out
          </Button>
        </form>
      </div>
    </header>
  )
}
