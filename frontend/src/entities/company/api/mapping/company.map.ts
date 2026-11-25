import type { CompanyContract } from '../contracts/company.contract'
import { createCompany, type Company } from '../../model/company.entity'

export function toCompany(contract: CompanyContract): Company {
  return createCompany(contract.id, contract.name)
}

export function toCompanies(contracts: CompanyContract[]): Company[] {
  return contracts.map(toCompany)
}

export function toCompanyPayload(name: string): { name: string } {
  return { name: name.trim() }
}
