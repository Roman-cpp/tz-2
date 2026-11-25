import type { Stream } from '../../../entities/stream'

type StreamsTableProps = {
  streams: Stream[]
  onEdit: (stream: Stream) => void
  onDelete: (stream: Stream) => void
}

export function StreamsTable({ streams, onEdit, onDelete }: StreamsTableProps) {
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
            <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-body">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {streams.map((stream) => (
            <tr key={stream.id} className="transition hover:bg-surface">
              <td className="px-6 py-4 text-sm text-body">{stream.id}</td>
              <td className="px-6 py-4 font-medium text-heading">{stream.name}</td>
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
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(stream)}
                    className="rounded-lg border border-line-strong px-3.5 py-1.5 text-sm font-medium text-heading transition hover:bg-surface"
                  >
                    Редактировать
                  </button>
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
