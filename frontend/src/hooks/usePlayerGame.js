import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { CLIENT_EVENTS } from '@/socket/socketEvents'
import { useGameStore } from '@/store/gameStore'
import { useSessionStore } from '@/store/sessionStore'
import { useGameSocket } from '@/hooks/useGameSocket'

/** Player-side game logic: joining (and auto re-joining) a room and answering. */
export const usePlayerGame = (lobbyId) => {
  const playerId = useSessionStore((s) => s.playerIds[lobbyId])
  const { setPlayerId, clearPlayerId } = useSessionStore.getState()
  const kicked = useGameStore((s) => s.kicked)
  const [joining, setJoining] = useState(false)

  const emit = useGameSocket(async () => {
    // Re-join automatically after a refresh or a dropped connection.
    const savedId = useSessionStore.getState().playerIds[lobbyId]
    if (!savedId) return
    const res = await emit(CLIENT_EVENTS.joinLobby, { lobbyId, playerId: savedId })
    if (res.error) {
      toast.error(res.error)
      clearPlayerId(lobbyId)
    } else useGameStore.getState().setLobbyState(res.state)
  })

  // Removed by the host: forget our seat.
  useEffect(() => {
    if (kicked) clearPlayerId(lobbyId)
  }, [kicked, lobbyId, clearPlayerId])

  const join = async (name, team) => {
    setJoining(true)
    const res = await emit(CLIENT_EVENTS.joinLobby, { lobbyId, name, team })
    setJoining(false)
    if (res.error) return toast.error(res.error)
    setPlayerId(lobbyId, res.player.playerId)
    useGameStore.getState().setLobbyState(res.state)
  }

  const answer = async (option) => {
    const { setMyAnswer } = useGameStore.getState()
    setMyAnswer(option) // lock in immediately; undo if the server refuses
    const res = await emit(CLIENT_EVENTS.submitAnswer, { lobbyId, answer: option })
    if (res.error) {
      toast.error(res.error)
      if (res.error !== 'You already answered') setMyAnswer(null)
    }
  }

  return { playerId, joining, join, answer }
}
