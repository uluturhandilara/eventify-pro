import { CalendarDays, CalendarX2, Layers, SearchX, Tag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ApiError } from '../api/client'
import { eventsApi } from '../api/events'
import { EventCard } from '../components/EventCard'
import { Pagination } from '../components/Pagination'
import { Alert, EmptyState, Spinner, StatCard } from '../components/ui'
import { isPast } from '../lib/format'
import type { EventSummary, Page } from '../types'

const PAGE_SIZE = 9

const sortOptions = [
  { value: 'eventDate,asc', label: 'Tarih (en yakın)' },
  { value: 'eventDate,desc', label: 'Tarih (en uzak)' },
  { value: 'price,asc', label: 'Fiyat (artan)' },
  { value: 'price,desc', label: 'Fiyat (azalan)' },
  { value: 'title,asc', label: 'Başlık (A→Z)' },
]

export function EventsPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const page = Number(params.get('page') ?? 0)
  const sort = params.get('sort') ?? sortOptions[0].value

  // Sonucu, hangi sorgu için alındığıyla birlikte tutarız. Sorgu (sayfa/sıralama/arama)
  // değişince eski sonuç bayat sayılır ve yenisi gelene kadar "yükleniyor" gösterilir.
  const queryKey = `${page}|${sort}|${q}`
  const [result, setResult] = useState<{ key: string; data?: Page<EventSummary>; error?: string } | null>(null)

  useEffect(() => {
    let cancelled = false
    eventsApi
      .list({ page, size: PAGE_SIZE, sort, title: q })
      .then((data) => {
        if (!cancelled) setResult({ key: queryKey, data })
      })
      .catch((err) => {
        if (!cancelled)
          setResult({ key: queryKey, error: err instanceof ApiError ? err.message : 'Etkinlikler yüklenemedi.' })
      })
    return () => {
      cancelled = true
    }
  }, [page, sort, q, queryKey])

  const current = result?.key === queryKey ? result : null
  const data = current?.data ?? null
  const error = current?.error ?? null
  const loading = current === null

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value === null || value === '') next.delete(key)
    else next.set(key, value)
    if (key !== 'page') next.delete('page') // filtre değişince ilk sayfaya dön
    setParams(next)
  }

  const events = data?.content ?? []
  const upcoming = events.filter((e) => !isPast(e.eventDate)).length
  const categories = new Set(events.map((e) => e.categoryName)).size

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {q ? (
              <>
                “{q}” için sonuçlar
              </>
            ) : (
              'Etkinlikler'
            )}
          </h1>
          <p className="text-sm text-gray-500">
            {q ? (
              <button
                type="button"
                className="text-brand-600 hover:underline"
                onClick={() => setParam('q', null)}
              >
                Aramayı temizle
              </button>
            ) : (
              'Yaklaşan tüm etkinlikleri keşfet.'
            )}
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          Sırala
          <select
            className="input w-auto !py-2"
            value={sort}
            onChange={(e) => setParam('sort', e.target.value)}
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Özet kartları: Preline'daki istatistik kutularının sade bir karşılığı */}
      {data && !q && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={Layers} label="Toplam etkinlik" value={data.totalElements} tone="brand" />
          <StatCard
            icon={CalendarDays}
            label="Bu sayfada yaklaşan"
            value={upcoming}
            hint={`${events.length} etkinlik içinde`}
            tone="mint"
          />
          <StatCard icon={Tag} label="Bu sayfada kategori" value={categories} tone="accent" />
        </div>
      )}

      {error && <Alert>{error}</Alert>}

      {loading ? (
        <div className="flex justify-center py-24 text-brand-600">
          <Spinner className="size-8" />
        </div>
      ) : events.length === 0 && !error ? (
        q ? (
          <EmptyState
            icon={SearchX}
            title="Sonuç bulunamadı"
            description={`“${q}” ile eşleşen bir etkinlik yok. Farklı bir kelime deneyin.`}
            action={
              <Link to="/events" className="btn-ghost">
                Tüm etkinlikler
              </Link>
            }
          />
        ) : (
          <EmptyState
            icon={CalendarX2}
            title="Henüz etkinlik yok"
            description="Etkinlik oluşturma uç noktası backend'e eklendiğinde buradan yeni etkinlik ekleyebileceksin."
          />
        )
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          {data && (
            <Pagination
              page={data.number}
              totalPages={data.totalPages}
              totalElements={data.totalElements}
              size={data.size}
              onChange={(p) => setParam('page', String(p))}
            />
          )}
        </>
      )}
    </div>
  )
}
