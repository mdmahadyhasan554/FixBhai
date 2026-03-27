import UserAvatar from '../../components/common/UserAvatar'

/**
 * ProfileTab — customer profile view inside the dashboard.
 *
 * Props:
 *   user     — { name, email, role }
 *   stats    — { total, completed, pending }
 *   onLogout — logout handler
 */

// Profile fields driven by data — adding a field is a one-line change
const getProfileFields = (user) => [
  { label: 'Full Name',    value: user.name,    icon: 'person'       },
  { label: 'Email',        value: user.email,   icon: 'envelope'     },
  { label: 'Role',         value: user.role || 'Customer', icon: 'shield-check' },
  { label: 'Member Since', value: 'March 2025', icon: 'calendar'     },
]

const ProfileTab = ({ user, stats, onLogout }) => (
  <div className="row g-4">
    {/* ── Avatar card ── */}
    <div className="col-lg-4">
      <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
        <UserAvatar name={user.name} size={80} className="mx-auto" />
        <h5 className="fw-bold mb-1 mt-3">{user.name}</h5>
        <p className="text-muted small mb-3">{user.email}</p>
        <span className="badge bg-primary rounded-pill px-3 py-2 text-capitalize">
          {user.role || 'Customer'}
        </span>
        <div className="mt-4 d-flex justify-content-center gap-4">
          <StatPill label="Bookings"  value={stats.total}     />
          <StatPill label="Completed" value={stats.completed} />
          <StatPill label="Pending"   value={stats.pending}   />
        </div>
      </div>
    </div>

    {/* ── Details card ── */}
    <div className="col-lg-8">
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h6 className="fw-bold mb-4">Account Details</h6>
        <div className="row g-3">
          {getProfileFields(user).map(f => (
            <div key={f.label} className="col-md-6">
              <label className="form-label small text-muted">{f.label}</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className={`bi bi-${f.icon} text-muted`} aria-hidden="true" />
                </span>
                <input
                  className="form-control bg-light border-start-0"
                  value={f.value || ''}
                  readOnly
                  aria-label={f.label}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 d-flex flex-wrap gap-2">
          <button className="btn btn-outline-primary btn-sm rounded-pill px-4">
            <i className="bi bi-pencil me-1" aria-hidden="true" />Edit Profile
          </button>
          <button className="btn btn-outline-danger btn-sm rounded-pill px-4" onClick={onLogout}>
            <i className="bi bi-box-arrow-right me-1" aria-hidden="true" />Sign Out
          </button>
        </div>
      </div>
    </div>
  </div>
)

// ── StatPill — mini stat display used in the avatar card ─
const StatPill = ({ label, value }) => (
  <div className="text-center">
    <div className="fw-bold text-primary">{value}</div>
    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{label}</div>
  </div>
)

export default ProfileTab
