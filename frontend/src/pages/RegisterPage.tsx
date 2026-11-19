import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { AuthLayout } from '../components/AuthLayout'
import { Alert, Field, Spinner } from '../components/ui'
import { useAuth } from '../hooks/useAuth'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (form.password.length < 6) {
      setError('Şifre en az 6 karakter olmalı.')
      return
    }
    setLoading(true)
    try {
      await register(form)
      navigate('/events', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Kayıt oluşturulamadı.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Hesap oluştur"
      subtitle="Birkaç saniyede ücretsiz kayıt ol."
      footer={
        <>
          Zaten hesabın var mı?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Giriş yap
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        {error && <Alert>{error}</Alert>}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Ad" htmlFor="firstName">
            <input
              id="firstName"
              autoComplete="given-name"
              required
              className="input"
              value={form.firstName}
              onChange={update('firstName')}
            />
          </Field>
          <Field label="Soyad" htmlFor="lastName">
            <input
              id="lastName"
              autoComplete="family-name"
              required
              className="input"
              value={form.lastName}
              onChange={update('lastName')}
            />
          </Field>
        </div>
        <Field label="E-posta" htmlFor="email">
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            className="input"
            value={form.email}
            onChange={update('email')}
            placeholder="ornek@eposta.com"
          />
        </Field>
        <Field label="Şifre" htmlFor="password" hint="En az 6 karakter.">
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            className="input"
            value={form.password}
            onChange={update('password')}
            placeholder="••••••••"
          />
        </Field>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading && <Spinner className="size-4" />}
          Kayıt ol
        </button>
      </form>
    </AuthLayout>
  )
}
