import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router'
import { Toaster } from 'sonner'
import { queryClient } from '@/config/queryClient'

const AppProviders = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      {children}
      <Toaster theme="dark" position="top-center" richColors />
    </BrowserRouter>
  </QueryClientProvider>
)

export default AppProviders
