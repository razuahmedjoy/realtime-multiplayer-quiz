import { useCallback, useEffect, useRef } from 'react'
import { createSocket, emitWithAck } from '@/socket/socketClient'
import { SERVER_EVENTS } from '@/socket/socketEvents'
import { useGameStore } from '@/store/gameStore'

// Which store action handles each server event.
const EVENT_TO_ACTION = {
  [SERVER_EVENTS.lobbyState]: 'setLobbyState',
  [SERVER_EVENTS.newQuestion]: 'receiveQuestion',
  [SERVER_EVENTS.answerProgress]: 'setProgress',
  [SERVER_EVENTS.questionEnded]: 'setReveal',
  [SERVER_EVENTS.quizEnded]: 'setResults',
  [SERVER_EVENTS.kicked]: 'setKicked',
}

/**
 * Opens a socket for the lifetime of the page and pipes server events into the game store.
 * `onConnect` runs on every (re)connect: that's where pages (re)join their room,
 * so a dropped connection recovers on its own.
 * Returns `emit(event, data)`, which resolves with the server's acknowledgement.
 */
export const useGameSocket = (onConnect) => {
  const socketRef = useRef(null)
  const onConnectRef = useRef(onConnect)
  onConnectRef.current = onConnect

  useEffect(() => {
    const store = useGameStore.getState
    store().reset()

    const socket = createSocket()
    socketRef.current = socket

    socket.on('connect', () => {
      store().setConnected(true)
      onConnectRef.current?.()
    })
    socket.on('disconnect', () => store().setConnected(false))
    Object.entries(EVENT_TO_ACTION).forEach(([event, action]) => {
      socket.on(event, (payload) => store()[action](payload))
    })

    return () => {
      socket.disconnect()
      store().reset()
    }
  }, [])

  return useCallback((event, data) => emitWithAck(socketRef.current, event, data), [])
}
