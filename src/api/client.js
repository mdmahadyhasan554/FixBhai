/**
 * client.js — Axios instance (single source of truth)
 *
 * Features:
 *   - Base URL + timeout from .env
 *   - Request interceptor: attaches JWT Bearer token
 *   - Response interceptor: unwraps data, normalises errors
 *   - 401 handling: attempts token refresh once, then redirects to /login
 *   - Request queue: holds requests while a refresh is in progress
 */
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL    || 'https://api.fixbhai.in/v1'
const TIMEOUT  = Number(import.meta.env.VITE_API_TIMEOUT) || 10000

// ── Axios instance ────────────────────────────────────────
const client = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept:         'application/json',
  },
})

// ── Token helpers (read/write localStorage) ───────────────
export const tokenStorage = {
  get:    ()      => { try { return JSON.parse(localStorage.getItem('fixbhai_token')) } catch { return null } },
  set:    (token) => { try { localStorage.setItem('fixbhai_token', JSON.stringify(token)) } catch {} },
  remove: ()      => { try { localStorage.removeItem('fixbhai_token'); localStorage.removeItem('fixbhai_user') } catch {} },
}

// ── Refresh state ─────────────────────────────────────────
let isRefreshing = false
let refreshQueue = []   // [{ resolve, reject }]

const processQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => error ? reject(error) : resolve(token))
  refreshQueue = []
}

// ── Request interceptor — attach token ───────────────────
client.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor — errors + refresh ──────────────
client.interceptors.response.use(
  // Unwrap .data so callers receive the payload directly
  (response) => response.data,

  async (error) => {
    const status   = error.response?.status
    const original = error.config

    // ── 401: try token refresh once ──────────────────────
    if (status === 401 && !original._retry) {
      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject })
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`
          return client(original)
        })
      }

      original._retry = true
      isRefreshing    = true

      try {
        const raw          = localStorage.getItem('fixbhai_refresh_token')
        const refreshToken = raw ? JSON.parse(raw) : null

        if (!refreshToken) throw new Error('No refresh token')

        const { token: newToken } = await axios.post(
          `${BASE_URL}/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } },
        )

        tokenStorage.set(newToken)
        processQueue(null, newToken)
        original.headers.Authorization = `Bearer ${newToken}`
        return client(original)
      } catch (refreshError) {
        processQueue(refreshError)
        tokenStorage.remove()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // ── Normalise all other errors ────────────────────────
    const message =
      error.response?.data?.message ||
      error.response?.data?.error   ||
      error.message                 ||
      'An unexpected error occurred'

    if (status === 403)
      return Promise.reject(new ApiError('You do not have permission to perform this action', 403))

    if (status === 404)
      return Promise.reject(new ApiError('The requested resource was not found', 404))

    if (status === 422) {
      const fieldErrors = error.response?.data?.errors || {}
      return Promise.reject(new ApiError(message, 422, fieldErrors))
    }

    if (status >= 500)
      return Promise.reject(new ApiError('Server error. Please try again later.', status))

    if (!error.response)
      return Promise.reject(new ApiError('Network error. Check your connection.', 0))

    return Promise.reject(new ApiError(message, status))
  },
)

// ── ApiError ──────────────────────────────────────────────
export class ApiError extends Error {
  constructor(message, status = 0, fieldErrors = {}) {
    super(message)
    this.name        = 'ApiError'
    this.status      = status
    this.fieldErrors = fieldErrors
  }
}

export default client
