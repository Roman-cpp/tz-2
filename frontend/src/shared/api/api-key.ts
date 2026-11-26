// Ключ Keitaro живёт в localStorage: его вводит пользователь в шапке страницы,
// и он же уходит в заголовке X-Api-Key каждого запроса к нашему backend.
const STORAGE_KEY = 'kt-api-key'

type Listener = (apiKey: string) => void

const listeners = new Set<Listener>()

function readStored(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? ''
  } catch {
    // Приватный режим или заблокированное хранилище — работаем без сохранения
    return ''
  }
}

let current = readStored()

/** Текущий ключ; пустая строка — ключ не задан. */
export function getApiKey(): string {
  return current
}

/** Сохраняет ключ и оповещает подписчиков (шапку и кеш запросов). */
export function setApiKey(next: string): void {
  current = next.trim()

  try {
    if (current) localStorage.setItem(STORAGE_KEY, current)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Не смогли сохранить — ключ всё равно используется до перезагрузки
  }

  for (const listener of listeners) listener(current)
}

export function subscribeApiKey(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Заголовки авторизации для fetch; без ключа — пустой объект. */
export function authHeaders(): Record<string, string> {
  return current ? { 'X-Api-Key': current } : {}
}
