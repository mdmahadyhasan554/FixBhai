import { Link } from 'react-router-dom'
import StatGrid from './StatGrid'
import ActivityFeed from './ActivityFeed'
import BookingList from '../bookings/BookingList'
import { STAT_CARDS, ROUTES } from '../../constants'
import { STATUS_MAP } from '../../constants'

const QUICK_ACTIONS = [
  { label: 'Book a Service',   icon: 'plus-circle', to: ROUTES.BOOKING,     bg: '#dbeafe', color: '#2563eb' },
  { label: 'Browse Services',  icon: 'tools',       to: ROUTES.SERVICES,    bg: '#d1fae5', color: '#059669' },
  { label: 'Find Technicians', icon: 'people',      to: ROUTES.TECHNICIANS, bg: '#fef3c7', color: '#d97706' },
]

const OverviewTab = ({ user, stats, bookings, onViewAll, onCancel }) => {
  // Build activity feed from recent bookings
  const activity = bookings.slice(0, 5).map(b => ({
    id:         b.id,
    icon:       STATUS_MAP[b.status]?.type === 'success' ? 'patch-check' : 'calendar-check',
    iconBg:     STATUS_MAP[b.status]?.type === 'success' ? '#d1fae5' : '#dbeafe',
    iconColor:  STATUS_MAP[b.status]?.type === 'success' ? '#059669' : '#2563eb',
    title:      b.service,
    subtitle:   `${b.technician} · ${b.time}`,
    time:       b.date,
    badge:      STATUS_MAP[b.status] ? { type: STATUS_MAP[b.status].type, label: STATUS_MAP[b.status].label } : null,
  }))

  return (
    <>
      {/* Greeting */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h6 className="fw-bold mb-1">Good day, {user.name} 👋</h6>
          <p className="text-muted small mb-0">Here's what's happening with your bookings</p>
        </div>
        <Link to={ROUTES.BOOKING} className="btn btn-primary btn-sm rounded-pill px-4">
          <i className="bi bi-plus me-1" />New Booking
        </Link>
      </div>

      {/* Stats */}
      <StatGrid cards={STAT_CARDS} stats={stats} />

      <div className="row g-4">
        {/* Recent bookings */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Recent Bookings</h6>
                <button className="btn btn-sm btn-outline-primary rounded-pill" onClick={onViewAll}>
                  View All
                </button>
              </div>
              <BookingList bookings={bookings.slice(0, 3)} onCancel={onCancel} compact showFilter={false} />
            </div>
          </div>
        </div>

        {/* Activity feed */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Activity</h6>
              <ActivityFeed items={activity} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="row g-3 mt-2">
        {QUICK_ACTIONS.map(a => (
          <div key={a.label} className="col-md-4">
            <Link to={a.to} className="text-decoration-none">
              <div className="card border-0 shadow-sm rounded-4 p-3 d-flex flex-row align-items-center gap-3 card-hoverable">
                <div className="rounded-3 p-3 flex-shrink-0" style={{ background: a.bg }}>
                  <i className={`bi bi-${a.icon} fs-5`} style={{ color: a.color }} aria-hidden="true" />
                </div>
                <span className="fw-semibold text-dark small">{a.label}</span>
                <i className="bi bi-arrow-right ms-auto text-muted" aria-hidden="true" />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}

export default OverviewTab
