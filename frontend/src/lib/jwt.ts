/**
 * JWT yardımcıları. Token'ı DOĞRULAMAYIZ (bu backend'in işi); yalnızca içindeki
 * açık bilgiyi (e-posta, bitiş süresi) ekranda göstermek için okuruz.
 */
export interface JwtPayload {
  sub: string // backend e-postayı "subject" olarak koyar
  iat: number
  exp: number
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1]
    // base64url → base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    )
    return JSON.parse(json) as JwtPayload
  } catch {
    return null
  }
}

export function isExpired(token: string): boolean {
  const payload = decodeJwt(token)
  if (!payload) return true
  return payload.exp * 1000 <= Date.now()
}
