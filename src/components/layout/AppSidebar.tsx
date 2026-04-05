'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, Map } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

import { signOut } from '@/lib/auth/actions'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

interface AppSidebarProps {
  user: User
  isAdmin: boolean
  profile: { display_name: string | null; avatar_url: string | null } | null
}

const navItems = [
  { label: 'Itinerary', href: '/itinerary', icon: CalendarDays },
  { label: 'Map', href: '/map', icon: Map },
]

export function AppSidebar({ user, isAdmin, profile }: AppSidebarProps) {
  const pathname = usePathname()

  const displayName =
    profile?.display_name ??
    (user.user_metadata?.display_name as string | undefined) ??
    user.email ??
    'User'

  const avatarInitial = displayName.charAt(0).toUpperCase()

  return (
    <Sidebar className="border-r border-border hidden lg:flex">
      {/* Header: trip title and dates */}
      <SidebarHeader className="px-4 py-5 border-b border-border">
        <p className="font-heading text-[18px] italic leading-snug text-foreground">
          Berwick goes to Tuscany 2026
        </p>
        <p className="text-[12px] text-muted-foreground mt-1">May 7 - 16, 2026</p>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href || pathname.startsWith(href + '/')
                return (
                  <SidebarMenuItem key={href}>
                    <Link
                      href={href}
                      className={cn(
                        'flex items-center gap-3 h-10 px-4 w-full rounded-md text-sm transition-colors',
                        isActive
                          ? 'border-l-[3px] border-primary text-primary bg-primary/10 font-bold pl-[13px]'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted font-normal'
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </Link>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: user info + sign out */}
      <SidebarFooter className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-8 w-8 shrink-0">
            {profile?.avatar_url && (
              <AvatarImage src={profile.avatar_url} alt={displayName} />
            )}
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
              {avatarInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium truncate text-foreground">{displayName}</p>
            {isAdmin && (
              <span className="inline-flex items-center rounded-full bg-accent/30 px-2 py-0.5 text-[10px] font-medium text-accent-foreground border border-accent/50">
                Admin
              </span>
            )}
          </div>
          <form action={signOut} className="shrink-0">
            <Button type="submit" variant="ghost" size="sm" className="text-xs px-2">
              Sign Out
            </Button>
          </form>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
