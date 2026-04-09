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

    // ── 401: Redirect to login (token refresh disabled for now) ──────────────────────
    if (status === 401 && !original._isRetry) {
      // Prevent infinite loops
      original._isRetry = true
      
      // Clear tokens and redirect to login
      tokenStorage.remove()
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
      
      return Promise.reject(new ApiError('Session expired. Please login again.', 401))
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
