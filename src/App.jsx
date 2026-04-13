import { AuthProvider }    from './context/AuthContext'
import { ToastProvider }   from './context/ToastContext'
import ErrorBoundary       from './components/common/ErrorBoundary'
import AppRoutes           from './routes'

/**
 * App — root component.
 *
 * Provider order:
 *   ErrorBoundary  — outermost crash handler
 *   ToastProvider  — global notifications (used by contexts + components)
 *   AuthProvider   — session-based authentication
 *   AppRoutes      — all route definitions
 * 
 * Note: BookingProvider is now scoped to specific routes that need it,
 * not globally. This prevents unnecessary API calls on public pages.
 */
function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
