/**
 * authApi.js — Authentication endpoints
 *
 * Real endpoints (when VITE_USE_MOCK=false):
 *   POST /auth/login
 *   POST /auth/register
 *   GET  /auth/me
 *   POST /auth/logout
 *   POST /auth/refresh
 */
import client from './client'
import mock, { USE_MOCK } from './mock'

/**
 * Login with email + password.
 * @returns {{ user, token }}
 */
export const login = async (credentials) => {
  if (USE_MOCK) return mock.login(credentials)
  return client.post('/auth/login', credentials)
}

/**
 * Register a new customer account.
 * @returns {{ user, token }}
 */
export const register = async (userData) => {
  if (USE_MOCK) return mock.register(userData)
  return client.post('/auth/register', userData)
}

/**
 * Fetch the currently authenticated user's profile.
 * @returns {User}
 */
export const getProfile = async () => {
  if (USE_MOCK) return mock.getProfile()
  return client.get('/auth/me')
}

/**
 * Invalidate the current session token on the server.
 */
export const logout = async () => {
  if (USE_MOCK) return Promise.resolve()
  return client.post('/auth/logout')
}

/**
 * Exchange a refresh token for a new access token.
 * @returns {{ token }}
 */
export const refreshToken = async (refreshToken) => {
  if (USE_MOCK) return Promise.resolve({ token: 'mock_refreshed_' + Date.now() })
  return client.post('/auth/refresh', { refreshToken })
}
