import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Who you are in each room, saved in localStorage so a refresh doesn't kick you out.
//   hostKeys:  lobbyId -> secret that lets this browser control the room
//   playerIds: lobbyId -> your seat as a player
export const useSessionStore = create(
  persist(
    (set) => ({
      hostKeys: {},
      playerIds: {},
      setHostKey: (lobbyId, hostKey) => set((s) => ({ hostKeys: { ...s.hostKeys, [lobbyId]: hostKey } })),
      setPlayerId: (lobbyId, playerId) => set((s) => ({ playerIds: { ...s.playerIds, [lobbyId]: playerId } })),
      clearPlayerId: (lobbyId) =>
        set((s) => {
          const playerIds = { ...s.playerIds }
          delete playerIds[lobbyId]
          return { playerIds }
        }),
    }),
    { name: 'trivia-session' },
  ),
)
