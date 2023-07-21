import { create } from 'zustand'

interface DriverStoreState {
  sibarShow: boolean
  setSibarShow: (value: boolean) => void

  isOnline: boolean
  setIsOnline: (value: boolean) => void

  tripStatus: string
  setTripStatus: (value: string) => void

  trip: any
  setTrip: (value: any) => void
}

const useDriverStore = create<DriverStoreState>((set) => ({
  sibarShow: false,
  setSibarShow: (value: boolean) => set(() => ({ sibarShow: value })),

  isOnline: false,
  setIsOnline: (value: boolean) => set(() => ({ isOnline: value })),

  tripStatus: '',
  setTripStatus: (value: string) => set(() => ({ tripStatus: value })),

  trip: undefined,
  setTrip: (value: any) => set(() => ({ trip: value }))
}))

export { useDriverStore }
