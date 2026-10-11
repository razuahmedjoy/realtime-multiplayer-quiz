// TanStack Query cache keys, in one place so invalidation stays consistent.
export const quizKeys = {
  all: ['quizzes'],
  list: () => [...quizKeys.all, 'list'],
  detail: (id) => [...quizKeys.all, 'detail', id],
}

export const lobbyKeys = {
  all: ['lobbies'],
  detail: (id) => [...lobbyKeys.all, 'detail', id],
}
