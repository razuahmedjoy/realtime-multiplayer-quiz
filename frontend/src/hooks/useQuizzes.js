import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { quizApi } from '@/api/quizApi'
import { quizKeys } from '@/api/queryKeys'

export const useQuizzes = () => useQuery({ queryKey: quizKeys.list(), queryFn: quizApi.list })

export const useQuiz = (id) => useQuery({ queryKey: quizKeys.detail(id), queryFn: () => quizApi.getById(id), enabled: !!id })

// Any change to quizzes refreshes the list and that quiz's cached detail.
const useInvalidateQuizzes = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: quizKeys.all })
}

export const useCreateQuiz = () => {
  const invalidate = useInvalidateQuizzes()
  return useMutation({ mutationFn: quizApi.create, onSuccess: invalidate })
}

export const useUpdateQuiz = () => {
  const invalidate = useInvalidateQuizzes()
  return useMutation({ mutationFn: ({ id, quiz }) => quizApi.update(id, quiz), onSuccess: invalidate })
}

export const useDeleteQuiz = () => {
  const invalidate = useInvalidateQuizzes()
  return useMutation({ mutationFn: quizApi.remove, onSuccess: invalidate })
}

/** Fetches a quiz on demand (e.g. for export) using the shared cache. */
export const useFetchQuiz = () => {
  const queryClient = useQueryClient()
  return (id) => queryClient.fetchQuery({ queryKey: quizKeys.detail(id), queryFn: () => quizApi.getById(id) })
}
