/** Офер в составе стрима: id, имя и доля трафика в процентах. */
export interface StreamOffer {
  id: number
  name: string
  share: number | null
}

/**
 * Фильтр стрима. У фильтра страны `name === 'country'`, а `payload` — коды стран:
 * `accept` пускает только их, `reject` — исключает.
 */
export interface StreamFilter {
  id: number
  name: string
  mode: string
  payload: string[]
}

/** Доменная модель стрима компании. */
export interface Stream {
  id: number
  name: string
  offers: StreamOffer[]
  filters: StreamFilter[]
  /** Поля карточки потока: приходят в ответе GET /streams/{id}. */
  campaignId: number | null
  position: number | null
  state: string | null
  createdAt: string | null
  type: string | null
  actionType: string | null
  actionPayload: string | null
  schema: string | null
  collectClicks: boolean | null
  filterOr: boolean | null
  weight: number | null
  offerSelection: string | null
}

/** Фабрика: собирает стрим из уже провалидированных данных. */
export function createStream(
  id: number,
  name: string,
  offers: StreamOffer[] = [],
  filters: StreamFilter[] = [],
  extra: Partial<Omit<Stream, 'id' | 'name' | 'offers' | 'filters'>> = {},
): Stream {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Некорректный id стрима: ${id}`)
  }

  return {
    id,
    name: name.trim(),
    offers,
    filters,
    campaignId: extra.campaignId ?? null,
    position: extra.position ?? null,
    state: extra.state ?? null,
    createdAt: extra.createdAt ?? null,
    type: extra.type ?? null,
    actionType: extra.actionType ?? null,
    actionPayload: extra.actionPayload ?? null,
    schema: extra.schema ?? null,
    collectClicks: extra.collectClicks ?? null,
    filterOr: extra.filterOr ?? null,
    weight: extra.weight ?? null,
    offerSelection: extra.offerSelection ?? null,
  }
}
