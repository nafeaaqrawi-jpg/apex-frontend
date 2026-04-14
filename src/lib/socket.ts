import { io } from 'socket.io-client'

const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// Singleton socket — shared across the app.
// autoConnect: false so we only open the connection when inside a chat.
export const socket = io(BACKEND_URL, {
  withCredentials: true,
  autoConnect: false,
})
