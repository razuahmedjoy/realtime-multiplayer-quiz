import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (count, error) => error.status >= 500 && count < 2, // don't retry 4xx
      refetchOnWindowFocus: false,
    },
  },
})
