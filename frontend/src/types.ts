// Backend DTO'larının TypeScript karşılıkları.
// Alan adları backend'deki EventResponseDto / AuthResponse / ErrorResponse ile birebir aynıdır.

export interface EventSummary {
  id: number
  title: string
  description: string | null
  eventDate: string // ISO-8601 (LocalDateTime), örn. "2026-12-01T19:30:00"
  location: string
  price: number
  capacity: number
  categoryName: string
}

/** Spring Data'nın Page<T> yanıtının frontend'de kullandığımız sadeleştirilmiş hali. */
export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number // mevcut sayfa (0 tabanlı)
  size: number
}

export interface AuthResponse {
  token: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface LoginRequest {
  email: string
  password: string
}

/** Backend'deki GlobalExceptionHandler'ın döndürdüğü standart hata gövdesi. */
export interface ErrorResponse {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}
