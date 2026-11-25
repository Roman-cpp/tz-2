/** Офер в составе стрима: id и имя, полученное из справочника оферов. */
export interface StreamOffer {
  id: number
  name: string
}

/** Доменная модель стрима компании. */
export interface Stream {
  id: number
  name: string
  offers: StreamOffer[]
}

/** Фабрика: собирает стрим из уже провалидированных данных. */
export function createStream(id: number, name: string, offers: StreamOffer[] = []): Stream {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Некорректный id стрима: ${id}`)
  }

  return { id, name: name.trim(), offers }
}
