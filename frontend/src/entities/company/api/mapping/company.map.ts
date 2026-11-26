import type { CompanyContract } from '../contracts/company.contract'
import { createCompany, type Company } from '../../model/company.entity'
import type { CreateCompanyDTO } from '../../model/company.dto'

export function toCompany(contract: CompanyContract): Company {
  return createCompany(contract.id, contract.name)
}

export function toCompanies(contracts: CompanyContract[]): Company[] {
  return contracts.map(toCompany)
}

/** Тело создания компании: имя плюс данные для стрима. */
export function toCompanyPayload(dto: CreateCompanyDTO) {
  return {
    name: dto.name.trim(),
    country_codes: dto.countryCodes,
    offer_ids: dto.offerIds,
  }
}

/** Тело обновления компании: вложенные сущности здесь не меняются. */
export function toCompanyUpdatePayload(name: string): { name: string } {
  return { name: name.trim() }
}
