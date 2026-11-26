import { postJson } from '../../../shared/api/http'
import type { Company } from '../model/company.entity'
import type { CreateCompanyDTO } from '../model/company.dto'
import type { CompanyWithStreamsContract } from './contracts/company.contract'
import { toCompany, toCompanyPayload } from './mapping/company.map'

/**
 * Создаёт компанию и два стрима одним запросом.
 * Backend делает последовательные вызовы к Keitaro: кампания, стрим с
 * фильтром страны (редирект) и стрим с оферами.
 */
export async function createCompanyApi(dto: CreateCompanyDTO): Promise<Company> {
  const contract = await postJson<CompanyWithStreamsContract>('/companies', toCompanyPayload(dto))
  return toCompany(contract.company)
}
