import { useState, type KeyboardEvent } from 'react'

export type TagInputProps = {
  /** Текущий список строк. */
  value: string[]
  /** Новый список: вызывается после добавления или удаления элемента. */
  onChange: (next: string[]) => void
  /** id для `<label htmlFor>` — вешается на сам input. */
  id?: string
  placeholder?: string
  /** Максимальная длина вводимой строки. */
  maxLength?: number
  /** Максимум элементов; не задан — без ограничения. */
  maxItems?: number
  /** Приведение строки к виду до сохранения. По умолчанию — trim. */
  normalize?: (raw: string) => string
  /** Своя проверка значения: вернуть текст ошибки или null. */
  validate?: (normalized: string) => string | null
  /** Текст кнопки добавления. */
  addLabel?: string
  /** Что показать, когда список пуст. */
  emptyText?: string
  disabled?: boolean
}

// Разделители: по ним значение считается завершённым без нажатия Enter.
const SEPARATOR_RE = /[,;]/

const defaultNormalize = (raw: string) => raw.trim()

const sameValue = (a: string, b: string) => a.toLowerCase() === b.toLowerCase()

/**
 * Ввод списка произвольных строк: чипы с удалением плюс поле добавления.
 * Значение полностью контролируется снаружи — компонент отдаёт наружу массив строк.
 */
export function TagInput({
  value,
  onChange,
  id,
  placeholder = 'Введите значение и нажмите Enter',
  maxLength = 64,
  maxItems,
  normalize = defaultNormalize,
  validate,
  addLabel = 'Добавить',
  emptyText = 'Пока ничего не добавлено',
  disabled = false,
}: TagInputProps) {
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)

  const isFull = maxItems !== undefined && value.length >= maxItems

  const add = (raw: string = draft) => {
    if (disabled) return

    // Паста «RU, KZ, BY» разбираем на отдельные значения
    const chunks = raw.split(SEPARATOR_RE)
    const candidates = chunks.map(normalize).filter(Boolean)
    if (candidates.length === 0) return

    const limit = maxItems ?? Infinity
    const next = [...value]
    let duplicate: string | null = null
    let invalid: string | null = null

    for (const candidate of candidates) {
      if (next.length >= limit) break
      if (next.some((item) => sameValue(item, candidate))) {
        duplicate = candidate
        continue
      }

      if (candidate.length > maxLength) {
        invalid = `Не длиннее ${maxLength} символов: «${candidate}»`
        continue
      }

      const validationError = validate?.(candidate) ?? null
      if (validationError) {
        invalid = validationError
        continue
      }

      next.push(candidate)
    }

    // Ошибку показываем, но всё валидное из вставки всё равно добавляем
    setError(invalid ?? (duplicate ? `«${duplicate}» уже добавлено` : null))
    setDraft('')
    if (next.length !== value.length) onChange(next)
  }

  const remove = (target: string) => {
    if (disabled) return
    setError(null)
    onChange(value.filter((item) => item !== target))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // Enter внутри формы иначе отправит её целиком
      event.preventDefault()
      add()
      return
    }

    if (SEPARATOR_RE.test(event.key)) {
      event.preventDefault()
      add()
      return
    }

    // Backspace на пустом поле убирает последний чип
    if (event.key === 'Backspace' && draft === '' && value.length > 0) {
      remove(value[value.length - 1])
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <input
          id={id}
          type="text"
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value)
            setError(null)
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled || isFull}
          placeholder={isFull ? `Достигнут лимит: ${maxItems}` : placeholder}
          aria-invalid={error !== null}
          aria-describedby={error ? `${id ?? 'tag-input'}-error` : undefined}
          className="w-full rounded-lg border border-line-strong px-4 py-3 text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-surface disabled:text-body"
        />
        <button
          type="button"
          onClick={() => add()}
          disabled={disabled || isFull || draft.trim() === ''}
          className="shrink-0 rounded-lg border border-line-strong px-4 py-3 text-sm font-medium text-heading transition hover:bg-surface disabled:opacity-50"
        >
          + {addLabel}
        </button>
      </div>

      {error && (
        <p id={`${id ?? 'tag-input'}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}

      {value.length === 0 ? (
        <p className="text-sm text-body">{emptyText}</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {value.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
            >
              {item}
              <button
                type="button"
                aria-label={`Убрать ${item}`}
                onClick={() => remove(item)}
                disabled={disabled}
                className="text-primary/70 transition hover:text-primary disabled:opacity-50"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
