/** Доменная модель компании. */
export interface Company {
  id: number
  name: string
}

/** Фабрика: собирает сущность из уже провалидированных данных. */
export function createCompany(id: number, name: string): Company {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Некорректный id компании: ${id}`)
  }

  const trimmed = name.trim()
  if (!trimmed) {
    throw new Error('Название компании не может быть пустым')
  }

  return { id, name: trimmed }
}

/** Инвариант: у компании есть непустое название. */
export function isNamed(company: Company): boolean {
  return company.name.trim().length > 0
}
