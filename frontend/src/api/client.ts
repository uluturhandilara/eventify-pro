import type { ErrorResponse } from '../types'

export const API_BASE = '/api/v1'
const TOKEN_KEY = 'eventify.token'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export const UNAUTHORIZED_EVENT = 'eventify:unauthorized'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  auth?: boolean
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const token = tokenStore.get()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(API_BASE + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, 'Sunucuya ulaşılamıyor. Backend çalışıyor mu?')
  }

  if (response.ok) {
    if (response.status === 204) return undefined as T
    return (await response.json()) as T
  }

  if (auth && (response.status === 401 || response.status === 403)) {
    tokenStore.clear()
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
  }

  throw new ApiError(response.status, await extractMessage(response))
}

async function extractMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as Partial<ErrorResponse>
    if (data.message) return prettifyValidationMessage(data.message)
    if (data.error) return data.error
  } catch {
    // gövde JSON değil → aşağıdaki duruma göre genel mesaja düş
  }
  if (response.status === 403) return 'Bu işlem için giriş yapmanız gerekiyor.'
  if (response.status === 404) return 'Kayıt bulunamadı.'
  return `Beklenmeyen bir hata oluştu (${response.status}).`
}

function prettifyValidationMessage(message: string): string {
  const match = message.match(/^\{(.*)\}$/)
  if (!match) return message
  return match[1]
    .split(/,\s(?=\w+=)/)
    .map((pair) => pair.replace('=', ': '))
    .join(' · ')
}
