/** Как компания приходит от backend (GET /companies, POST /companies и т.д.). */
export interface CompanyContract {
  id: number
  name: string
}

/** Тело запроса на создание/обновление компании. */
export interface CompanyPayloadContract {
  name: string
}
