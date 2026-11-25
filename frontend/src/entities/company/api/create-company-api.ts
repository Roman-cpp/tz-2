import { postJson } from '../../../shared/api/http'
import type { Company } from '../model/company.entity'
import type { CreateCompanyDTO } from '../model/company.dto'
import type { CompanyContract } from './contracts/company.contract'
import { toCompany, toCompanyPayload } from './mapping/company.map'

export async function createCompanyApi(dto: CreateCompanyDTO): Promise<Company> {
  const contract = await postJson<CompanyContract>('/companies', toCompanyPayload(dto.name))
  return toCompany(contract)
}
