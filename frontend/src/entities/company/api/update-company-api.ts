import { putJson } from '../../../shared/api/http'
import type { Company } from '../model/company.entity'
import type { UpdateCompanyDTO } from '../model/company.dto'
import type { CompanyContract } from './contracts/company.contract'
import { toCompany, toCompanyUpdatePayload } from './mapping/company.map'

export async function updateCompanyApi(id: Company['id'], dto: UpdateCompanyDTO): Promise<Company> {
  const contract = await putJson<CompanyContract>(
    `/companies/${encodeURIComponent(id)}`,
    toCompanyUpdatePayload(dto.name),
  )
  return toCompany(contract)
}
