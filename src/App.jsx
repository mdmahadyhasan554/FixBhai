import { AuthProvider }    from './context/AuthContext'
import { BookingProvider } from './context/BookingContext'
import { ToastProvider }   from './context/ToastContext'
import ErrorBoundary       from './components/common/ErrorBoundary'
import AppRoutes           from './routes'

/**
 * App — root component.
 *
 * Provider order:
 *   ErrorBoundary  — outermost crash handler
 *   ToastProvider  — global notifications (used by contexts + components)
 *   AuthProvider   — JWT token + user state
 *   BookingProvider — booking list + mutations
 *   AppRoutes      — all route definitions
 */
function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <BookingProvider>
            <AppRoutes />
          </BookingProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
