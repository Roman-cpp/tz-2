import { getJson } from '../../../shared/api/http'
import type { Company } from '../model/company.entity'
import type { CompanyContract } from './contracts/company.contract'
import { toCompanies } from './mapping/company.map'

export async function getCompaniesApi(signal?: AbortSignal): Promise<Company[]> {
  const contracts = await getJson<CompanyContract[]>('/companies', signal)
  return toCompanies(contracts)
}
