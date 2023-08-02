import { create } from 'zustand'
import { ICoordinate } from '~/types/dto/goong-map.dto'

interface PassengerState {
  originText: string
  setOriginText: (value: string) => void
  destinationText: string
  setDestinationText: (value: string) => void

  origin: ICoordinate | undefined
  setOrigin: (value: ICoordinate | undefined) => void
  destination: ICoordinate | undefined
  setDestination: (value: ICoordinate | undefined) => void

  driver: any
  setDriver: (value: any) => void

  status: string
  setStatus: (value: string) => void

  directionsData: any
  setDirectionsData: (value: any) => void

  trip: any
  setTrip: (value: any) => void
}

const usePassengerStore = create<PassengerState>((set) => ({
  originText: '',
  setOriginText: (value: string) => set(() => ({ originText: value })),
  destinationText: '',
  setDestinationText: (value: string) => set(() => ({ destinationText: value })),

  origin: undefined,
  setOrigin: (value: ICoordinate | undefined) => set(() => ({ origin: value })),
  destination: undefined,
  setDestination: (value: ICoordinate | undefined) => set(() => ({ destination: value })),

  driver: { id: '', location: null, route: '' },
  setDriver: (value: any) => set(() => ({ driver: value })),

  status: '',
  setStatus: (value: string) => set(() => ({ status: value })),

  directionsData: undefined,
  setDirectionsData: (value: any) => set(() => ({ directionsData: value })),

  trip: undefined,
  setTrip: (value: any) => set(() => ({ trip: value }))
}))

export { usePassengerStore }
