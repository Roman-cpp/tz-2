/** Данные для создания компании. */
export interface CreateCompanyDTO {
  name: string
}

/** Данные для обновления компании. */
export interface UpdateCompanyDTO {
  name: string
}

/** Фильтры списка компаний. Пустой объект — все компании. */
export interface CompanyFilters {
  name?: string
}
