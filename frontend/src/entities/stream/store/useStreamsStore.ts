import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createStreamApi } from '../api/create-stream-api'
import { deleteStreamApi } from '../api/delete-stream-api'
import { getStreamsApi } from '../api/get-streams-api'
import { updateStreamApi } from '../api/update-stream-api'
import type { Stream } from '../model/stream.entity'

// Query keys: сущность → все списки → список конкретной компании
export const streamKeys = {
  all: ['streams'] as const,

  lists: () => [...streamKeys.all, 'list'] as const,

  list: (companyId: number | null) => [...streamKeys.lists(), companyId] as const,
}

export type UseStreamsStoreParams = {
  companyId?: number | null
}

export type UpdateStreamVars = {
  id: Stream['id']
  name: string
}

export function useStreamsStore({ companyId }: UseStreamsStoreParams = {}) {
  const queryClient = useQueryClient()

  const streams = useQuery<Stream[]>({
    queryKey: streamKeys.list(companyId ?? null),
    queryFn: ({ signal }) => getStreamsApi(companyId!, signal),
    enabled: Boolean(companyId),
  })

  // Список конкретной компании: инвалидируем его же, а не все списки —
  // стрим принадлежит одной компании.
  const listKey = streamKeys.list(companyId ?? null)

  const createStream = useMutation({
    mutationFn: (name: string) => createStreamApi(companyId!, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKey })
    },
  })

  const updateStream = useMutation({
    mutationFn: ({ id, name }: UpdateStreamVars) => updateStreamApi(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKey })
    },
  })

  const deleteStream = useMutation({
    mutationFn: (streamId: Stream['id']) => deleteStreamApi(streamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKey })
    },
  })

  return {
    // Данные
    streams: streams.data ?? [],

    // Статусы
    isStreamsLoading: streams.isLoading,
    isStreamsError: streams.isError,
    streamsError: streams.error as Error | null,

    // Методы
    createStream: createStream.mutateAsync,
    updateStream: updateStream.mutateAsync,
    deleteStream: deleteStream.mutateAsync,

    // Статусы мутаций
    isCreating: createStream.isPending,
    isUpdating: updateStream.isPending,
    isDeleting: deleteStream.isPending,
  }
}
