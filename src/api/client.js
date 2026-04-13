/**
 * client.js — Axios instance (single source of truth)
 *
 * Features:
 *   - Base URL + timeout from .env
 *   - withCredentials: true (sends session cookies)
 *   - Response interceptor: unwraps data, normalises errors
 *   - 401 handling: clears storage and redirects to /login
 * 
 * Authentication: Uses PHP sessions with HttpOnly cookies.
 * The session cookie is automatically sent with all requests.
 */
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL    || 'https://api.fixbhai.in/v1'
const TIMEOUT  = Number(import.meta.env.VITE_API_TIMEOUT) || 10000

// ── Axios instance ────────────────────────────────────────
const client = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  withCredentials: true, // CRITICAL: Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
    Accept:         'application/json',
  },
})

// ── Response interceptor — errors ────────────────────────
client.interceptors.response.use(
  // Unwrap .data so callers receive the payload directly
  (response) => response.data,

  async (error) => {
    const status   = error.response?.status
    const original = error.config

    // ── 401: Redirect to login ──────────────────────
    if (status === 401 && !original._isRetry) {
      // Prevent infinite loops
      original._isRetry = true
      
      // Clear local storage
      try {
        localStorage.removeItem('fixbhai_user')
      } catch {}
      
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
