import { Link } from 'react-router-dom'
import StatCard from '../../components/common/StatCard'
import BookingTable from './BookingTable'
import EmptyState from '../../components/common/EmptyState'
import { STAT_CARDS, ROUTES } from '../../constants'

const QUICK_ACTIONS = [
  { label: 'Book a Service',   icon: 'plus-circle', to: ROUTES.BOOKING,     color: '#dbeafe', iconColor: '#2563eb' },
  { label: 'Browse Services',  icon: 'tools',       to: ROUTES.SERVICES,    color: '#d1fae5', iconColor: '#059669' },
  { label: 'Find Technicians', icon: 'people',      to: ROUTES.TECHNICIANS, color: '#fef3c7', iconColor: '#d97706' },
]

const OverviewTab = ({ user, stats, bookings, onViewAll, onCancel }) => (
  <>
    <p className="text-muted mb-4">Welcome back, <strong>{user.name}</strong> 👋</p>

    {/* Stats */}
    <div className="row g-3 mb-4">
      {STAT_CARDS.map(card => (
        <div key={card.key} className="col-6 col-lg-3">
          <StatCard {...card} value={stats[card.key]} />
        </div>
      ))}
    </div>

    {/* Recent bookings */}
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0">Recent Bookings</h6>
          <button className="btn btn-sm btn-outline-primary rounded-pill" onClick={onViewAll}>
            View All
          </button>
        </div>
        {bookings.length === 0
          ? <EmptyState icon="calendar-x" title="No bookings yet"
              action={<Link to={ROUTES.BOOKING} className="btn btn-primary btn-sm rounded-pill">Book a Service</Link>} />
          : <BookingTable bookings={bookings.slice(0, 3)} onCancel={onCancel} />
        }
      </div>
    </div>

    {/* Quick actions */}
    <div className="row g-3">
      {QUICK_ACTIONS.map(a => (
        <div key={a.label} className="col-md-4">
          <Link to={a.to} className="text-decoration-none">
            <div className="card border-0 shadow-sm rounded-4 p-3 d-flex flex-row align-items-center gap-3"
              style={{ transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}>
              <div className="rounded-3 p-3" style={{ background: a.color }}>
                <i className={`bi bi-${a.icon} fs-5`} style={{ color: a.iconColor }} />
              </div>
              <span className="fw-semibold text-dark">{a.label}</span>
              <i className="bi bi-arrow-right ms-auto text-muted" />
            </div>
          </Link>
        </div>
      ))}
    </div>
  </>
)

export default OverviewTab
