import { request } from './client'
import type { EventSummary, Page } from '../types'

export interface EventListParams {
  page?: number
  size?: number
  sort?: string
  title?: string
}

function normalizePage<T>(raw: unknown): Page<T> {
  const r = raw as Record<string, unknown>
  const nested = (r.page ?? {}) as Record<string, number>
  return {
    content: (r.content as T[]) ?? [],
    totalElements: (r.totalElements as number) ?? nested.totalElements ?? 0,
    totalPages: (r.totalPages as number) ?? nested.totalPages ?? 0,
    number: (r.number as number) ?? nested.number ?? 0,
    size: (r.size as number) ?? nested.size ?? 0,
  }
}

export const eventsApi = {
  async list(params: EventListParams = {}): Promise<Page<EventSummary>> {
    const { page = 0, size = 9, sort = 'eventDate,asc', title } = params
    const qs = new URLSearchParams({ page: String(page), size: String(size), sort })
    let path = '/events'
    if (title && title.trim()) {
      qs.set('title', title.trim())
      path = '/events/search'
    }
    return normalizePage<EventSummary>(await request(`${path}?${qs}`))
  },

  async byCategory(categoryId: number, page = 0, size = 9): Promise<Page<EventSummary>> {
    const qs = new URLSearchParams({ page: String(page), size: String(size) })
    return normalizePage<EventSummary>(await request(`/events/category/${categoryId}?${qs}`))
  },

  get: (id: number) => request<EventSummary>(`/events/${id}`),
}
