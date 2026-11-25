/** Офер в составе стрима, как его отдаёт backend. */
export interface StreamOfferContract {
  id: number
  name: string
}

/** Как стрим приходит от backend. */
export interface StreamContract {
  id: number
  name: string
  offers?: StreamOfferContract[]
}
