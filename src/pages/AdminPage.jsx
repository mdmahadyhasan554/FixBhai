import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'
import StatCard from '../components/common/StatCard'
import PageHeader from '../components/common/PageHeader'
import Button from '../components/ui/Button'
import { STAT_CARDS, ROUTES } from '../constants'

/**
 * AdminPage
 * Role-restricted to users with role === 'admin'.
 * Accessible at /admin — guarded by ProtectedRoute with roles={['admin']}.
 */
const AdminPage = () => {
  const { user, logout } = useAuth()
  const { bookings, getStats } = useBooking()
  const navigate = useNavigate()
  const stats = getStats()

  return (
    <div className="container py-5">
      <PageHeader
        title="Admin Dashboard"
        subtitle={`Logged in as ${user?.name} (${user?.role})`}
        action={
          <Button variant="outline-danger" size="sm" rounded icon="box-arrow-right"
            onClick={() => { logout(); navigate(ROUTES.HOME) }}>
            Sign Out
          </Button>
        }
      />

      {/* Stats */}
      <div className="row g-3 mb-5">
        {STAT_CARDS.map(card => (
          <div key={card.key} className="col-6 col-lg-3">
            <StatCard {...card} value={stats[card.key]} />
          </div>
        ))}
      </div>

      {/* Placeholder content */}
      <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
        <i className="bi bi-shield-lock text-primary mb-3" style={{ fontSize: '3rem' }} />
        <h5 className="fw-bold mb-2">Admin Panel</h5>
        <p className="text-muted mb-4">
          Full admin features — user management, analytics, and service configuration — coming soon.
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <Button variant="outline-primary" rounded onClick={() => navigate(ROUTES.SERVICES)}>
            Manage Services
          </Button>
          <Button rounded onClick={() => navigate(ROUTES.TECHNICIANS)}>
            Manage Technicians
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
