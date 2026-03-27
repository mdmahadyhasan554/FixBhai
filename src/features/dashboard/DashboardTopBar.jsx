import { DASHBOARD_NAV } from '../../constants'

/**
 * DashboardTopBar
 *
 * Sticky top bar for the dashboard layout.
 * Shows current tab title, mobile tab switcher, and user avatar.
 *
 * Props:
 *   activeTab   — current tab key
 *   onTabChange — called with new tab key
 *   user        — { name }
 */
const DashboardTopBar = ({ activeTab, onTabChange, user }) => {
  const currentNav = DASHBOARD_NAV.find(n => n.key === activeTab)

  return (
    <div
      className="bg-white border-bottom px-4 py-3 d-flex align-items-center justify-content-between sticky-top"
      style={{ zIndex: 100 }}
    >
      {/* Page title */}
      <h5 className="fw-bold mb-0">{currentNav?.label}</h5>

      <div className="d-flex align-items-center gap-3">
        {/* Mobile tab switcher */}
        <div className="d-flex d-lg-none gap-1" role="tablist" aria-label="Dashboard navigation">
          {DASHBOARD_NAV.map(item => (
            <button
              key={item.key}
              role="tab"
              aria-selected={activeTab === item.key}
              aria-label={item.label}
              className={`btn btn-sm rounded-pill ${
                activeTab === item.key ? 'btn-primary' : 'btn-outline-secondary'
              }`}
              onClick={() => onTabChange(item.key)}
            >
              <i className={`bi bi-${item.icon}`} aria-hidden="true" />
            </button>
          ))}
        </div>

        {/* User avatar + name */}
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
            style={{ width: 36, height: 36, fontSize: '0.9rem' }}
            aria-hidden="true"
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="fw-semibold d-none d-md-inline">{user?.name}</span>
        </div>
      </div>
    </div>
  )
}

export default DashboardTopBar
