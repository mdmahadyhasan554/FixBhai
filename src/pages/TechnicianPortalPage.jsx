import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/common/PageHeader'
import Button from '../components/ui/Button'
import { ROUTES } from '../constants'

/**
 * TechnicianPortalPage
 * Role-restricted to users with role === 'technician'.
 * Accessible at /technician — guarded by ProtectedRoute with roles={['technician']}.
 */
const TechnicianPortalPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="container py-5">
      <PageHeader
        title="Technician Portal"
        subtitle={`Welcome, ${user?.name}`}
        action={
          <Button variant="outline-danger" size="sm" rounded icon="box-arrow-right"
            onClick={() => { logout(); navigate(ROUTES.HOME) }}>
            Sign Out
          </Button>
        }
      />

      <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
        <i className="bi bi-tools text-primary mb-3" style={{ fontSize: '3rem' }} />
        <h5 className="fw-bold mb-2">Technician Dashboard</h5>
        <p className="text-muted mb-4">
          View assigned jobs, update availability, and manage your schedule — coming soon.
        </p>
        <Button rounded onClick={() => navigate(ROUTES.HOME)}>
          Back to Home
        </Button>
      </div>
    </div>
  )
}

export default TechnicianPortalPage
