import { create } from 'zustand'

interface StoreState {
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void
}

export const userStore = create<StoreState>((set) => ({
  isLoggedIn: !!localStorage.getItem('token'),
  setIsLoggedIn: (value: boolean) => set(() => ({ isLoggedIn: value }))
}))
