import type { ReactNode } from 'react'
import { Logo } from './Layout'

const CURRENT_YEAR = new Date().getFullYear()

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-mint-500/30 blur-3xl"
          aria-hidden
        />
        <div className="relative flex items-center gap-2.5 text-white">
          <img src="/favicon.svg" alt="" className="size-9 rounded-lg ring-2 ring-white/30" />
          <span className="text-xl font-semibold tracking-tight">EventifyPro</span>
        </div>
        <div className="relative max-w-md">
          <h2 className="text-3xl font-semibold leading-tight">
            Etkinlikleri keşfet, biletini saniyeler içinde al.
          </h2>
          <p className="mt-4 text-brand-100">
            Konserlerden atölyelere, yüzlerce etkinliği tek yerden takip et. Hesabını oluştur ve
            yerini ayırt.
          </p>
        </div>
        <p className="relative text-sm text-brand-200">© {CURRENT_YEAR} EventifyPro</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-6 text-center text-sm text-gray-500">{footer}</p>
        </div>
      </div>
    </div>
  )
}
