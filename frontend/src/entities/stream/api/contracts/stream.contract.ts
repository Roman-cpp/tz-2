/** Фильтр стрима, как его отдаёт backend (поля в snake_case). */
export interface StreamFilterContract {
  id: number
  stream_id: number
  name: string
  mode: string
  payload: string[]
  oid: number
}

/** Офер в составе стрима, как его отдаёт backend. */
export interface StreamOfferContract {
  id: number
  name: string
  share?: number | null
}

/** Как стрим приходит от backend. */
export interface StreamContract {
  id: number
  name: string
  campaign_id?: number | null
  position?: number | null
  state?: string | null
  created_at?: string | null
  type?: string | null
  action_type?: string | null
  action_payload?: string | null
  /** Keitaro зовёт поле "schema", backend отдаёт его как schema_name. */
  schema_name?: string | null
  collect_clicks?: boolean | null
  filter_or?: boolean | null
  weight?: number | null
  offer_selection?: string | null
  offers?: StreamOfferContract[]
  filters?: StreamFilterContract[]
}
