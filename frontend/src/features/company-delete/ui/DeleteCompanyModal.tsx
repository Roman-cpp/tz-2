import { ConfirmDeleteModal } from '../../../features/confirm-delete/ui/ConfirmDeleteModal'

type DeleteCompanyModalProps = {
  companyName: string
  isDeleting: boolean
  error: string | null
  onConfirm: () => void
  onClose: () => void
}

// Окно подтверждения удаления компании.
export function DeleteCompanyModal({ companyName, isDeleting, error, onConfirm, onClose }: DeleteCompanyModalProps) {
  return (
    <ConfirmDeleteModal
      title="Удалить компанию?"
      subject={companyName}
      isDeleting={isDeleting}
      error={error}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )
}
