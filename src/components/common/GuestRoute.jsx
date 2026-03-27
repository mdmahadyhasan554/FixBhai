import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROUTES } from '../../constants'
import Spinner from '../ui/Spinner'

/**
 * GuestRoute
 *
 * Inverse of ProtectedRoute — only accessible when NOT authenticated.
 * Redirects logged-in users to their dashboard.
 *
 * Props:
 *   children    — the guest-only page (Login, Register)
 *   redirectTo  — where to send authenticated users (default: /dashboard)
 *
 * Use case: prevent logged-in users from seeing /login or /register.
 */
const GuestRoute = ({ children, redirectTo = ROUTES.DASHBOARD }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <Spinner overlay label="Loading..." />

  if (isAuthenticated) return <Navigate to={redirectTo} replace />

  return children
}

export default GuestRoute
