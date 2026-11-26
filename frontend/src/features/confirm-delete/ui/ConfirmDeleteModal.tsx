import { Modal } from '../../../shared/ui/modal/Modal'

type ConfirmDeleteModalProps = {
  title: string
  subject: string
  isDeleting: boolean
  error: string | null
  onConfirm: () => void
  onClose: () => void
}

// Окно подтверждения удаления сущности.
export function ConfirmDeleteModal({ title, subject, isDeleting, error, onConfirm, onClose }: ConfirmDeleteModalProps) {
  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg border border-line-strong px-5 py-2.5 text-sm font-medium text-heading transition hover:bg-surface disabled:opacity-50"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? 'Удаление…' : 'Удалить'}
          </button>
        </>
      }
    >
      <p className="text-body">
        «<span className="font-medium text-heading">{subject}</span>» будет удалена. Это действие нельзя отменить.
      </p>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </Modal>
  )
}
