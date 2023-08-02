import { Socket } from 'socket.io-client'
import { create } from 'zustand'

interface SocketState {
  socket: Socket | null
  setSocket: (value: Socket | null) => void
}

const socketStore = create<SocketState>((set) => ({
  socket: null,
  setSocket: (value: Socket | null) => set(() => ({ socket: value }))
}))

const useSocket = () => socketStore((state) => state)

export { useSocket }
