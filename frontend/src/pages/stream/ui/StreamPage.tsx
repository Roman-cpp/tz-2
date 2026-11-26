import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { useOffersStore } from '../../../entities/offer'
import { useStreamsStore, type StreamFilter, type StreamOffer } from '../../../entities/stream'
import { Combobox } from '../../../shared/ui/combobox'

const modeLabel: Record<string, string> = {
  accept: 'только',
  reject: 'кроме',
}

/** Строка «ключ — значение» в карточке параметров. */
function DetailRow({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-line pb-2 last:border-b-0 last:pb-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-body">{label}</dt>
      <dd className="text-sm text-heading">{value ?? '—'}</dd>
    </div>
  )
}

/** Блок фильтров: коды стран и прочие фильтры потока. */
function FiltersSection({ filters }: { filters: StreamFilter[] }) {
  if (filters.length === 0) {
    return <p className="text-sm text-body">У потока нет фильтров — он принимает весь трафик.</p>
  }

  return (
    <ul className="flex flex-col gap-3">
      {filters.map((filter) => (
        <li key={filter.id} className="rounded-xl border border-line p-4">
          <p className="text-sm font-medium text-heading">
            {filter.name}
            <span className="ml-2 rounded-full bg-surface px-2 py-0.5 text-xs text-body">
              {modeLabel[filter.mode] ?? filter.mode}
            </span>
          </p>
          {filter.payload.length === 0 ? (
            <p className="mt-2 text-sm text-body">Значения не заданы</p>
          ) : (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {filter.payload.map((value) => (
                <li
                  key={`${filter.id}-${value}`}
                  className={`rounded-md px-2 py-0.5 text-xs font-semibold tracking-wide ${
                    filter.mode === 'reject'
                      ? 'bg-red-50 text-red-600 line-through'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {value}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}

/**
 * Оферы потока: список с удалением и комбобокс для добавления.
 * Сохранение отправляет итоговый набор id — так же работает и удаление.
 */
function OffersSection({
  offers,
  isSaving,
  error,
  onSave,
}: {
  offers: StreamOffer[]
  isSaving: boolean
  error: string | null
  onSave: (offerIds: number[]) => void
}) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<{ id: number; label: string }[]>([])
  const { offers: catalog, isOffersLoading, isOffersError, offersError } = useOffersStore({
    search,
  })

  const currentIds = offers.map((offer) => offer.id)

  // В подсказках только оферы, которых ещё нет в потоке
  const items = catalog
    .filter((offer) => !currentIds.includes(offer.id))
    .map((offer) => ({ id: offer.id, label: offer.name }))

  const toggle = (item: { id: number; label: string }) => {
    setSelected((list) =>
      list.some((offer) => offer.id === item.id)
        ? list.filter((offer) => offer.id !== item.id)
        : [...list, item],
    )
  }

  const addSelected = () => {
    if (selected.length === 0) return
    onSave([...currentIds, ...selected.map((offer) => offer.id)])
    setSelected([])
  }

  const remove = (offerId: number) => {
    onSave(currentIds.filter((id) => id !== offerId))
  }

  return (
    <>
      {offers.length === 0 ? (
        <p className="mt-3 text-sm text-body">Оферы не подключены — поток уводит трафик по редиректу.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {offers.map((offer) => (
            <li
              key={offer.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3"
            >
              <span className="min-w-0 truncate text-sm text-heading">{offer.name}</span>
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-body">
                  ID {offer.id}
                </span>
                <button
                  type="button"
                  onClick={() => remove(offer.id)}
                  disabled={isSaving}
                  aria-label={`Убрать офер ${offer.name}`}
                  className="rounded-lg px-2.5 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 rounded-xl border border-dashed border-line-strong p-4">
        <label htmlFor="stream-offers" className="text-sm font-medium text-heading">
          Добавить оферы
        </label>
        <div className="mt-2">
          <Combobox.Root
            items={items}
            selected={selected}
            onQueryChange={setSearch}
            onToggle={toggle}
            isLoading={isOffersLoading}
            errorMessage={isOffersError ? (offersError?.message ?? 'Не удалось загрузить оферы') : null}
            emptyText="Оферы не найдены"
          >
            <div className="relative">
              <Combobox.Input id="stream-offers" placeholder="Поиск офера по названию" />
              <Combobox.List />
            </div>
            <div className="mt-3">
              <Combobox.Chips emptyText="Оферы для добавления не выбраны" />
            </div>
          </Combobox.Root>
        </div>

        <button
          type="button"
          onClick={addSelected}
          disabled={selected.length === 0 || isSaving}
          className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover disabled:opacity-50"
        >
          {isSaving ? 'Сохранение…' : 'Добавить выбранные'}
        </button>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </>
  )
}

export function StreamPage() {
  const { streamId } = useParams<{ streamId: string }>()
  const id = streamId ? Number(streamId) : null
  const validId = id !== null && Number.isInteger(id) && id > 0 ? id : null

  const { stream, isStreamLoading, isStreamError, streamError, updateStreamOffers, isUpdatingOffers } =
    useStreamsStore({ streamId: validId })

  const [offersError, setOffersError] = useState<string | null>(null)

  const saveOffers = async (offerIds: number[]) => {
    if (validId === null) return

    setOffersError(null)
    try {
      await updateStreamOffers({ id: validId, offerIds })
    } catch (cause: unknown) {
      setOffersError(cause instanceof Error ? cause.message : 'Не удалось сохранить оферы')
    }
  }

  if (validId === null) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-semibold text-heading">Поток не найден</h1>
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
      <Link
        to={stream?.campaignId ? `/company/${stream.campaignId}` : '/'}
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        ← {stream?.campaignId ? 'К компании' : 'Все компании'}
      </Link>

      {isStreamLoading && <p className="mt-6 text-body">Загрузка…</p>}

      {isStreamError && (
        <p className="mt-6 text-red-600">
          Не удалось загрузить поток: {streamError?.message ?? 'неизвестная ошибка'}
        </p>
      )}

      {stream && (
        <>
          <header className="mt-3 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold text-heading">{stream.name}</h1>
              <p className="mt-1 text-sm text-body">Поток #{stream.id}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                stream.state === 'active'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-surface text-body'
              }`}
            >
              {stream.state ?? 'неизвестно'}
            </span>
          </header>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <section>
              <h2 className="text-lg font-semibold text-heading">Параметры</h2>
              <dl className="mt-3 flex flex-col gap-2">
                <DetailRow label="ID" value={stream.id} />
              </dl>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-heading">Оферы</h2>
              <OffersSection
                key={stream.id}
                offers={stream.offers}
                isSaving={isUpdatingOffers}
                error={offersError}
                onSave={saveOffers}
              />
            </section>
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-heading">Фильтры</h2>
            <div className="mt-3">
              <FiltersSection filters={stream.filters} />
            </div>
          </section>
        </>
      )}
    </section>
  )
}
