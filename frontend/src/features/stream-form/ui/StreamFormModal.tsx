import { useState, type SubmitEvent } from 'react'
import { useStreamsStore, type Stream } from '../../../entities/stream'
import { Modal } from '../../../shared/ui/modal/Modal'

type StreamFormModalProps = {
  companyId: number
  mode: 'create' | 'edit'
  stream?: Stream
  onClose: () => void
  onSaved: (stream: Stream) => void
}

// Форма создания и редактирования стрима компании. Работает через стор сущности.
export function StreamFormModal({ companyId, mode, stream: target, onClose, onSaved }: StreamFormModalProps) {
  const isEdit = mode === 'edit'
  const { createStream, updateStream, isCreating, isUpdating } = useStreamsStore({ companyId })
  const isSaving = isCreating || isUpdating

  const [name, setName] = useState(target?.name ?? '')
  const [error, setError] = useState<string | null>(null)

  const trimmed = name.trim()
  const canSubmit = trimmed.length > 0 && !isSaving

  const close = () => {
    if (isSaving) return
    onClose()
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return

    setError(null)
    try {
      const saved =
        isEdit && target ? await updateStream({ id: target.id, name: trimmed }) : await createStream(trimmed)
      onSaved(saved)
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : 'Не удалось сохранить стрим')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Modal
        title={isEdit ? 'Редактирование стрима' : 'Новый стрим'}
        onClose={close}
        footer={
          <>
            <button
              type="button"
              onClick={close}
              disabled={isSaving}
              className="rounded-lg border border-line-strong px-5 py-2.5 text-sm font-medium text-heading transition hover:bg-surface disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-50"
            >
              {isSaving ? 'Сохранение…' : isEdit ? 'Сохранить' : 'Создать'}
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="stream-name" className="text-sm font-medium text-heading">
            Название стрима
          </label>
          <input
            id="stream-name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={255}
            required
            autoFocus
            placeholder="Например, Основной поток"
            className="w-full rounded-lg border border-line-strong px-4 py-3 text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </Modal>
    </form>
  )
}
