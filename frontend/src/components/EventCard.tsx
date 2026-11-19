import { CalendarDays, MapPin, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate, formatMoney, formatTime, isPast } from '../lib/format'
import type { EventSummary } from '../types'
import { Badge } from './ui'

function toneFor(name: string): 'brand' | 'accent' | 'mint' {
  const tones = ['brand', 'accent', 'mint'] as const
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return tones[hash % tones.length]
}

export function EventCard({ event }: { event: EventSummary }) {
  const past = isPast(event.eventDate)
  const day = new Date(event.eventDate)

  return (
    <Link
      to={`/events/${event.id}`}
      className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-brand-500/20"
    >
      <div className="flex items-start justify-between gap-3 p-5 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex size-12 shrink-0 flex-col items-center justify-center rounded-xl text-center leading-none ${
              past ? 'bg-gray-100 text-gray-500' : 'bg-brand-600 text-white'
            }`}
          >
            <span className="text-lg font-semibold">{day.getDate()}</span>
            <span className="mt-0.5 text-[10px] font-medium uppercase">
              {day.toLocaleString('tr-TR', { month: 'short' })}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="line-clamp-2 font-semibold text-gray-900 group-hover:text-brand-700">
              {event.title}
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">
              {formatDate(event.eventDate)} · {formatTime(event.eventDate)}
            </p>
          </div>
        </div>
        <Badge tone={past ? 'gray' : toneFor(event.categoryName)}>{event.categoryName}</Badge>
      </div>

      {event.description && (
        <p className="line-clamp-2 px-5 text-sm text-gray-600">{event.description}</p>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-3.5 text-sm">
        <div className="flex min-w-0 items-center gap-4 text-gray-500">
          <span className="flex items-center gap-1.5 truncate">
            <MapPin className="size-4 shrink-0" /> <span className="truncate">{event.location}</span>
          </span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <Users className="size-4" /> {event.capacity}
          </span>
        </div>
        <span className={`shrink-0 font-semibold ${past ? 'text-gray-400' : 'text-gray-900'}`}>
          {formatMoney(event.price)}
        </span>
      </div>

      {past && (
        <div className="flex items-center gap-1.5 bg-gray-50 px-5 py-2 text-xs text-gray-500">
          <CalendarDays className="size-3.5" /> Bu etkinlik geçmişte kaldı
        </div>
      )}
    </Link>
  )
}
