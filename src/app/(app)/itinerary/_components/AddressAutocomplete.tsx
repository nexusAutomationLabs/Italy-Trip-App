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
  const onSelectRef = useRef(onSelect)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const placesLib = useMapsLibrary('places')

  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  useEffect(() => {
    if (!placesLib || !inputRef.current || autocompleteRef.current) return

    const autocomplete = new placesLib.Autocomplete(inputRef.current, {
      fields: ['formatted_address', 'geometry'],
    })
    autocompleteRef.current = autocomplete

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place.formatted_address || !place.geometry?.location) return

      const address = place.formatted_address
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      onSelectRef.current(address, lat, lng)
    })

    return () => {
      google.maps.event.removeListener(listener)
      autocompleteRef.current = null
    }
  }, [placesLib])

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
