/** Как компания приходит от backend (GET /companies, POST /companies и т.д.). */
export interface CompanyContract {
  id: number
  name: string
}

/** Компания со стримами, созданными вместе с ней: ответ POST /companies. */
export interface CompanyWithStreamsContract {
  company: CompanyContract
  /** Стрим с фильтром страны, уводящий трафик на редирект (Google). */
  redirect_stream_id: number | null
  /** Стрим с оферами для всех остальных стран. */
  fallback_stream_id: number | null
}

/** Тело запроса на создание компании: сразу имя, коды стран и оферы. */
export interface CompanyPayloadContract {
  name: string
  country_codes: string[]
  offer_ids: number[]
}

/** Тело запроса на обновление компании — пока меняется только имя. */
export interface CompanyUpdatePayloadContract {
  name: string
}
