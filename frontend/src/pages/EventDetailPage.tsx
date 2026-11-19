import { ArrowLeft, CalendarDays, Clock, MapPin, Ticket, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiError } from '../api/client'
import { eventsApi } from '../api/events'
import { Badge, EmptyState, Spinner } from '../components/ui'
import { formatDate, formatMoney, formatTime, isPast } from '../lib/format'
import type { EventSummary } from '../types'

export function EventDetailPage() {
  const { id } = useParams()
  // Sonucu, hangi id için alındığıyla birlikte tutarız; id değişince eski sonuç
  // "bayat" sayılır ve yeni istek gelene kadar yükleniyor gösterilir.
  const [result, setResult] = useState<{ id: string | undefined; event?: EventSummary; error?: string } | null>(null)

  useEffect(() => {
    let cancelled = false
    eventsApi
      .get(Number(id))
      .then((event) => {
        if (!cancelled) setResult({ id, event })
      })
      .catch((err) => {
        if (!cancelled)
          setResult({ id, error: err instanceof ApiError ? err.message : 'Etkinlik yüklenemedi.' })
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const current = result?.id === id ? result : null
  const event = current?.event ?? null
  const error = current?.error ?? null
  const status: 'loading' | 'ok' | 'error' = !current ? 'loading' : event ? 'ok' : 'error'

  if (status === 'loading') {
    return (
      <div className="flex justify-center py-24 text-brand-600">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (status === 'error' || !event) {
    return (
      <div className="space-y-4">
        <BackLink />
        <EmptyState
          icon={CalendarDays}
          title="Etkinlik bulunamadı"
          description={error ?? undefined}
          action={
            <Link to="/events" className="btn-ghost">
              Etkinliklere dön
            </Link>
          }
        />
      </div>
    )
  }

  const past = isPast(event.eventDate)

  return (
    <div className="space-y-6">
      <BackLink />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sol: başlık + açıklama */}
        <div className="card overflow-hidden lg:col-span-2">
          <div className="h-2 bg-gradient-to-r from-brand-600 via-accent-500 to-mint-500" />
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={past ? 'gray' : 'brand'}>{event.categoryName}</Badge>
              {past && <Badge tone="gray">Geçmiş etkinlik</Badge>}
            </div>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-gray-900">{event.title}</h1>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <Info icon={CalendarDays} label="Tarih" value={formatDate(event.eventDate)} />
              <Info icon={Clock} label="Saat" value={formatTime(event.eventDate)} />
              <Info icon={MapPin} label="Konum" value={event.location} />
              <Info icon={Users} label="Kontenjan" value={`${event.capacity} kişi`} />
            </dl>

            <div className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Etkinlik hakkında
              </h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-gray-700">
                {event.description || 'Bu etkinlik için henüz bir açıklama girilmemiş.'}
              </p>
            </div>
          </div>
        </div>

        {/* Sağ: bilet kutusu */}
        <aside className="card h-fit p-6">
          <p className="text-sm text-gray-500">Bilet fiyatı</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{formatMoney(event.price)}</p>
          <button
            type="button"
            className="btn-primary mt-5 w-full"
            disabled
            title="Bilet satın alma uç noktası backend'e eklenince aktif olacak"
          >
            <Ticket className="size-4" />
            {past ? 'Satış kapandı' : 'Bilet al'}
          </button>
          <p className="mt-3 text-center text-xs text-gray-500">
            {past
              ? 'Bu etkinlik gerçekleşti.'
              : 'Bilet satın alma, backend tarafı tamamlandığında açılacak.'}
          </p>

          {!past && (
            <div className="mt-6 rounded-lg bg-brand-50 p-4 text-sm text-brand-800">
              <p className="font-medium">İpucu</p>
              <p className="mt-1 text-brand-700">
                Kontenjan {event.capacity} kişiyle sınırlı. Erken davranmakta fayda var.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

function BackLink() {
  return (
    <Link
      to="/events"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-brand-700"
    >
      <ArrowLeft className="size-4" /> Etkinliklere dön
    </Link>
  )
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/60 p-3.5">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm">
        <Icon className="size-4.5" />
      </div>
      <div className="min-w-0">
        <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
        <dd className="mt-0.5 truncate text-sm font-medium text-gray-900">{value}</dd>
      </div>
    </div>
  )
}
