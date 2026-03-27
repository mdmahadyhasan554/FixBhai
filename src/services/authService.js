/**
 * authService.js
 *
 * Business logic layer for authentication.
 * Calls authApi — never touches axios or mock data directly.
 * Components call this, not the API layer.
 */
import { authApi } from '../api'

export const loginUser = (credentials) =>
  authApi.login(credentials)

export const registerUser = (userData) =>
  authApi.register(userData)

export const fetchProfile = () =>
  authApi.getProfile()

export const logoutUser = () =>
  authApi.logout()
