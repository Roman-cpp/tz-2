import { useEffect, useState, type FormEvent } from 'react'
import { getApiKey, setApiKey, subscribeApiKey } from '../../../shared/api/api-key'

// Поле ключа Keitaro: значение живёт в shared/api/api-key и уходит
// заголовком X-Api-Key вместе с каждым запросом к backend.
export function ApiKeyInput() {
  const [value, setValue] = useState(() => getApiKey())
  const [savedKey, setSavedKey] = useState(() => getApiKey())

  useEffect(() => subscribeApiKey(setSavedKey), [])

  const isDirty = value.trim() !== savedKey
  const hasKey = savedKey.length > 0

  const apply = (event: FormEvent) => {
    event.preventDefault()
    setApiKey(value)
  }

  const clear = () => {
    setValue('')
    setApiKey('')
  }

  return (
    <form onSubmit={apply} className="w-full">
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="api-key" className="text-xs font-semibold uppercase tracking-wide text-body">
          Ключ Keitaro
        </label>
        <span
          title={hasKey ? 'Ключ задан' : 'Ключ не задан'}
          className={`size-2 rounded-full ${hasKey ? 'bg-emerald-500' : 'bg-line-strong'}`}
          aria-hidden="true"
        />
        <span className="text-xs text-body">{hasKey ? 'задан' : 'не задан'}</span>
      </div>

      <div className="mt-1.5 flex gap-2">
        <input
          id="api-key"
          type="password"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Вставьте API-ключ Keitaro"
          className="w-full min-w-0 rounded-lg border border-line-strong px-3 py-2 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          disabled={!isDirty}
          className="shrink-0 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white transition hover:bg-primary-hover disabled:opacity-50"
        >
          Сохранить
        </button>
        {hasKey && (
          <button
            type="button"
            onClick={clear}
            className="shrink-0 rounded-lg border border-line-strong px-3.5 py-2 text-sm font-medium text-heading transition hover:bg-surface"
          >
            Сбросить
          </button>
        )}
      </div>
    </form>
  )
}
