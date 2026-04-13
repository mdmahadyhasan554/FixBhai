/**
 * AuthContext
 *
 * Manages:
 *   - user object (persisted to localStorage for UI)
 *   - authentication status (via session cookies)
 *   - async login / register / logout with loading + error states
 *
 * Exposes via useAuth():
 *   user, isAuthenticated
 *   loading, error
 *   login(credentials)   → calls authService, stores user data
 *   register(userData)   → calls authService, stores user data
 *   logout()             → clears state + destroys session
 *   clearError()         → resets error state
 *   updateUser(partial)  → merge partial user data (e.g. after profile edit)
 * 
 * Note: Authentication uses PHP sessions with HttpOnly cookies.
 * The session cookie is automatically sent with all API requests.
 */
import { createContext, useContext, useReducer, useCallback } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { loginUser, registerUser, logoutUser } from '../services/authService'
import { useToast } from './ToastContext'

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
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE)
  const { toast }         = useToast()

  const isAuthenticated = Boolean(user)

  // ── Actions ─────────────────────────────────────────────

  const login = useCallback(async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.REQUEST })
    try {
      const { user: userData } = await loginUser(credentials)
      setUser(userData)
      dispatch({ type: AUTH_ACTIONS.SUCCESS })
      toast.success(`Welcome back, ${userData.name}!`)
      return userData
    } catch (err) {
      const msg = err?.message || 'Login failed. Please try again.'
      dispatch({ type: AUTH_ACTIONS.FAILURE, payload: msg })
      toast.error(msg)
      throw err
    }
  }, [setUser])

  const register = useCallback(async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REQUEST })
    try {
      const { user: newUser } = await registerUser(userData)
      setUser(newUser)
      dispatch({ type: AUTH_ACTIONS.SUCCESS })
      toast.success(`Account created! Welcome, ${newUser.name}!`)
      return newUser
    } catch (err) {
      const msg = err?.message || 'Registration failed. Please try again.'
      dispatch({ type: AUTH_ACTIONS.FAILURE, payload: msg })
      toast.error(msg)
      throw err
    }
  }, [setUser])

  const logout = useCallback(async () => {
    try {
      await logoutUser()
    } catch {
      // Ignore server-side logout errors — always clear local state
    } finally {
      setUser(null)
    }
  }, [setUser])

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
