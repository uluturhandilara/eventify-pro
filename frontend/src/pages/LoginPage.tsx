import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { AuthLayout } from '../components/AuthLayout'
import { Alert, Field, Spinner } from '../components/ui'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  // ProtectedRoute bizi buraya yolladıysa, girişten sonra geldiğimiz sayfaya dön
  const from = (location.state as { from?: string } | null)?.from ?? '/events'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Giriş yapılamadı.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Tekrar hoş geldin"
      subtitle="Devam etmek için hesabına giriş yap."
      footer={
        <>
          Hesabın yok mu?{' '}
          <Link to="/register" className="font-medium text-brand-600 hover:underline">
            Kayıt ol
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        {error && <Alert>{error}</Alert>}
        <Field label="E-posta" htmlFor="email">
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@eposta.com"
          />
        </Field>
        <Field label="Şifre" htmlFor="password">
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </Field>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading && <Spinner className="size-4" />}
          Giriş yap
        </button>
      </form>
    </AuthLayout>
  )
}
