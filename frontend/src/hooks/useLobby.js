import { useMutation, useQuery } from '@tanstack/react-query'
import { lobbyApi } from '@/api/lobbyApi'
import { lobbyKeys } from '@/api/queryKeys'

/** Room info (name, quiz, QR code, join URL). */
export const useLobby = (id) => useQuery({ queryKey: lobbyKeys.detail(id), queryFn: () => lobbyApi.getById(id), enabled: !!id })

export const useCreateLobby = () => useMutation({ mutationFn: lobbyApi.create })
