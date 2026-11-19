import { AlertCircle, CheckCircle2, Loader2, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export function Spinner({ className = '' }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} aria-label="Yükleniyor" />
}

export function Alert({
  kind = 'error',
  children,
}: {
  kind?: 'error' | 'success'
  children: ReactNode
}) {
  const styles =
    kind === 'error'
      ? 'border-red-200 bg-red-50 text-red-800'
      : 'border-mint-500/30 bg-mint-100 text-mint-600'
  const Icon = kind === 'error' ? AlertCircle : CheckCircle2
  return (
    <div role="alert" className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm ${styles}`}>
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div>{children}</div>
    </div>
  )
}

export function Badge({
  children,
  tone = 'brand',
}: {
  children: ReactNode
  tone?: 'brand' | 'accent' | 'mint' | 'gray'
}) {
  const tones = {
    brand: 'bg-brand-50 text-brand-700 ring-brand-600/15',
    accent: 'bg-accent-100 text-accent-600 ring-accent-500/20',
    mint: 'bg-mint-100 text-mint-600 ring-mint-500/25',
    gray: 'bg-gray-100 text-gray-600 ring-gray-500/15',
  }
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

export function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string
  htmlFor: string
  children: ReactNode
  hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="card flex flex-col items-center px-6 py-16 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Icon className="size-6" />
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function StatCard({
  label,
  value,
  hint,
  tone = 'brand',
  icon: Icon,
}: {
  label: string
  value: ReactNode
  hint?: string
  tone?: 'brand' | 'accent' | 'mint'
  icon: LucideIcon
}) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600',
    accent: 'bg-accent-100 text-accent-600',
    mint: 'bg-mint-100 text-mint-600',
  }
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
        <p className="mt-0.5 truncate text-2xl font-semibold text-gray-900">{value}</p>
        {hint && <p className="text-xs text-gray-500">{hint}</p>}
      </div>
    </div>
  )
}
