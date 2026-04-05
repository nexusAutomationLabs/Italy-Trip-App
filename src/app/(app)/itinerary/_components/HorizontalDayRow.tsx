'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { EventCard } from './EventCard'
import type { EventRow } from '@/types/database.types'

interface HorizontalDayRowProps {
  events: EventRow[]
  onEventClick: (event: EventRow) => void
}

export function HorizontalDayRow({ events, onEventClick }: HorizontalDayRowProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })

    const observer = new ResizeObserver(updateScrollState)
    observer.observe(el)

    return () => {
      el.removeEventListener('scroll', updateScrollState)
      observer.disconnect()
    }
  }, [updateScrollState])

  function scrollLeft() {
    containerRef.current?.scrollBy({ left: -300, behavior: 'smooth' })
  }

  function scrollRight() {
    containerRef.current?.scrollBy({ left: 300, behavior: 'smooth' })
  }

  return (
    <div className="relative w-full min-w-0">
      {/* Scroll arrow — left (desktop only) */}
      <div className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10">
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            aria-label="Scroll left"
            className="flex items-center justify-center size-8 rounded-full bg-card/80 backdrop-blur-sm shadow-md text-foreground hover:text-primary transition-colors"
            type="button"
          >
            <ChevronLeft className="size-4" />
          </button>
        )}
      </div>

      {/* Card row */}
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto pb-2 px-1 w-full max-w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ touchAction: 'pan-x pan-y', WebkitOverflowScrolling: 'touch' }}
      >
        {events.map((event) => (
          <div
            key={event.id}
            className="shrink-0 w-[280px]"
          >
            <EventCard event={event} onClick={onEventClick} />
          </div>
        ))}
      </div>

      {/* Scroll arrow — right (desktop only) */}
      <div className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10">
        {canScrollRight && (
          <button
            onClick={scrollRight}
            aria-label="Scroll right"
            className="flex items-center justify-center size-8 rounded-full bg-card/80 backdrop-blur-sm shadow-md text-foreground hover:text-primary transition-colors"
            type="button"
          >
            <ChevronRight className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}
