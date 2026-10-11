import { io } from 'socket.io-client'

export const createSocket = () => io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000')

/** Emits an event and resolves with the server's acknowledgement ({ ok } or { error }). */
export const emitWithAck = (socket, event, data) =>
  new Promise((resolve) => {
    if (!socket) return resolve({ error: 'Not connected' })
    socket.timeout(8000).emit(event, data, (err, response) => {
      resolve(err ? { error: 'The server did not respond. Please try again.' } : response)
    })
  })
