import { useState } from 'react'
import { toast } from 'sonner'
import { CLIENT_EVENTS } from '@/socket/socketEvents'
import { useGameStore } from '@/store/gameStore'
import { useSessionStore } from '@/store/sessionStore'
import { useGameSocket } from '@/hooks/useGameSocket'

/** Host-side game logic: joins the room as host and exposes the host controls. */
export const useHostGame = (lobbyId) => {
  const hostKey = useSessionStore((s) => s.hostKeys[lobbyId])
  const [joinError, setJoinError] = useState(null)
  const [busy, setBusy] = useState(false)

  const emit = useGameSocket(async () => {
    if (!hostKey) return
    const res = await emit(CLIENT_EVENTS.hostJoin, { lobbyId, hostKey })
    if (res.error) setJoinError(res.error)
    else useGameStore.getState().setLobbyState(res.state)
  })

  const send = async (event, extra = {}) => {
    setBusy(true)
    const res = await emit(event, { lobbyId, hostKey, ...extra })
    setBusy(false)
    if (res.error) toast.error(res.error)
  }

  return {
    hostKey,
    joinError,
    busy,
    actions: {
      start: () => send(CLIENT_EVENTS.startQuiz),
      reveal: () => send(CLIENT_EVENTS.revealAnswer),
      next: (index) => send(CLIENT_EVENTS.nextQuestion, { index }),
      end: () => send(CLIENT_EVENTS.endQuiz),
      restart: () => send(CLIENT_EVENTS.restartQuiz),
      kick: (playerId) => send(CLIENT_EVENTS.kickPlayer, { playerId }),
    },
  }
}
