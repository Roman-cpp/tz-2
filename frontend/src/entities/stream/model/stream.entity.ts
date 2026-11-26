/** Офер в составе стрима: id и имя, полученное из справочника оферов. */
export interface StreamOffer {
  id: number
  name: string
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
}

/** Фабрика: собирает стрим из уже провалидированных данных. */
export function createStream(
  id: number,
  name: string,
  offers: StreamOffer[] = [],
  filters: StreamFilter[] = [],
): Stream {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Некорректный id стрима: ${id}`)
  }

  return { id, name: name.trim(), offers, filters }
}
