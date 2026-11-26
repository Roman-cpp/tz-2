import { deleteRequest } from '../../../shared/api/http'
import type { Company } from '../model/company.entity'

export async function deleteCompanyApi(id: Company['id']): Promise<void> {
  await deleteRequest(`/companies/${encodeURIComponent(id)}`)
}
