import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROUTES } from '../../constants'

/**
 * Wraps a route that requires authentication.
 * Redirects to /login if the user is not authenticated.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} replace />
}

export default ProtectedRoute
