import { postJson } from '../../../shared/api/http'
import type { Company } from '../model/company.entity'
import type { CreateCompanyDTO } from '../model/company.dto'
import type { CompanyWithStreamContract } from './contracts/company.contract'
import { toCompany, toCompanyPayload } from './mapping/company.map'

/**
 * Создаёт компанию и первый стрим одним запросом.
 * Backend делает два вызова к Keitaro: кампания, затем стрим с фильтром и оферами.
 */
export async function createCompanyApi(dto: CreateCompanyDTO): Promise<Company> {
  const contract = await postJson<CompanyWithStreamContract>('/companies', toCompanyPayload(dto))
  return toCompany(contract.company)
}
