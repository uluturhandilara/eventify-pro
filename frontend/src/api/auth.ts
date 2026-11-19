import { request } from './client'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types'

export const authApi = {
  login: (data: LoginRequest) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: data, auth: false }),

  register: (data: RegisterRequest) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: data, auth: false }),
}
