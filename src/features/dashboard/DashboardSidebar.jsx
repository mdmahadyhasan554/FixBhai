import { Link } from 'react-router-dom'
import { DASHBOARD_NAV, ROUTES } from '../../constants'

const DashboardSidebar = ({ activeTab, onTabChange, onLogout }) => (
  <div className="sidebar d-none d-lg-flex flex-column" style={{ width: 240, flexShrink: 0 }}>
    <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <Link to={ROUTES.HOME} className="text-decoration-none">
        <span className="fw-bold fs-5 text-white">
          <i className="bi bi-tools text-warning me-2" />FixBhai
        </span>
      </Link>
    </div>

    <nav className="flex-grow-1 py-3">
      {DASHBOARD_NAV.map(item => (
        <button key={item.key}
          className={`nav-link w-100 text-start d-flex align-items-center gap-2 ${activeTab === item.key ? 'active' : ''}`}
          onClick={() => onTabChange(item.key)}>
          <i className={`bi bi-${item.icon}`} />{item.label}
        </button>
      ))}

      <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} className="mx-3" />

      {[
        { to: ROUTES.BOOKING,     icon: 'plus-circle', label: 'New Booking'  },
        { to: ROUTES.SERVICES,    icon: 'tools',       label: 'Services'     },
        { to: ROUTES.TECHNICIANS, icon: 'people',      label: 'Technicians'  },
      ].map(({ to, icon, label }) => (
        <Link key={to} to={to} className="nav-link d-flex align-items-center gap-2">
          <i className={`bi bi-${icon}`} />{label}
        </Link>
      ))}
    </nav>

    <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <button className="nav-link w-100 text-start d-flex align-items-center gap-2"
        style={{ color: '#fca5a5' }} onClick={onLogout}>
        <i className="bi bi-box-arrow-right" />Logout
      </button>
    </div>
  </div>
)

export default DashboardSidebar
