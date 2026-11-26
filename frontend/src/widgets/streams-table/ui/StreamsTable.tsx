import { Link } from 'react-router'
import type { Stream, StreamFilter } from '../../../entities/stream'

type StreamsTableProps = {
  streams: Stream[]
  onEdit: (stream: Stream) => void
  onDelete: (stream: Stream) => void
}

// Keitaro называет фильтр страны "country", а payload — список кодов (ISO-2).
const COUNTRY_FILTER = 'country'

const modeLabel: Record<string, string> = {
  accept: 'только',
  reject: 'кроме',
}

/** Чип страны: зелёный — пускаем, красный — исключаем. */
function CountryChip({ code, mode }: { code: string; mode: string }) {
  const isReject = mode === 'reject'

  return (
    <li
      title={`${modeLabel[mode] ?? mode}: ${code}`}
      className={`rounded-md px-2 py-0.5 text-xs font-semibold tracking-wide ${
        isReject ? 'bg-red-50 text-red-600 line-through' : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      {code}
    </li>
  )
}

/** Фильтры стрима: коды стран, а для прочих фильтров — их имя и значения. */
function FiltersCell({ filters }: { filters: StreamFilter[] }) {
  if (filters.length === 0) {
    return <span className="text-sm text-body">—</span>
  }

  return (
    <div className="flex flex-col gap-1.5">
      {filters.map((filter) => {
        const isCountry = filter.name.toLowerCase() === COUNTRY_FILTER

        return (
          <div key={filter.id} className="flex flex-wrap items-center gap-1.5">
            {!isCountry && (
              <span className="text-xs text-body">
                {filter.name} ({modeLabel[filter.mode] ?? filter.mode}):
              </span>
            )}
            {isCountry && (
              <span className="text-xs text-body">{modeLabel[filter.mode] ?? filter.mode}:</span>
            )}
            {filter.payload.length === 0 ? (
              <span className="text-xs text-body">пусто</span>
            ) : (
              <ul className="flex flex-wrap gap-1">
                {filter.payload.map((value) => (
                  <CountryChip key={`${filter.id}-${value}`} code={value} mode={filter.mode} />
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function StreamsTable({ streams, onDelete }: StreamsTableProps) {
  if (streams.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line-strong px-6 py-10 text-center text-body">
        У компании пока нет стримов.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="min-w-full text-left">
        <thead className="bg-surface">
          <tr>
            <th scope="col" className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-body">
              ID
            </th>
            <th scope="col" className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-body">
              Название стрима
            </th>
            <th scope="col" className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-body">
              Оферы
            </th>
            <th scope="col" className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-body">
              Фильтры
            </th>
            <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-body">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {streams.map((stream) => (
            <tr key={stream.id} className="transition hover:bg-surface">
              <td className="px-6 py-4 text-sm text-body">{stream.id}</td>
              <td className="px-6 py-4 font-medium text-heading">
                {/* Клик по названию открывает карточку потока на отдельной странице */}
                <Link
                  to={`/stream/${stream.id}`}
                  className="underline-offset-4 transition hover:text-primary hover:underline"
                >
                  {stream.name}
                </Link>
              </td>
              <td className="px-6 py-4">
                {stream.offers.length === 0 ? (
                  <span className="text-sm text-body">—</span>
                ) : (
                  <ul className="flex flex-wrap gap-1.5">
                    {stream.offers.map((offer) => (
                      <li
                        key={offer.id}
                        className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                      >
                        {offer.name}
                      </li>
                    ))}
                  </ul>
                )}
              </td>
              <td className="px-6 py-4">
                <FiltersCell filters={stream.filters} />
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onDelete(stream)}
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
