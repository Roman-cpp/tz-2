import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

export type ComboboxItem = {
  id: number
  label: string
}

type ComboboxContextValue = {
  listboxId: string
  items: ComboboxItem[]
  selected: ComboboxItem[]
  query: string
  isOpen: boolean
  activeIndex: number
  isLoading: boolean
  errorMessage: string | null
  emptyText: string
  open: () => void
  setQuery: (value: string) => void
  setActiveIndex: (index: number) => void
  toggleItem: (item: ComboboxItem) => void
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
}

const ComboboxContext = createContext<ComboboxContextValue | null>(null)

function useComboboxCtx(part: string): ComboboxContextValue {
  const context = useContext(ComboboxContext)
  if (!context) {
    throw new Error(`<Combobox.${part}> должен использоваться внутри <Combobox.Root>`)
  }
  return context
}

type RootProps = {
  items: ComboboxItem[]
  selected: ComboboxItem[]
  onQueryChange: (query: string) => void
  onToggle: (item: ComboboxItem) => void
  isLoading?: boolean
  errorMessage?: string | null
  emptyText?: string
  children: ReactNode
}

function Root({
  items,
  selected,
  onQueryChange,
  onToggle,
  isLoading = false,
  errorMessage = null,
  emptyText = 'Ничего не найдено',
  children,
}: RootProps) {
  const listboxId = useId()
  const [query, setQueryState] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const setQuery = useCallback(
    (value: string) => {
      setQueryState(value)
      setActiveIndex(-1)
      setIsOpen(true)
      onQueryChange(value)
    },
    [onQueryChange],
  )

  const toggleItem = useCallback(
    (item: ComboboxItem) => {
      onToggle(item)
      // Выбор закрывает список, чтобы не мешать смотреть на форму
      setIsOpen(false)
      setActiveIndex(-1)
      setQueryState('')
      onQueryChange('')
    },
    [onToggle, onQueryChange],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          return
        }
        setActiveIndex((index) => Math.min(index + 1, items.length - 1))
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex((index) => Math.max(index - 1, 0))
        return
      }

      if (event.key === 'Enter') {
        if (isOpen && activeIndex >= 0 && items[activeIndex]) {
          event.preventDefault()
          toggleItem(items[activeIndex])
        }
        return
      }

      if (event.key === 'Escape') {
        // Не закрываем модалку, внутри которой живёт комбобокс
        event.stopPropagation()
        setIsOpen(false)
        setActiveIndex(-1)
      }
    },
    [isOpen, activeIndex, items, toggleItem],
  )

  const open = useCallback(() => setIsOpen(true), [])

  const value = useMemo<ComboboxContextValue>(
    () => ({
      listboxId,
      items,
      selected,
      query,
      isOpen,
      activeIndex,
      isLoading,
      errorMessage,
      emptyText,
      open,
      setQuery,
      setActiveIndex,
      toggleItem,
      handleKeyDown,
    }),
    [
      listboxId,
      items,
      selected,
      query,
      isOpen,
      activeIndex,
      isLoading,
      errorMessage,
      emptyText,
      open,
      setQuery,
      toggleItem,
      handleKeyDown,
    ],
  )

  return <ComboboxContext.Provider value={value}>{children}</ComboboxContext.Provider>
}

function Input({ placeholder = 'Начните вводить название', id }: { placeholder?: string; id?: string }) {
  const context = useComboboxCtx('Input')

  return (
    <input
      id={id}
      type="text"
      role="combobox"
      aria-expanded={context.isOpen}
      aria-controls={context.listboxId}
      aria-autocomplete="list"
      value={context.query}
      onChange={(event) => context.setQuery(event.target.value)}
      onFocus={context.open}
      onClick={context.open}
      onKeyDown={context.handleKeyDown}
      placeholder={placeholder}
      className="w-full rounded-lg border border-line-strong px-4 py-3 text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
    />
  )
}

function List() {
  const context = useComboboxCtx('List')

  if (!context.isOpen) return null

  return (
    <div className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-line-strong bg-white shadow-lg">
      <ListBody />
    </div>
  )
}

function ListBody() {
  const context = useComboboxCtx('List')

  if (context.errorMessage) {
    return <p className="px-4 py-3 text-sm text-red-600">{context.errorMessage}</p>
  }

  if (context.isLoading) {
    return <p className="px-4 py-3 text-sm text-body">Загрузка…</p>
  }

  if (context.items.length === 0) {
    return <p className="px-4 py-3 text-sm text-body">{context.emptyText}</p>
  }

  return (
    <ul id={context.listboxId} role="listbox" aria-multiselectable="true">
      {context.items.map((item, index) => (
        <Item key={item.id} item={item} index={index} />
      ))}
    </ul>
  )
}

function Item({ item, index }: { item: ComboboxItem; index: number }) {
  const context = useComboboxCtx('Item')
  const isSelected = context.selected.some((selected) => selected.id === item.id)
  const isActive = context.activeIndex === index

  return (
    <li
      role="option"
      aria-selected={isSelected}
      // Не даём инпуту потерять фокус до обработки клика
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => context.toggleItem(item)}
      onMouseEnter={() => context.setActiveIndex(index)}
      className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm ${
        isActive ? 'bg-surface' : ''
      } ${isSelected ? 'font-medium text-primary' : 'text-heading'}`}
    >
      <span className="truncate">{item.label}</span>
      {isSelected && <span aria-hidden="true">✓</span>}
    </li>
  )
}

function Chips({ emptyText = 'Ничего не выбрано' }: { emptyText?: string }) {
  const context = useComboboxCtx('Chips')

  if (context.selected.length === 0) {
    return <p className="text-sm text-body">{emptyText}</p>
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {context.selected.map((item) => (
        <li
          key={item.id}
          className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
        >
          {item.label}
          <button
            type="button"
            aria-label={`Убрать ${item.label}`}
            onClick={() => context.toggleItem(item)}
            className="text-primary/70 transition hover:text-primary"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}

export const Combobox = {
  Root,
  Input,
  List,
  Chips,
}
