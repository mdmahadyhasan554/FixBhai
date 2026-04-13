/**
 * BookingContext
 *
 * Manages:
 *   - bookings list (loaded from API on mount)
 *   - async create / cancel / status update with loading + error states
 *   - optimistic UI updates (instant feedback, rollback on failure)
 *   - derived stats (total, completed, pending, spent)
 *
 * Exposes via useBooking():
 *   bookings[]         — current booking list
 *   loading            — true while fetching initial list
 *   submitting         — true while creating/updating a booking
 *   error              — last error message
 *   addBooking(data)   → create via API, optimistically prepend
 *   updateStatus(id, status) → update via API, optimistically update
 *   cancelBooking(id)  → shorthand for updateStatus(id, 'cancelled')
 *   getStats()         → { total, completed, pending, spent }
 *   clearError()       → reset error state
 */
import { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import {
  submitBooking,
  fetchBookings,
  cancelBooking  as apiCancel,
  changeStatus   as apiChangeStatus,
} from '../services/bookingService'
import { generateBookingId } from '../utils/formatters'
import { useToast } from './ToastContext'
import { useAuth } from './AuthContext' // Import useAuth

// ── Seed data (shown before API loads) ───────────────────
const SEED = [
  { id: 'BK001', service: 'AC Repair',  technician: 'Rajesh Kumar', date: '2025-04-10', time: '10:00 AM', status: 'confirmed', amount: 299 },
  { id: 'BK002', service: 'Plumbing',   technician: 'Suresh Patel', date: '2025-04-08', time: '2:00 PM',  status: 'completed', amount: 199 },
]

// ── State shape ───────────────────────────────────────────
const INITIAL = {
  bookings:   SEED,
  loading:    false,
  submitting: false,
  error:      null,
}

// ── Reducer ───────────────────────────────────────────────
const A = {
  FETCH_START:    'FETCH_START',
  FETCH_SUCCESS:  'FETCH_SUCCESS',
  FETCH_ERROR:    'FETCH_ERROR',
  SUBMIT_START:   'SUBMIT_START',
  SUBMIT_SUCCESS: 'SUBMIT_SUCCESS',
  SUBMIT_ERROR:   'SUBMIT_ERROR',
  OPTIMISTIC_ADD: 'OPTIMISTIC_ADD',
  OPTIMISTIC_UPDATE: 'OPTIMISTIC_UPDATE',
  ROLLBACK:       'ROLLBACK',
  CLEAR_ERROR:    'CLEAR_ERROR',
}

function reducer(state, action) {
  switch (action.type) {
    case A.FETCH_START:
      return { ...state, loading: true, error: null }

    case A.FETCH_SUCCESS:
      return { ...state, loading: false, bookings: action.payload }

    case A.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload }

    case A.SUBMIT_START:
      return { ...state, submitting: true, error: null }

    case A.SUBMIT_SUCCESS:
      return { ...state, submitting: false }

    case A.SUBMIT_ERROR:
      return { ...state, submitting: false, error: action.payload }

    case A.OPTIMISTIC_ADD:
      return { ...state, bookings: [action.payload, ...state.bookings] }

    case A.OPTIMISTIC_UPDATE:
      return {
        ...state,
        bookings: state.bookings.map(b =>
          b.id === action.payload.id ? { ...b, ...action.payload.changes } : b
        ),
      }

    case A.ROLLBACK:
      return { ...state, bookings: action.payload }

    case A.CLEAR_ERROR:
      return { ...state, error: null }

    default:
      return state
  }
}

// ── Context ───────────────────────────────────────────────
const BookingContext = createContext(null)

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL)
  const { toast }         = useToast()
  const { isAuthenticated } = useAuth() // Import useAuth to check authentication

  // ── Load bookings on mount (only if authenticated) ───────
  useEffect(() => {
    // Don't fetch bookings if user is not authenticated
    if (!isAuthenticated) return

    let cancelled = false
    const load = async () => {
      dispatch({ type: A.FETCH_START })
      try {
        const { data } = await fetchBookings()
        if (!cancelled) dispatch({ type: A.FETCH_SUCCESS, payload: data })
      } catch (err) {
        if (!cancelled) {
          // Fall back to seed data silently — API may not be running
          dispatch({ type: A.FETCH_SUCCESS, payload: SEED })
        }
      }
    }
    load()
    return () => { cancelled = true }
  }, [isAuthenticated]) // Re-run when authentication status changes

  // ── addBooking — optimistic create ───────────────────────
  const addBooking = useCallback(async (formData) => {
    // Build a temporary optimistic booking
    const tempId = `TEMP_${Date.now()}`
    const optimistic = {
      id:         tempId,
      service:    formData.service,
      date:       formData.date,
      time:       formData.time,
      technician: 'Assigning...',
      amount:     0,
      status:     'pending',
      ...formData,
    }

    const snapshot = state.bookings
    dispatch({ type: A.OPTIMISTIC_ADD,  payload: optimistic })
    dispatch({ type: A.SUBMIT_START })

    try {
      const created = await submitBooking(formData)
      // Replace temp entry with real one from API
      dispatch({
        type: A.OPTIMISTIC_UPDATE,
        payload: { id: tempId, changes: { ...created, id: created.id || generateBookingId(snapshot.length) } },
      })
      dispatch({ type: A.SUBMIT_SUCCESS })
      toast.success('Booking confirmed! We\'ll assign a technician shortly.')
      return created
    } catch (err) {
      dispatch({ type: A.ROLLBACK, payload: snapshot })
      const msg = err?.message || 'Failed to create booking'
      dispatch({ type: A.SUBMIT_ERROR, payload: msg })
      toast.error(msg)
      throw err
    }
  }, [state.bookings])

  // ── updateStatus — optimistic update ────────────────────
  const updateStatus = useCallback(async (id, status) => {
    const snapshot = state.bookings
    dispatch({ type: A.OPTIMISTIC_UPDATE, payload: { id, changes: { status } } })
    dispatch({ type: A.SUBMIT_START })

    try {
      await apiChangeStatus(id, status)
      dispatch({ type: A.SUBMIT_SUCCESS })
      toast.success('Booking status updated.')
    } catch (err) {
      dispatch({ type: A.ROLLBACK, payload: snapshot })
      const msg = err?.message || 'Failed to update booking'
      dispatch({ type: A.SUBMIT_ERROR, payload: msg })
      toast.error(msg)
      throw err
    }
  }, [state.bookings])

  // ── cancelBooking — shorthand ────────────────────────────
  const cancelBooking = useCallback(async (id) => {
    const snapshot = state.bookings
    dispatch({ type: A.OPTIMISTIC_UPDATE, payload: { id, changes: { status: 'cancelled' } } })
    dispatch({ type: A.SUBMIT_START })

    try {
      await apiCancel(id)
      dispatch({ type: A.SUBMIT_SUCCESS })
      toast.info('Booking cancelled.')
    } catch (err) {
      dispatch({ type: A.ROLLBACK, payload: snapshot })
      const msg = err?.message || 'Failed to cancel booking'
      dispatch({ type: A.SUBMIT_ERROR, payload: msg })
      toast.error(msg)
      throw err
    }
  }, [state.bookings])

  // ── Derived stats ────────────────────────────────────────
  const getStats = useCallback(() => {
    const { bookings } = state
    const completed = bookings.filter(b => b.status === 'completed')
    return {
      total:     bookings.length,
      completed: completed.length,
      pending:   bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      spent:     `৳${completed.reduce((sum, b) => sum + (b.amount || 0), 0)}`,
    }
  }, [state.bookings]) // eslint-disable-line react-hooks/exhaustive-deps

  const clearError = useCallback(() => dispatch({ type: A.CLEAR_ERROR }), [])

  return (
    <BookingContext.Provider value={{
      bookings:     state.bookings,
      loading:      state.loading,
      submitting:   state.submitting,
      error:        state.error,
      addBooking,
      updateStatus,
      cancelBooking,
      getStats,
      clearError,
    }}>
      {children}
    </BookingContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────
export const useBooking = () => {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used inside <BookingProvider>')
  return ctx
}
