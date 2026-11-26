/** Данные для создания компании: под неё создаются два стрима. */
export interface CreateCompanyDTO {
  name: string
  /** Коды стран ISO 3166-1 alpha-2 — из них собирается фильтр страны. */
  countryCodes: string[]
  /** Оферы второго стрима: он отдаёт трафик остальных стран. */
  offerIds: number[]
}

/** Данные для обновления компании. */
export interface UpdateCompanyDTO {
  name: string
}

/** Фильтры списка компаний. Пустой объект — все компании. */
export interface CompanyFilters {
  name?: string
}
