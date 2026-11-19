import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  page: number
  totalPages: number
  totalElements: number
  size: number
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, totalElements, size, onChange }: Props) {
  if (totalPages <= 1) return null
  const from = page * size + 1
  const to = Math.min((page + 1) * size, totalElements)

  const start = Math.max(0, Math.min(page - 2, totalPages - 5))
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i)

  return (
    <nav className="flex flex-col items-center justify-between gap-3 sm:flex-row" aria-label="Sayfalama">
      <p className="text-sm text-gray-500">
        <span className="font-medium text-gray-800">{from}–{to}</span> / {totalElements} etkinlik
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="btn-ghost size-9 !p-0"
          disabled={page === 0}
          onClick={() => onChange(page - 1)}
          aria-label="Önceki sayfa"
        >
          <ChevronLeft className="size-4" />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`size-9 rounded-lg text-sm font-medium transition ${
              p === page ? 'bg-brand-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {p + 1}
          </button>
        ))}
        <button
          type="button"
          className="btn-ghost size-9 !p-0"
          disabled={page >= totalPages - 1}
          onClick={() => onChange(page + 1)}
          aria-label="Sonraki sayfa"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </nav>
  )
}
