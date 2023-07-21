import { useEffect, useState } from 'react'
import { ICoordinate } from '~/types/dto/goong-map.dto'

export default function useGeolocation() {
  const [currentLocation, setCurrentLocation] = useState<ICoordinate>()

  useEffect(() => {
    const callback: PositionCallback = (position) => {
      const { coords } = position
      setCurrentLocation({
        lat: coords.latitude,
        lng: coords.longitude
      })
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(callback)
    }
  }, [navigator.geolocation])

  return [currentLocation, setCurrentLocation]
}
