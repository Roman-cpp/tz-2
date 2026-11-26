import { Link } from 'react-router'
import type { Company } from '../../../entities/company'

type CompaniesTableProps = {
  companies: Company[]
  onEdit: (company: Company) => void
  onDelete: (company: Company) => void
}

export function CompaniesTable({ companies, onEdit, onDelete }: CompaniesTableProps) {
  if (companies.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line-strong px-6 py-10 text-center text-body">
        Компаний пока нет. Нажмите «+ Создать», чтобы добавить первую.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="min-w-full text-left">
        <thead className="bg-surface">
          <tr>
            <th scope="col" className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-body">
              Название
            </th>
            <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-body">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {companies.map((company) => (
            <tr key={company.id} className="transition hover:bg-surface">
              <td className="px-6 py-4">
                <Link to={`/company/${company.id}`} className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {company.id}
                  </span>
                  <span className="font-medium text-heading hover:text-primary">{company.name}</span>
                </Link>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(company)}
                    className="rounded-lg border border-line-strong px-3.5 py-1.5 text-sm font-medium text-heading transition hover:bg-surface"
                  >
                    Редактировать
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(company)}
                    className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Удалить
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
