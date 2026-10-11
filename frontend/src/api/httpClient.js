import axios from 'axios'

// Single axios instance shared by every module in src/api.
const httpClient = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api`,
  timeout: 15000,
})

// Normalise errors: `error.message` is the server's message, `error.status` the HTTP status.
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    error.status = error.response?.status ?? 0
    error.message = error.response?.data?.error || (error.response ? 'Request failed' : 'Cannot reach the server')
    return Promise.reject(error)
  },
)

export default httpClient
