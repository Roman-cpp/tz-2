/** Доменная модель офера. */
export interface Offer {
  id: number
  name: string
}

/** Фабрика: собирает офер из уже провалидированных данных. */
export function createOffer(id: number, name: string): Offer {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Некорректный id офера: ${id}`)
  }

  return { id, name: name.trim() }
}
