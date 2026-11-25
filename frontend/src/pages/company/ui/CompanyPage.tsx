import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { useCompaniesStore } from '../../../entities/company'
import { useStreamsStore, type Stream } from '../../../entities/stream'
import { CompanyFormModal } from '../../../features/company-form/ui/CompanyFormModal'
import { ConfirmDeleteModal } from '../../../features/confirm-delete/ui/ConfirmDeleteModal'
import { StreamFormModal } from '../../../features/stream-form/ui/StreamFormModal'
import { StreamsTable } from '../../../widgets/streams-table/ui/StreamsTable'

type StreamFormState = { mode: 'create' } | { mode: 'edit'; stream: Stream } | null

export function CompanyPage() {
  const { companyId } = useParams<{ companyId: string }>()
  const id = companyId ? Number(companyId) : null
  const validId = id !== null && Number.isInteger(id) && id > 0 ? id : null

  const { company, isCompaniesError, companiesError } = useCompaniesStore({ id: validId })
  const {
    streams,
    isStreamsLoading,
    isStreamsError,
    streamsError,
    deleteStream,
    isDeleting,
  } = useStreamsStore({ companyId: validId })

  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false)
  const [streamForm, setStreamForm] = useState<StreamFormState>(null)
  const [deleteTarget, setDeleteTarget] = useState<Stream | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const closeStreamForm = () => setStreamForm(null)

  const openDelete = (target: Stream) => {
    setDeleteError(null)
    setDeleteTarget(target)
  }

  const closeDelete = () => {
    if (isDeleting) return
    setDeleteTarget(null)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return

    setDeleteError(null)
    try {
      await deleteStream(deleteTarget.id)
      setDeleteTarget(null)
    } catch (error: unknown) {
      setDeleteError(error instanceof Error ? error.message : 'Не удалось удалить стрим')
    }
  }

  if (validId === null) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-semibold text-heading">Компания не найдена</h1>
        <p className="mt-4">
          <Link to="/" className="font-medium text-primary underline-offset-4 hover:underline">
            Вернуться к списку компаний
          </Link>
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <Link
            to="/"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            ← Все компании
          </Link>
          <h1 className="mt-3 truncate text-2xl font-semibold text-heading">
            {company?.name ?? `Компания #${validId}`}
          </h1>
          <p className="mt-1 text-sm text-body">ID: {validId}</p>
        </div>

        <button
          type="button"
          onClick={() => setIsCompanyFormOpen(true)}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover"
        >
          + Создать компанию
        </button>
      </div>

      {isCompaniesError && (
        <p className="mt-6 text-red-600">
          Не удалось загрузить компанию: {companiesError?.message ?? 'неизвестная ошибка'}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-heading">Стримы компании</h2>
        <button
          type="button"
          onClick={() => setStreamForm({ mode: 'create' })}
          className="rounded-lg border border-line-strong px-4 py-2 text-sm font-medium text-heading transition hover:bg-surface"
        >
          + Создать стрим
        </button>
      </div>

      <div className="mt-4">
        {isStreamsLoading && <p className="text-body">Загрузка…</p>}

        {isStreamsError && (
          <p className="text-red-600">
            Не удалось загрузить стримы: {streamsError?.message ?? 'неизвестная ошибка'}
          </p>
        )}

        {!isStreamsLoading && !isStreamsError && (
          <StreamsTable
            streams={streams}
            onEdit={(stream) => setStreamForm({ mode: 'edit', stream })}
            onDelete={openDelete}
          />
        )}
      </div>

      {isCompanyFormOpen && (
        <CompanyFormModal
          mode="create"
          onClose={() => setIsCompanyFormOpen(false)}
          onSaved={() => setIsCompanyFormOpen(false)}
        />
      )}

      {streamForm && (
        <StreamFormModal
          companyId={validId}
          mode={streamForm.mode}
          stream={streamForm.mode === 'edit' ? streamForm.stream : undefined}
          onClose={closeStreamForm}
          onSaved={closeStreamForm}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          title="Удалить стрим?"
          subject={deleteTarget.name}
          isDeleting={isDeleting}
          error={deleteError}
          onConfirm={confirmDelete}
          onClose={closeDelete}
        />
      )}
    </section>
  )
}
