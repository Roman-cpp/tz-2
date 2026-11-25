import { useState } from 'react'
import { useCompaniesStore, type Company } from '../../../entities/company'
import { CompanyFormModal } from '../../../features/company-form/ui/CompanyFormModal'
import { DeleteCompanyModal } from '../../../features/company-delete/ui/DeleteCompanyModal'
import { CompaniesTable } from '../../../widgets/companies-table/ui/CompaniesTable'

type FormState = { mode: 'create' } | { mode: 'edit'; company: Company } | null

export function CompaniesPage() {
  const {
    companies,
    isCompaniesLoading,
    isCompaniesError,
    companiesError,
    deleteCompany,
    isDeleting: isDeletingStore,
  } = useCompaniesStore()

  const [form, setForm] = useState<FormState>(null)
  const [deleteTarget, setDeleteTarget] = useState<Company | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const closeForm = () => setForm(null)

  const openDelete = (company: Company) => {
    setDeleteError(null)
    setDeleteTarget(company)
  }

  const closeDelete = () => {
    if (isDeletingStore) return
    setDeleteTarget(null)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return

    setDeleteError(null)
    try {
      await deleteCompany(deleteTarget.id)
      setDeleteTarget(null)
    } catch (error: unknown) {
      setDeleteError(error instanceof Error ? error.message : 'Не удалось удалить компанию')
    }
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-heading">Компании</h1>
          {!isCompaniesLoading && !isCompaniesError && (
            <p className="mt-1 text-sm text-body">Всего: {companies.length}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setForm({ mode: 'create' })}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover"
        >
          + Создать
        </button>
      </div>

      {isCompaniesLoading && <p className="mt-6 text-body">Загрузка…</p>}

      {isCompaniesError && (
        <p className="mt-6 text-red-600">
          Не удалось загрузить список: {companiesError?.message ?? 'неизвестная ошибка'}
        </p>
      )}

      {!isCompaniesLoading && !isCompaniesError && (
        <div className="mt-6">
          <CompaniesTable
            companies={companies}
            onEdit={(company) => setForm({ mode: 'edit', company })}
            onDelete={openDelete}
          />
        </div>
      )}

      {form && (
        <CompanyFormModal
          mode={form.mode}
          company={form.mode === 'edit' ? form.company : undefined}
          onClose={closeForm}
          onSaved={closeForm}
        />
      )}

      {deleteTarget && (
        <DeleteCompanyModal
          companyName={deleteTarget.name}
          isDeleting={isDeletingStore}
          error={deleteError}
          onConfirm={confirmDelete}
          onClose={closeDelete}
        />
      )}
    </section>
  )
}
