import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'
import Badge from '../components/ui/Badge'

const STATUS_MAP = {
  confirmed: { type: 'info', label: 'Confirmed' },
  completed: { type: 'success', label: 'Completed' },
  pending: { type: 'warning', label: 'Pending' },
  cancelled: { type: 'danger', label: 'Cancelled' },
}

const STAT_CARDS = [
  { label: 'Total Bookings', icon: 'calendar-check', gradient: 'linear-gradient(135deg,#2563eb,#3b82f6)', key: 'total' },
  { label: 'Completed', icon: 'patch-check', gradient: 'linear-gradient(135deg,#059669,#10b981)', key: 'completed' },
  { label: 'Pending', icon: 'clock', gradient: 'linear-gradient(135deg,#d97706,#f59e0b)', key: 'pending' },
  { label: 'Total Spent', icon: 'wallet2', gradient: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', key: 'spent' },
]

const NAV_ITEMS = [
  { key: 'overview', icon: 'grid', label: 'Overview' },
  { key: 'bookings', icon: 'calendar-check', label: 'My Bookings' },
  { key: 'profile', icon: 'person-circle', label: 'Profile' },
]

const BookingTable = ({ bookings, updateStatus }) => (
  <div className="table-responsive">
    <table className="table table-hover align-middle mb-0">
      <thead className="table-light">
        <tr>
          <th className="border-0">ID</th>
          <th className="border-0">Service</th>
          <th className="border-0 d-none d-md-table-cell">Technician</th>
          <th className="border-0 d-none d-md-table-cell">Date</th>
          <th className="border-0">Amount</th>
          <th className="border-0">Status</th>
          <th className="border-0">Action</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map(b => {
          const s = STATUS_MAP[b.status] || { type: 'info', label: b.status }
          return (
            <tr key={b.id}>
              <td><span className="text-muted small">{b.id}</span></td>
              <td><span className="fw-semibold">{b.service}</span></td>
              <td className="d-none d-md-table-cell text-muted small">{b.technician}</td>
              <td className="d-none d-md-table-cell text-muted small">{b.date} {b.time}</td>
              <td className="fw-semibold text-primary">₹{b.amount}</td>
              <td><Badge type={s.type}>{s.label}</Badge></td>
              <td>
                {b.status === 'pending' && (
                  <button className="btn btn-sm btn-outline-danger rounded-pill"
                    onClick={() => updateStatus(b.id, 'cancelled')}>Cancel</button>
                )}
                {b.status === 'confirmed' && (
                  <span className="text-muted small">Scheduled</span>
                )}
                {b.status === 'completed' && (
                  <button className="btn btn-sm btn-outline-warning rounded-pill">
                    <i className="bi bi-star me-1" />Rate
                  </button>
                )}
                {b.status === 'cancelled' && (
                  <span className="text-muted small">—</span>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)

const DashboardPage = () => {
  const { user, logout } = useAuth()
  const { bookings, updateStatus } = useBooking()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  if (!user) { navigate('/login'); return null }

  const stats = {
    total: bookings.length,
    completed: bookings.filter(b => b.status === 'completed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    spent: '₹' + bookings.filter(b => b.status === 'completed').reduce((s, b) => s + b.amount, 0),
  }

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* Sidebar — desktop only */}
      <div className="sidebar d-none d-lg-flex flex-column" style={{ width: 240, flexShrink: 0 }}>
        <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Link to="/" className="text-decoration-none">
            <span className="fw-bold fs-5 text-white">
              <i className="bi bi-tools text-warning me-2" />FixBhai
            </span>
          </Link>
        </div>
        <nav className="flex-grow-1 py-3">
          {NAV_ITEMS.map(item => (
            <button key={item.key}
              className={`nav-link w-100 text-start d-flex align-items-center gap-2 ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => setActiveTab(item.key)}>
              <i className={`bi bi-${item.icon}`} />{item.label}
            </button>
          ))}
          <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} className="mx-3" />
          <Link to="/booking" className="nav-link d-flex align-items-center gap-2">
            <i className="bi bi-plus-circle" />New Booking
          </Link>
          <Link to="/services" className="nav-link d-flex align-items-center gap-2">
            <i className="bi bi-tools" />Services
          </Link>
          <Link to="/technicians" className="nav-link d-flex align-items-center gap-2">
            <i className="bi bi-people" />Technicians
          </Link>
        </nav>
        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button className="nav-link w-100 text-start d-flex align-items-center gap-2"
            style={{ color: '#fca5a5' }} onClick={handleLogout}>
            <i className="bi bi-box-arrow-right" />Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-grow-1 overflow-auto">

        {/* Top bar */}
        <div className="bg-white border-bottom px-4 py-3 d-flex align-items-center justify-content-between sticky-top">
          <h5 className="fw-bold mb-0">
            {NAV_ITEMS.find(n => n.key === activeTab)?.label || 'Dashboard'}
          </h5>
          <div className="d-flex align-items-center gap-3">
            {/* Mobile tab switcher */}
            <div className="d-flex d-lg-none gap-1">
              {NAV_ITEMS.map(item => (
                <button key={item.key}
                  className={`btn btn-sm rounded-pill ${activeTab === item.key ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setActiveTab(item.key)}>
                  <i className={`bi bi-${item.icon}`} />
                </button>
              ))}
            </div>
            <div className="d-flex align-items-center gap-2">
              <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
                style={{ width: 36, height: 36, fontSize: '0.9rem' }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="fw-semibold d-none d-md-inline">{user.name}</span>
            </div>
          </div>
        </div>

        <div className="p-4">

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <>
              <p className="text-muted mb-4">Welcome back, <strong>{user.name}</strong> 👋</p>

              {/* Stats */}
              <div className="row g-3 mb-4">
                {STAT_CARDS.map(card => (
                  <div key={card.key} className="col-6 col-lg-3">
                    <div className="stat-card" style={{ background: card.gradient }}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="small mb-1" style={{ opacity: 0.85 }}>{card.label}</div>
                          <div className="fw-bold fs-3">{stats[card.key]}</div>
                        </div>
                        <div className="rounded-3 p-2" style={{ background: 'rgba(255,255,255,0.2)' }}>
                          <i className={`bi bi-${card.icon} fs-5`} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent bookings */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold mb-0">Recent Bookings</h6>
                    <button className="btn btn-sm btn-outline-primary rounded-pill"
                      onClick={() => setActiveTab('bookings')}>View All</button>
                  </div>
                  {bookings.length === 0
                    ? <p className="text-muted small mb-0">No bookings yet. <Link to="/booking">Book a service</Link></p>
                    : <BookingTable bookings={bookings.slice(0, 3)} updateStatus={updateStatus} />
                  }
                </div>
              </div>

              {/* Quick actions */}
              <div className="row g-3">
                {[
                  { label: 'Book a Service', icon: 'plus-circle', to: '/booking', color: '#dbeafe', iconColor: '#2563eb' },
                  { label: 'Browse Services', icon: 'tools', to: '/services', color: '#d1fae5', iconColor: '#059669' },
                  { label: 'Find Technicians', icon: 'people', to: '/technicians', color: '#fef3c7', iconColor: '#d97706' },
                ].map(a => (
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
          )}

          {/* ── BOOKINGS ── */}
          {activeTab === 'bookings' && (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6 className="fw-bold mb-0">All Bookings ({bookings.length})</h6>
                  <Link to="/booking" className="btn btn-primary btn-sm rounded-pill px-4">
                    <i className="bi bi-plus me-1" />New Booking
                  </Link>
                </div>
                {bookings.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-calendar-x fs-1 d-block mb-2" />
                    No bookings yet. <Link to="/booking">Book your first service</Link>
                  </div>
                ) : (
                  <BookingTable bookings={bookings} updateStatus={updateStatus} />
                )}
              </div>
            </div>
          )}

          {/* ── PROFILE ── */}
          {activeTab === 'profile' && (
            <div className="row g-4">
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
                  <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold mx-auto mb-3"
                    style={{ width: 80, height: 80, fontSize: '2rem' }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <h5 className="fw-bold mb-1">{user.name}</h5>
                  <p className="text-muted small mb-3">{user.email}</p>
                  <span className="badge bg-primary rounded-pill px-3 py-2">Customer</span>
                  <div className="mt-4 d-flex justify-content-center gap-3 text-center">
                    <div>
                      <div className="fw-bold text-primary">{bookings.length}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>Bookings</div>
                    </div>
                    <div>
                      <div className="fw-bold text-success">{stats.completed}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>Completed</div>
                    </div>
                    <div>
                      <div className="fw-bold text-warning">{stats.pending}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>Pending</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm rounded-4 p-4">
                  <h6 className="fw-bold mb-4">Account Details</h6>
                  <div className="row g-3">
                    {[
                      { label: 'Full Name', value: user.name, icon: 'person' },
                      { label: 'Email', value: user.email, icon: 'envelope' },
                      { label: 'Role', value: 'Customer', icon: 'shield-check' },
                      { label: 'Member Since', value: 'March 2025', icon: 'calendar' },
                    ].map(f => (
                      <div key={f.label} className="col-md-6">
                        <label className="form-label small text-muted">{f.label}</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className={`bi bi-${f.icon} text-muted`} />
                          </span>
                          <input className="form-control bg-light border-start-0" value={f.value || ''} readOnly />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 d-flex gap-2">
                    <button className="btn btn-outline-primary btn-sm rounded-pill px-4">
                      <i className="bi bi-pencil me-1" />Edit Profile
                    </button>
                    <button className="btn btn-outline-danger btn-sm rounded-pill px-4" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-1" />Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default DashboardPage
