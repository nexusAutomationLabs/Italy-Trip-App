'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, Map } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { label: 'Itinerary', href: '/itinerary', icon: CalendarDays },
  { label: 'Map', href: '/map', icon: Map },
]

export function MobileTabBar() {
  const pathname = usePathname()

  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <nav className="flex">
        {tabs.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center h-11 gap-0.5 text-xs transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
