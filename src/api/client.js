/**
 * client.js — Axios instance (single source of truth)
 *
 * All API modules import from here, never from 'axios' directly.
 *
 * Config is driven by .env variables:
 *   VITE_API_URL      — backend base URL  (default: https://api.fixbhai.in/v1)
 *   VITE_API_TIMEOUT  — request timeout ms (default: 10000)
 *   VITE_USE_MOCK     — 'true' skips real HTTP calls (default: true)
 */
import axios from 'axios'

// ── Instance ──────────────────────────────────────────────
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL     || 'https://api.fixbhai.in/v1',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
})

// ── Request interceptor — attach auth token ───────────────
client.interceptors.request.use(
  (config) => {
    try {
      const raw   = localStorage.getItem('fixbhai_token')
      const token = raw ? JSON.parse(raw) : null
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch {
      // localStorage unavailable (SSR / private mode) — continue without token
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor — normalise errors ───────────────
client.interceptors.response.use(
  (response) => response.data,   // unwrap .data so callers get payload directly
  (error) => {
    const status  = error.response?.status
    const message = error.response?.data?.message
      || error.response?.data?.error
      || error.message
      || 'An unexpected error occurred'

    // 401 — token expired or invalid
    if (status === 401) {
      localStorage.removeItem('fixbhai_token')
      localStorage.removeItem('fixbhai_user')
      window.location.href = '/login'
    }

    // 403 — forbidden
    if (status === 403) {
      return Promise.reject(new ApiError('You do not have permission to perform this action', 403))
    }

    // 404 — not found
    if (status === 404) {
      return Promise.reject(new ApiError('The requested resource was not found', 404))
    }

    // 422 — validation errors from server
    if (status === 422) {
      const fieldErrors = error.response?.data?.errors || {}
      return Promise.reject(new ApiError(message, 422, fieldErrors))
    }

    // 5xx — server errors
    if (status >= 500) {
      return Promise.reject(new ApiError('Server error. Please try again later.', status))
    }

    // Network / timeout
    if (!error.response) {
      return Promise.reject(new ApiError('Network error. Check your connection.', 0))
    }

    return Promise.reject(new ApiError(message, status))
  },
)

// ── ApiError class ────────────────────────────────────────
export class ApiError extends Error {
  constructor(message, status = 0, fieldErrors = {}) {
    super(message)
    this.name        = 'ApiError'
    this.status      = status
    this.fieldErrors = fieldErrors  // { fieldName: 'error message' }
  }
}

export default client
