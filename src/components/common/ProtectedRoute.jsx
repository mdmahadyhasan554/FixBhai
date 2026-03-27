import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROUTES } from '../../constants'
import Spinner from '../ui/Spinner'

/**
 * ProtectedRoute
 *
 * Guards a route behind authentication and optional role check.
 *
 * Props:
 *   children      — the protected page component
 *   roles         — array of allowed roles e.g. ['admin', 'customer']
 *                   if omitted, any authenticated user is allowed
 *   redirectTo    — where to send unauthenticated users (default: /login)
 *   fallback      — where to send authenticated users with wrong role (default: /dashboard)
 *
 * Behaviour:
 *   - Not authenticated → redirect to /login, preserving current location in state
 *     so LoginForm can redirect back after login
 *   - Authenticated but wrong role → redirect to fallback
 *   - Auth still loading → show spinner
 */
const ProtectedRoute = ({
  children,
  roles      = [],
  redirectTo = ROUTES.LOGIN,
  fallback   = ROUTES.DASHBOARD,
}) => {
  const { isAuthenticated, user, loading } = useAuth()
  const location = useLocation()

  // Auth state is being initialised (e.g. token validation in progress)
  if (loading) return <Spinner overlay label="Checking authentication..." />

  // Not logged in — send to login, remember where they were trying to go
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location }}
        replace
      />
    )
  }

  // Role check — if roles array is provided, user must have one of them
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to={fallback} replace />
  }

  return children
}

export default ProtectedRoute
