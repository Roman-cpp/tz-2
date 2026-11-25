import { putJson } from '../../../shared/api/http'
import type { Company } from '../model/company.entity'
import type { UpdateCompanyDTO } from '../model/company.dto'
import type { CompanyContract } from './contracts/company.contract'
import { toCompany, toCompanyPayload } from './mapping/company.map'

export async function updateCompanyApi(id: Company['id'], dto: UpdateCompanyDTO): Promise<Company> {
  const contract = await putJson<CompanyContract>(`/companies/${encodeURIComponent(id)}`, toCompanyPayload(dto.name))
  return toCompany(contract)
}
