import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authApi } from '../api/auth'
import { tokenStore, UNAUTHORIZED_EVENT } from '../api/client'
import { decodeJwt, isExpired } from '../lib/jwt'
import type { LoginRequest, RegisterRequest } from '../types'

export interface AuthUser {
  email: string
}

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null)

function userFromToken(token: string | null): AuthUser | null {
  if (!token || isExpired(token)) return null
  const payload = decodeJwt(token)
  return payload ? { email: payload.sub } : null
}

/**
 * Oturum durumunu uygulamanın her yerine dağıtır.
 * Token localStorage'da tutulur; sayfa yenilense bile oturum kalır.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = tokenStore.get()
    const u = userFromToken(token)
    if (token && !u) tokenStore.clear() // süresi dolmuş token'ı temizle
    return u
  })

  const applyToken = useCallback((token: string) => {
    tokenStore.set(token)
    setUser(userFromToken(token))
  }, [])

  const login = useCallback(
    async (data: LoginRequest) => applyToken((await authApi.login(data)).token),
    [applyToken],
  )

  const register = useCallback(
    async (data: RegisterRequest) => applyToken((await authApi.register(data)).token),
    [applyToken],
  )

  const logout = useCallback(() => {
    tokenStore.clear()
    setUser(null)
  }, [])

  // client.ts bir 401/403 yakaladığında bu olayı yayınlar → oturumu düşür
  useEffect(() => {
    const handler = () => setUser(null)
    window.addEventListener(UNAUTHORIZED_EVENT, handler)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handler)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: user !== null, login, register, logout }),
    [user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
