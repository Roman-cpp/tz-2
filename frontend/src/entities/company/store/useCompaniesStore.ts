import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createCompanyApi } from '../api/create-company-api'
import { deleteCompanyApi } from '../api/delete-company-api'
import { getCompaniesApi } from '../api/get-companies-api'
import { getCompanyApi } from '../api/get-company-api'
import { updateCompanyApi } from '../api/update-company-api'
import type { Company } from '../model/company.entity'
import type { CompanyFilters, CreateCompanyDTO, UpdateCompanyDTO } from '../model/company.dto'

// 1. Query keys: сущность → тип → параметры
export const companyKeys = {
  // Корень — инвалидирует ВСЁ связанное с компаниями
  all: ['companies'] as const,

  // Все списки
  lists: () => [...companyKeys.all, 'list'] as const,

  // Список с фильтрами
  list: (filters: CompanyFilters) => [...companyKeys.lists(), filters] as const,

  // Все детальные записи
  details: () => [...companyKeys.all, 'detail'] as const,

  // Конкретная запись по id
  detail: (id: Company['id'] | null) => [...companyKeys.details(), id] as const,
}

export type UseCompaniesStoreParams = {
  id?: Company['id'] | null
  filters?: CompanyFilters
}

export function useCompaniesStore({ id, filters }: UseCompaniesStoreParams = {}) {
  const queryClient = useQueryClient()

  // 2. Список компаний: фильтры входят в queryKey, поэтому смена фильтра = новый запрос
  const companies = useQuery<Company[]>({
    queryKey: companyKeys.list(filters ?? {}),
    queryFn: ({ signal }) => getCompaniesApi(signal),
  })

  // 3. Одна запись — только при наличии id
  const company = useQuery<Company>({
    queryKey: companyKeys.detail(id ?? null),
    queryFn: ({ signal }) => getCompanyApi(id!, signal),
    enabled: Boolean(id),
  })

  // 4. Мутации
  const createCompany = useMutation({
    mutationFn: (dto: CreateCompanyDTO) => createCompanyApi(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() })
    },
  })

  const updateCompany = useMutation({
    mutationFn: ({ id: companyId, dto }: { id: Company['id']; dto: UpdateCompanyDTO }) =>
      updateCompanyApi(companyId, dto),
    onSuccess: (updated) => {
      queryClient.removeQueries({ queryKey: companyKeys.detail(updated.id) })
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() })
    },
  })

  const deleteCompany = useMutation({
    mutationFn: (companyId: Company['id']) => deleteCompanyApi(companyId),
    onSuccess: (_data, companyId) => {
      queryClient.removeQueries({ queryKey: companyKeys.detail(companyId) })
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() })
    },
  })

  return {
    // Данные
    companies: companies.data ?? [],
    company: company.data ?? null,

    // Статусы
    isCompaniesLoading: companies.isLoading,
    isCompaniesError: companies.isError,
    companiesError: companies.error as Error | null,

    // Методы
    createCompany: createCompany.mutateAsync,
    updateCompany: updateCompany.mutateAsync,
    deleteCompany: deleteCompany.mutateAsync,

    // Статусы мутаций
    isCreating: createCompany.isPending,
    isUpdating: updateCompany.isPending,
    isDeleting: deleteCompany.isPending,
  }
}
