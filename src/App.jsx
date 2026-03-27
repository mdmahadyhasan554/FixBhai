import { AuthProvider }    from './context/AuthContext'
import { BookingProvider } from './context/BookingContext'
import ErrorBoundary       from './components/common/ErrorBoundary'
import AppRoutes           from './routes'

/**
 * App — root component.
 *
 * Provider order matters:
 *   ErrorBoundary  — outermost, catches any render crash
 *   AuthProvider   — must wrap BookingProvider (booking context reads auth state)
 *   BookingProvider — loads bookings on mount, needs auth token
 *   AppRoutes      — all route definitions, uses both contexts
 *
 * BrowserRouter lives in main.jsx so it wraps everything including App.
 */
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BookingProvider>
          <AppRoutes />
        </BookingProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
