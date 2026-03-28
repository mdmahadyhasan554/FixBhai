/**
 * authApi.js — Authentication endpoints
 *
 * Real endpoints (VITE_USE_MOCK=false) → PHP backend:
 *   POST /auth/login.php
 *   POST /auth/register.php
 *   GET  /auth/me.php
 */
import client from './client'
import mock, { USE_MOCK } from './mock'

export const login = async (credentials) => {
  if (USE_MOCK) return mock.login(credentials)
  return client.post('/auth/login.php', credentials)
}

export const register = async (userData) => {
  if (USE_MOCK) return mock.register(userData)
  return client.post('/auth/register.php', userData)
}

export const getProfile = async () => {
  if (USE_MOCK) return mock.getProfile()
  return client.get('/auth/me.php')
}

// PHP backend is stateless — logout just clears the client-side token
export const logout = async () => Promise.resolve()

export const refreshToken = async (token) => {
  if (USE_MOCK) return Promise.resolve({ token: 'mock_refreshed_' + Date.now() })
  return Promise.resolve({ token })
}
