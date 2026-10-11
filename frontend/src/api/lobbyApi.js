// All HTTP calls for lobbies (game rooms).
import httpClient from '@/api/httpClient'

export const lobbyApi = {
  create: ({ quizId, roomName, timeLimit }) => httpClient.post('/lobbies', { quizId, roomName, timeLimit }).then((res) => res.data),
  getById: (id) => httpClient.get(`/lobbies/${id}`).then((res) => res.data),
}
