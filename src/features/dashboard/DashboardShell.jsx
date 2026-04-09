import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'
import UserAvatar from '../../components/common/UserAvatar'
import { logo } from '../../assets'

// Sidebar width — defined once, used in both sidebar and main offset
const SIDEBAR_W = 248

/**
 * DashboardShell
 *
 * Reusable full-screen dashboard layout used by all three dashboards.
 * Renders: sidebar + top bar + content area.
 *
 * Props:
 *   navItems    — array of { key, icon, label }
 *   activeTab   — current tab key
 *   onTabChange — called with new tab key
 *   onLogout    — logout handler
 *   user        — { name, email, role }
 *   title       — top bar title (defaults to active nav label)
 *   accentColor — sidebar accent (default: '#2563eb')
 *   children    — tab content
 */
const DashboardShell = ({
  navItems    = [],
  activeTab,
  onTabChange,
  onLogout,
  user,
  title,
  accentColor = '#2563eb',
  children,
}) => {
  const currentLabel = navItems.find(n => n.key === activeTab)?.label || title || 'Dashboard'

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* ── Sidebar ── */}
      <aside
        className="d-none d-lg-flex flex-column"
        style={{ width: SIDEBAR_W, flexShrink: 0, background: '#0f172a' }}
        aria-label="Dashboard navigation"
      >
        {/* Brand */}
        <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link to={ROUTES.HOME} className="text-decoration-none d-block mb-1">
            <img
              src={logo}
              alt="FixBhai"
              style={{ height: 36, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
            />
          </Link>
          {user && (
            <div className="mt-3 d-flex align-items-center gap-2">
              <UserAvatar name={user.name} avatarUrl={user.avatar_url} size={32} />
              <div className="min-w-0">
                <div className="text-white fw-semibold small text-truncate">{user.name}</div>
                <div className="text-truncate" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem' }}>
                  {user.role}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-grow-1 py-3 overflow-auto" role="navigation">
          {navItems.map(item => (
            <SidebarItem
              key={item.key}
              item={item}
              active={activeTab === item.key}
              accentColor={accentColor}
              onClick={() => onTabChange(item.key)}
            />
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            className="w-100 d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0 text-start"
            style={{ background: 'transparent', color: '#fca5a5', fontSize: '0.875rem' }}
            onClick={onLogout}
          >
            <i className="bi bi-box-arrow-right" aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">

        {/* Top bar */}
        <header
          className="bg-white border-bottom px-4 py-3 d-flex align-items-center justify-content-between sticky-top"
          style={{ zIndex: 100 }}
        >
          <h5 className="fw-bold mb-0">{currentLabel}</h5>

          <div className="d-flex align-items-center gap-3">
            {/* Mobile nav */}
            <div className="d-flex d-lg-none gap-1" role="tablist">
              {navItems.slice(0, 4).map(item => (
                <button key={item.key} role="tab"
                  aria-selected={activeTab === item.key}
                  aria-label={item.label}
                  className={`btn btn-sm rounded-pill ${activeTab === item.key ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => onTabChange(item.key)}>
                  <i className={`bi bi-${item.icon}`} aria-hidden="true" />
                </button>
              ))}
            </div>

            {/* Notifications */}
            <button className="btn btn-sm btn-outline-secondary rounded-circle position-relative"
              style={{ width: 36, height: 36 }} aria-label="Notifications">
              <i className="bi bi-bell" />
              <span className="position-absolute top-0 end-0 badge rounded-circle bg-danger"
                style={{ width: 10, height: 10, padding: 0 }} />
            </button>

            {/* Avatar */}
            <div className="d-flex align-items-center gap-2">
              <UserAvatar name={user?.name} avatarUrl={user?.avatar_url} size={36} bg={accentColor} />
              <span className="fw-semibold small d-none d-md-inline">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-grow-1 overflow-auto p-4" id="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  )
}

// ── SidebarItem ───────────────────────────────────────────

const SidebarItem = ({ item, active, accentColor, onClick }) => (
  <button
    className="w-100 d-flex align-items-center gap-3 px-4 py-2 border-0 text-start"
    style={{
      background: active ? `${accentColor}22` : 'transparent',
      color: active ? '#fff' : 'rgba(255,255,255,0.55)',
      borderLeft: active ? `3px solid ${accentColor}` : '3px solid transparent',
      fontSize: '0.875rem',
      transition: 'all 0.15s',
    }}
    onClick={onClick}
    aria-current={active ? 'page' : undefined}
  >
    <i className={`bi bi-${item.icon}`} style={{ fontSize: '1rem', width: 18 }} aria-hidden="true" />
    {item.label}
  </button>
)

export { UserAvatar }
export default DashboardShell
