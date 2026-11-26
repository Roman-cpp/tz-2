import { useEffect, type MouseEvent, type ReactNode } from 'react'

type ModalProps = {
  title: string
  children: ReactNode
  footer?: ReactNode
  onClose: () => void
}

// Шаблон модального окна: разметка + закрытие по фону и Escape. Содержимое управляется снаружи.
export function Modal({ title, children, footer, onClose }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const stopPropagation = (event: MouseEvent) => event.stopPropagation()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-heading/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl md:p-8"
        onClick={stopPropagation}
      >
        <h2 id="modal-title" className="text-xl font-semibold text-heading">
          {title}
        </h2>

        <div className="mt-5">{children}</div>

        {footer && <div className="mt-8 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  )
}
