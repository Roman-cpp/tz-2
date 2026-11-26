import { useState, type SubmitEvent } from 'react'
import { useCompaniesStore, type Company } from '../../../entities/company'
import { useOffersStore } from '../../../entities/offer'
import { Combobox } from '../../../shared/ui/combobox'
import { Modal } from '../../../shared/ui/modal/Modal'
import { TagInput } from '../../../shared/ui/tag-input'

type CompanyFormModalProps = {
  mode: 'create' | 'edit'
  company?: Company
  onClose: () => void
  onSaved: (company: Company) => void
}

/** Код страны — ISO 3166-1 alpha-2: две латинские буквы. */
const COUNTRY_CODE_RE = /^[A-Za-z]{2}$/

/** Приводим код к каноничному виду: без пробелов и в верхнем регистре. */
const normalizeCountry = (raw: string) => raw.trim().toUpperCase()

function validateCountry(code: string): string | null {
  if (!COUNTRY_CODE_RE.test(code)) {
    return 'Код страны — две латинские буквы, например RU'
  }
  return null
}

// Форма создания и редактирования компании. Работает через стор сущности.
export function CompanyFormModal({ mode, company, onClose, onSaved }: CompanyFormModalProps) {
  const isEdit = mode === 'edit'
  const { createCompany, updateCompany, isCreating, isUpdating } = useCompaniesStore()
  const isSaving = isCreating || isUpdating

  const [name, setName] = useState(company?.name ?? '')
  const [countryCodes, setCountryCodes] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  // Оферы выбираются в форме, но пока не отправляются: контракт создания
  // компании их не принимает.
  const [offerSearch, setOfferSearch] = useState('')
  const [selectedOffers, setSelectedOffers] = useState<{ id: number; label: string }[]>([])
  const { offers, isOffersLoading, isOffersError, offersError } = useOffersStore({ search: offerSearch })

  const offerItems = offers.map((offer) => ({ id: offer.id, label: offer.name }))

  const toggleOffer = (item: { id: number; label: string }) => {
    setSelectedOffers((selected) =>
      selected.some((offer) => offer.id === item.id)
        ? selected.filter((offer) => offer.id !== item.id)
        : [...selected, item],
    )
  }

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
        isEdit && company
          ? await updateCompany({ id: company.id, dto: { name: trimmed } })
          : await createCompany({ name: trimmed })
      onSaved(saved)
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : 'Не удалось сохранить компанию')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Modal
        title={isEdit ? 'Редактирование компании' : 'Новая компания'}
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
          <label htmlFor="company-name" className="text-sm font-medium text-heading">
            Название компании
          </label>
          <input
            id="company-name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={255}
            required
            autoFocus
            placeholder="Например, ООО «Ромашка»"
            className="w-full rounded-lg border border-line-strong px-4 py-3 text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <span className="text-sm font-medium text-heading">Коды стран</span>
          <TagInput
            id="company-countries"
            value={countryCodes}
            onChange={setCountryCodes}
            normalize={normalizeCountry}
            validate={validateCountry}
            maxLength={2}
            placeholder="Например, RU — Enter или запятая"
            emptyText="Коды стран не добавлены"
            addLabel="Добавить"
            disabled={isSaving}
          />
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <label htmlFor="company-offers" className="text-sm font-medium text-heading">
            Оферы
          </label>
          <Combobox.Root
            items={offerItems}
            selected={selectedOffers}
            onQueryChange={setOfferSearch}
            onToggle={toggleOffer}
            isLoading={isOffersLoading}
            errorMessage={isOffersError ? (offersError?.message ?? 'Не удалось загрузить оферы') : null}
            emptyText="Оферы не найдены"
          >
            <div className="relative">
              <Combobox.Input id="company-offers" placeholder="Поиск офера по названию" />
              <Combobox.List />
            </div>
            <div className="mt-3">
              <Combobox.Chips emptyText="Оферы не выбраны" />
            </div>
          </Combobox.Root>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </Modal>
    </form>
  )
}
