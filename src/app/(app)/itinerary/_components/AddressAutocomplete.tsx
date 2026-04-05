'use client'

import { useRef, useEffect } from 'react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { Input } from '@/components/ui/input'

interface AddressAutocompleteProps {
  defaultValue?: string
  onSelect: (address: string, lat: number, lng: number) => void
  onChange?: (value: string) => void
  className?: string
}

export function AddressAutocomplete({
  defaultValue,
  onSelect,
  onChange,
  className,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const placesLib = useMapsLibrary('places')

  useEffect(() => {
    if (!placesLib || !inputRef.current) return

    // Use legacy Autocomplete — widely supported, simple API
    const autocomplete = new placesLib.Autocomplete(inputRef.current, {
      fields: ['formatted_address', 'geometry'],
      componentRestrictions: { country: 'it' },
    })

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place.formatted_address || !place.geometry?.location) return

      const address = place.formatted_address
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      onSelect(address, lat, lng)
    })

    return () => {
      // Clean up the listener when the component unmounts or deps change
      google.maps.event.removeListener(listener)
    }
  }, [placesLib, onSelect])

  return (
    <Input
      ref={inputRef}
      defaultValue={defaultValue}
      placeholder="Search for a place or address"
      className={className}
      onChange={(e) => onChange?.(e.target.value)}
    />
  )
}
