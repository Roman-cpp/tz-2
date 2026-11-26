/** Офер в составе стрима, как его отдаёт backend. */
export interface StreamOfferContract {
  id: number
  name: string
}

/** Фильтр стрима, как его отдаёт backend (поля в snake_case). */
export interface StreamFilterContract {
  id: number
  stream_id: number
  name: string
  mode: string
  payload: string[]
  oid: number
}

/** Как стрим приходит от backend. */
export interface StreamContract {
  id: number
  name: string
  offers?: StreamOfferContract[]
  filters?: StreamFilterContract[]
}
