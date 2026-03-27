/**
 * AuthContext
 *
 * Manages:
 *   - user object + token (persisted to localStorage)
 *   - authentication status
 *   - async login / register / logout with loading + error states
 *   - token refresh on app init
 *
 * Exposes via useAuth():
 *   user, token, isAuthenticated
 *   loading, error
 *   login(credentials)   → calls authService, stores result
 *   register(userData)   → calls authService, stores result
 *   logout()             → clears state + storage
 *   clearError()         → resets error state
 *   updateUser(partial)  → merge partial user data (e.g. after profile edit)
 */
import { createContext, useContext, useReducer, useCallback } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { loginUser, registerUser, logoutUser } from '../services/authService'

// ── State shape ───────────────────────────────────────────
const INITIAL_STATE = {
  loading: false,
  error:   null,
}

// ── Reducer ───────────────────────────────────────────────
const AUTH_ACTIONS = {
  REQUEST: 'REQUEST',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  CLEAR_ERROR: 'CLEAR_ERROR',
}

function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.REQUEST:
      return { ...state, loading: true, error: null }
    case AUTH_ACTIONS.SUCCESS:
      return { ...state, loading: false, error: null }
    case AUTH_ACTIONS.FAILURE:
      return { ...state, loading: false, error: action.payload }
    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null }
    default:
      return state
  }
}

// ── Context ───────────────────────────────────────────────
const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user,  setUser]  = useLocalStorage('fixbhai_user',  null)
  const [token, setToken] = useLocalStorage('fixbhai_token', null)
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE)

  const isAuthenticated = Boolean(user && token)

  // ── Actions ─────────────────────────────────────────────

  const login = useCallback(async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.REQUEST })
    try {
      const { user: userData, token: authToken } = await loginUser(credentials)
      setToken(authToken)
      setUser(userData)
      dispatch({ type: AUTH_ACTIONS.SUCCESS })
      return userData
    } catch (err) {
      const msg = err?.message || 'Login failed. Please try again.'
      dispatch({ type: AUTH_ACTIONS.FAILURE, payload: msg })
      throw err
    }
  }, [setToken, setUser])

  const register = useCallback(async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REQUEST })
    try {
      const { user: newUser, token: authToken } = await registerUser(userData)
      setToken(authToken)
      setUser(newUser)
      dispatch({ type: AUTH_ACTIONS.SUCCESS })
      return newUser
    } catch (err) {
      const msg = err?.message || 'Registration failed. Please try again.'
      dispatch({ type: AUTH_ACTIONS.FAILURE, payload: msg })
      throw err
    }
  }, [setToken, setUser])

  const logout = useCallback(async () => {
    try {
      await logoutUser()
    } catch {
      // Ignore server-side logout errors — always clear local state
    } finally {
      setToken(null)
      setUser(null)
    }
  }, [setToken, setUser])

  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
  }, [])

  /** Merge partial updates into the stored user object */
  const updateUser = useCallback((partial) => {
    setUser(prev => prev ? { ...prev, ...partial } : prev)
  }, [setUser])

  // ── Derived selectors ────────────────────────────────────

  const isAdmin    = user?.role === 'admin'
  const isTech     = user?.role === 'technician'
  const isCustomer = user?.role === 'customer'

  return (
    <AuthContext.Provider value={{
      // State
      user,
      token,
      isAuthenticated,
      isAdmin,
      isTech,
      isCustomer,
      loading: state.loading,
      error:   state.error,
      // Actions
      login,
      register,
      logout,
      clearError,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
