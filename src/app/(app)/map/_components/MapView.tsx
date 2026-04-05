'use client'

import { useState, useEffect } from 'react'
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps'
import type { EventCategory } from '@/types/database.types'

interface MapEvent {
  id: string
  title: string
  category: EventCategory
  event_date: string
  latitude: number
  longitude: number
  address: string | null
}

interface MapViewProps {
  events: MapEvent[]
}

// Category-based pin colors per UI-SPEC
const CATEGORY_PIN_COLORS: Record<EventCategory, { background: string; glyphColor: string; borderColor: string }> = {
  dinner: { background: '#C45D3E', glyphColor: '#ffffff', borderColor: '#A04832' },
  excursion: { background: '#6B7F3B', glyphColor: '#ffffff', borderColor: '#526030' },
  group_activity: { background: '#C4A35A', glyphColor: '#ffffff', borderColor: '#A0844A' },
  travel: { background: '#E8E0D5', glyphColor: '#8B7355', borderColor: '#C8BEB0' },
  open_day: { background: '#E8E0D5', glyphColor: '#8B7355', borderColor: '#C8BEB0' },
}

// Villa Il Palagio, Rignano sull'Arno — home base for the trip
const VILLA_CENTER = { lat: 43.6969, lng: 11.4478 }

function MapContent({ events }: MapViewProps) {
  const map = useMap()
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const selectedEvent = events.find((e) => e.id === selectedEventId) ?? null

  useEffect(() => {
    if (!map || events.length === 0) return

    const bounds = new google.maps.LatLngBounds()
    for (const event of events) {
      bounds.extend({ lat: event.latitude, lng: event.longitude })
    }

    if (events.length === 1) {
      map.setCenter(bounds.getCenter())
      map.setZoom(14)
    } else {
      map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 })
    }
  }, [map, events])

  if (events.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="text-center space-y-2 px-8">
          <p className="text-muted-foreground text-sm">
            Add location details to events to see them on the map.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Map
      defaultCenter={VILLA_CENTER}
      defaultZoom={10}
      mapId="DEMO_MAP_ID"
      style={{ width: '100%', height: '100%' }}
      gestureHandling="greedy"
      disableDefaultUI={false}
    >
      {events.map((event) => {
        const colors = CATEGORY_PIN_COLORS[event.category] ?? CATEGORY_PIN_COLORS.open_day
        return (
          <AdvancedMarker
            key={event.id}
            position={{ lat: event.latitude, lng: event.longitude }}
            onClick={() => setSelectedEventId(event.id === selectedEventId ? null : event.id)}
          >
            <Pin
              background={colors.background}
              glyphColor={colors.glyphColor}
              borderColor={colors.borderColor}
            />
          </AdvancedMarker>
        )
      })}

      {selectedEvent && (
        <InfoWindow
          position={{ lat: selectedEvent.latitude, lng: selectedEvent.longitude }}
          onCloseClick={() => setSelectedEventId(null)}
        >
          <div className="max-w-[200px] space-y-1 p-1">
            <p className="font-semibold text-sm text-foreground">{selectedEvent.title}</p>
            {selectedEvent.address && (
              <p className="text-xs text-muted-foreground">{selectedEvent.address}</p>
            )}
          </div>
        </InfoWindow>
      )}
    </Map>
  )
}

export function MapView({ events }: MapViewProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="text-center space-y-3 px-8 max-w-md">
          <p className="text-muted-foreground text-sm">
            Map requires a Google Maps API key. Add{' '}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            </code>{' '}
            to your environment variables to enable this feature.
          </p>
        </div>
      </div>
    )
  }

  return (
    <APIProvider apiKey={apiKey}>
      <MapContent events={events} />
    </APIProvider>
  )
}
