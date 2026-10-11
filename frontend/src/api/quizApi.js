// All HTTP calls for quizzes. Components never call axios directly; they use the hooks in src/hooks.
import httpClient from '@/api/httpClient'

export const quizApi = {
  list: () => httpClient.get('/quizzes').then((res) => res.data),
  getById: (id) => httpClient.get(`/quizzes/${id}`).then((res) => res.data),
  create: (quiz) => httpClient.post('/quizzes', quiz).then((res) => res.data),
  update: (id, quiz) => httpClient.put(`/quizzes/${id}`, quiz).then((res) => res.data),
  remove: (id) => httpClient.delete(`/quizzes/${id}`),
}
