import { useQuery } from '@tanstack/react-query'
import { getOffersApi } from '../api/get-offers-api'
import type { Offer } from '../model/offer.entity'

// Query keys: сущность → все списки. Поиск не входит в ключ: backend отдаёт
// весь список, фильтрация — локальная, поэтому кеш у всех запросов общий.
export const offerKeys = {
  all: ['offers'] as const,

  lists: () => [...offerKeys.all, 'list'] as const,

  list: () => [...offerKeys.lists()] as const,
}

export type UseOffersStoreParams = {
  search?: string
  enabled?: boolean
}

export function useOffersStore({ search = '', enabled = true }: UseOffersStoreParams = {}) {
  const offers = useQuery<Offer[]>({
    queryKey: offerKeys.list(),
    queryFn: ({ signal }) => getOffersApi(signal),
    enabled,
  })

  const normalized = search.trim().toLowerCase()
  const data = offers.data ?? []
  const filtered = normalized
    ? data.filter((offer) => offer.name.toLowerCase().includes(normalized))
    : data

  return {
    // Данные
    offers: filtered,

    // Статусы
    isOffersLoading: offers.isLoading,
    isOffersFetching: offers.isFetching,
    isOffersError: offers.isError,
    offersError: offers.error as Error | null,
  }
}
