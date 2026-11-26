import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createStreamApi } from '../api/create-stream-api'
import { deleteStreamApi } from '../api/delete-stream-api'
import { getStreamApi } from '../api/get-stream-api'
import { getStreamsApi } from '../api/get-streams-api'
import { updateStreamApi } from '../api/update-stream-api'
import { updateStreamOffersApi } from '../api/update-stream-offers-api'
import type { Stream } from '../model/stream.entity'

// Query keys: сущность → все списки/записи → конкретный список или запись
export const streamKeys = {
  all: ['streams'] as const,

  lists: () => [...streamKeys.all, 'list'] as const,

  list: (companyId: number | null) => [...streamKeys.lists(), companyId] as const,

  details: () => [...streamKeys.all, 'detail'] as const,

  detail: (streamId: Stream['id'] | null) => [...streamKeys.details(), streamId] as const,
}

export type UseStreamsStoreParams = {
  companyId?: number | null
  /** id потока для карточки: включает отдельный запрос одной записи. */
  streamId?: Stream['id'] | null
}

export type UpdateStreamVars = {
  id: Stream['id']
  name: string
}

export type UpdateStreamOffersVars = {
  id: Stream['id']
  offerIds: number[]
}

export function useStreamsStore({ companyId, streamId }: UseStreamsStoreParams = {}) {
  const queryClient = useQueryClient()

  const streams = useQuery<Stream[]>({
    queryKey: streamKeys.list(companyId ?? null),
    queryFn: ({ signal }) => getStreamsApi(companyId!, signal),
    enabled: Boolean(companyId),
  })

  // Карточка потока: отдельная запись со всеми полями
  const stream = useQuery<Stream>({
    queryKey: streamKeys.detail(streamId ?? null),
    queryFn: ({ signal }) => getStreamApi(streamId!, signal),
    enabled: Boolean(streamId),
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
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: listKey })
      queryClient.invalidateQueries({ queryKey: streamKeys.detail(vars.id) })
    },
  })

  // Оферы меняются наборами: ответ сразу кладём в кеш карточки,
  // чтобы список обновился без лишнего перезапроса.
  const updateStreamOffers = useMutation({
    mutationFn: ({ id, offerIds }: UpdateStreamOffersVars) => updateStreamOffersApi(id, offerIds),
    onSuccess: (updated, vars) => {
      queryClient.setQueryData(streamKeys.detail(vars.id), updated)
      if (companyId) {
        queryClient.invalidateQueries({ queryKey: listKey })
      }
    },
  })

  const deleteStream = useMutation({
    mutationFn: (streamId: Stream['id']) => deleteStreamApi(streamId),
    onSuccess: (_data, streamId) => {
      queryClient.removeQueries({ queryKey: streamKeys.detail(streamId) })
      queryClient.invalidateQueries({ queryKey: listKey })
    },
  })

  return {
    // Данные
    streams: streams.data ?? [],
    stream: stream.data ?? null,

    // Статусы
    isStreamsLoading: streams.isLoading,
    isStreamsError: streams.isError,
    streamsError: streams.error as Error | null,

    isStreamLoading: stream.isLoading,
    isStreamError: stream.isError,
    streamError: stream.error as Error | null,

    // Методы
    createStream: createStream.mutateAsync,
    updateStream: updateStream.mutateAsync,
    updateStreamOffers: updateStreamOffers.mutateAsync,
    deleteStream: deleteStream.mutateAsync,

    // Статусы мутаций
    isCreating: createStream.isPending,
    isUpdating: updateStream.isPending,
    isUpdatingOffers: updateStreamOffers.isPending,
    isDeleting: deleteStream.isPending,
  }
}
