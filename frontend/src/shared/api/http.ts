import { authHeaders } from './api-key'

async function readError(response: Response, url: string): Promise<string> {
  try {
    const body = (await response.json()) as { detail?: unknown }
    if (typeof body.detail === 'string') return body.detail
  } catch {
    // тело не JSON — покажем только статус
  }
  return `Запрос ${url} завершился с ошибкой: ${response.status}`
}

export async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    signal,
    headers: { Accept: 'application/json', ...authHeaders() },
  })

  if (!response.ok) throw new Error(await readError(response, url))

  return (await response.json()) as T
}

async function sendJson<T>(url: string, method: 'POST' | 'PUT', payload: unknown): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })

  if (!response.ok) throw new Error(await readError(response, url))

  return (await response.json()) as T
}

export function postJson<T>(url: string, payload: unknown): Promise<T> {
  return sendJson<T>(url, 'POST', payload)
}

export function putJson<T>(url: string, payload: unknown): Promise<T> {
  return sendJson<T>(url, 'PUT', payload)
}

export async function deleteRequest(url: string): Promise<void> {
  const response = await fetch(url, { method: 'DELETE', headers: authHeaders() })

  if (!response.ok) throw new Error(await readError(response, url))
}
