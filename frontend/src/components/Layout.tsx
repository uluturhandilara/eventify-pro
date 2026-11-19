import { CalendarDays, LogOut, Menu, Search, Ticket, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { NavLink, Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const nav = [
  { to: '/events', label: 'Etkinlikler', icon: CalendarDays },
  { to: '/tickets', label: 'Biletlerim', icon: Ticket, soon: true },
]

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <img src="/favicon.svg" alt="" className="size-8" />
      <span className="text-lg font-semibold tracking-tight text-gray-900">
        Eventify<span className="text-brand-600">Pro</span>
      </span>
    </div>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const initials = user?.email.slice(0, 2).toUpperCase() ?? '?'

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {nav.map(({ to, label, icon: Icon, soon }) =>
          soon ? (
            <span
              key={to}
              className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400"
              title="Backend'de bilet uç noktaları eklenince açılacak"
            >
              <Icon className="size-4.5" />
              {label}
              <span className="ml-auto rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium uppercase">
                Yakında
              </span>
            </span>
          ) : (
            <NavLink
              key={to}
              to={to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="size-4.5" />
              {label}
            </NavLink>
          ),
        )}
      </nav>

      <div className="border-t border-gray-200 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">{user?.email}</p>
            <p className="text-xs text-gray-500">Katılımcı</p>
          </div>
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            title="Çıkış yap"
            aria-label="Çıkış yap"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function Layout() {
  const [open, setOpen] = useState(false)
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState(params.get('q') ?? '')

  const submitSearch = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/events?q=${encodeURIComponent(q)}` : '/events')
  }

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-gray-900/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl">
            <button
              type="button"
              className="absolute right-3 top-4 rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              onClick={() => setOpen(false)}
              aria-label="Menüyü kapat"
            >
              <X className="size-5" />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Menüyü aç"
            >
              <Menu className="size-5" />
            </button>
            <form onSubmit={submitSearch} className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Etkinlik ara…"
                className="input !py-2 !pl-9"
                aria-label="Etkinlik ara"
              />
            </form>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
