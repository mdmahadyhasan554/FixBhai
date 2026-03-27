import { AuthProvider }    from './context/AuthContext'
import { BookingProvider } from './context/BookingContext'
import ErrorBoundary       from './components/common/ErrorBoundary'
import AppRoutes           from './routes'

/**
 * App — root component.
 * Responsibilities: wrap providers, mount error boundary, delegate routing.
 * No route definitions live here — see src/routes/index.jsx.
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
