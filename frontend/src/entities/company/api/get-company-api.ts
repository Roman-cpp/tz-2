import { getJson } from '../../../shared/api/http'
import type { Company } from '../model/company.entity'
import type { CompanyContract } from './contracts/company.contract'
import { toCompany } from './mapping/company.map'

export async function getCompanyApi(id: Company['id'], signal?: AbortSignal): Promise<Company> {
  const contract = await getJson<CompanyContract>(`/companies/${encodeURIComponent(id)}`, signal)
  return toCompany(contract)
}
