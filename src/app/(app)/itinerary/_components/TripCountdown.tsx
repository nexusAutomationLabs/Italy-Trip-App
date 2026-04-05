'use client'

import { useEffect, useState } from 'react'

const TRIP_DEPARTURE_ISO = '2026-05-07T00:00:00+02:00'
const TARGET_TS = new Date(TRIP_DEPARTURE_ISO).getTime()
const SECOND_MS = 1000
const MINUTE_MS = 60 * SECOND_MS
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

function getRemainingParts(nowTs: number) {
  const remainingMs = TARGET_TS - nowTs
  if (remainingMs <= 0) return null

  const days = Math.floor(remainingMs / DAY_MS)
  const hours = Math.floor((remainingMs % DAY_MS) / HOUR_MS)
  const minutes = Math.floor((remainingMs % HOUR_MS) / MINUTE_MS)

  return { days, hours, minutes }
}

function formatPart(value: number): string {
  return value.toString().padStart(2, '0')
}

export function TripCountdown() {
  const [nowTs, setNowTs] = useState<number | null>(null)

  useEffect(() => {
    setNowTs(Date.now())
    const interval = window.setInterval(() => setNowTs(Date.now()), SECOND_MS * 30)
    return () => window.clearInterval(interval)
  }, [])

  if (!nowTs) return null

  const remaining = getRemainingParts(nowTs)
  if (!remaining) return null

  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-border/70 bg-background/45 px-5 py-3 backdrop-blur-sm">
      <p className="text-[10px] font-bold text-accent" style={{ letterSpacing: '0.1em' }}>
        COUNTDOWN TO FLORENCE
      </p>
      <div className="mt-1 grid grid-cols-3 items-end text-center">
        <div className="pr-3">
          <p className="font-heading text-5xl leading-none italic text-foreground">{formatPart(remaining.days)}</p>
          <p className="mt-1 text-[11px] font-medium text-muted-foreground" style={{ letterSpacing: '0.08em' }}>
            DAYS
          </p>
        </div>
        <div className="border-l border-r border-border/70 px-3">
          <p className="font-heading text-5xl leading-none italic text-foreground">{formatPart(remaining.hours)}</p>
          <p className="mt-1 text-[11px] font-medium text-muted-foreground" style={{ letterSpacing: '0.08em' }}>
            HOURS
          </p>
        </div>
        <div className="pl-3">
          <p className="font-heading text-5xl leading-none italic text-foreground">{formatPart(remaining.minutes)}</p>
          <p className="mt-1 text-[11px] font-medium text-muted-foreground" style={{ letterSpacing: '0.08em' }}>
            MINUTES
          </p>
        </div>
      </div>
    </div>
  )
}
