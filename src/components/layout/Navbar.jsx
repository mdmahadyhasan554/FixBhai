import { useState, useEffect, useRef, forwardRef } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { NAV_LINKS, ROUTES } from '../../constants'

/**
 * Navbar
 *
 * - Sticky top, white background, subtle shadow
 * - Pure React mobile menu toggle — no Bootstrap JS required
 * - Mobile menu auto-closes on route change
 * - User dropdown closes on outside click and Escape key
 * - Active link highlighting via NavLink
 */
const Navbar = () => {
  const { user, logout }        = useAuth()
  const navigate                = useNavigate()
  const location                = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef                 = useRef(null)

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const onMouse = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
    }
    const onKey = (e) => { if (e.key === 'Escape') setDropOpen(false) }
    document.addEventListener('mousedown', onMouse)
    document.addEventListener('keydown',   onKey)
    return () => {
      document.removeEventListener('mousedown', onMouse)
      document.removeEventListener('keydown',   onKey)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setDropOpen(false)
    navigate(ROUTES.HOME)
  }

  return (
    <nav
      className="navbar navbar-light bg-white sticky-top"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)', zIndex: 1030 }}
      aria-label="Main navigation"
    >
      <div className="container">

        {/* Brand */}
        <Link
          className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-1 text-decoration-none"
          to={ROUTES.HOME}
        >
          <i className="bi bi-tools text-primary" aria-hidden="true" />
          <span className="text-dark">Fix<span style={{ color: '#f59e0b' }}>Bhai</span></span>
        </Link>

        {/* Desktop nav links */}
        <ul className="navbar-nav d-none d-lg-flex flex-row mx-auto gap-1 mb-0" role="list">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to} className="nav-item" role="listitem">
              <NavLink
                to={to}
                end={to === ROUTES.HOME}
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded-3 fw-medium ${
                    isActive ? 'text-primary bg-primary bg-opacity-10' : 'text-secondary'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop auth */}
        <div className="d-none d-lg-flex align-items-center gap-2">
          {user
            ? <UserDropdown
                ref={dropRef}
                user={user}
                open={dropOpen}
                onToggle={() => setDropOpen(p => !p)}
                onLogout={handleLogout}
              />
            : <AuthButtons />
          }
        </div>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler border-0 d-lg-none p-1"
          type="button"
          onClick={() => setMenuOpen(p => !p)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <i className={`bi bi-${menuOpen ? 'x-lg' : 'list'} fs-4`} aria-hidden="true" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && <MobileMenu user={user} onLogout={handleLogout} />}
    </nav>
  )
}

// ── UserDropdown ──────────────────────────────────────────

const UserDropdown = forwardRef(function UserDropdown({ user, open, onToggle, onLogout }, ref) {
  return (
    <div className="position-relative" ref={ref}>
      <button
        className="btn btn-outline-primary rounded-pill d-flex align-items-center gap-2 py-1 px-3"
        onClick={onToggle}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <UserAvatar name={user.name} size={26} fontSize="0.75rem" />
        <span className="d-none d-xl-inline fw-medium" style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.name}
        </span>
        <i className={`bi bi-chevron-${open ? 'up' : 'down'}`} style={{ fontSize: '0.65rem' }} aria-hidden="true" />
      </button>

      {open && (
        <ul
          className="dropdown-menu show rounded-4 border-0 shadow-lg py-2 mt-2"
          style={{ right: 0, left: 'auto', minWidth: 210, position: 'absolute' }}
          role="menu"
        >
          {/* User info header */}
          <li className="px-3 pb-2 mb-1" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <div className="fw-semibold small text-dark">{user.name}</div>
            <div className="text-muted" style={{ fontSize: '0.72rem' }}>{user.email}</div>
          </li>

          <DropdownItem to={ROUTES.DASHBOARD} icon="grid"        iconColor="text-primary" label="Dashboard"   />
          <DropdownItem to={ROUTES.BOOKING}   icon="plus-circle" iconColor="text-success" label="New Booking" />

          <li><hr className="dropdown-divider my-1" /></li>

          <li role="menuitem">
            <button
              className="dropdown-item rounded-3 mx-1 d-flex align-items-center gap-2 text-danger"
              style={{ width: 'calc(100% - 8px)' }}
              onClick={onLogout}
            >
              <i className="bi bi-box-arrow-right" aria-hidden="true" />Sign Out
            </button>
          </li>
        </ul>
      )}
    </div>
  )
})

// ── AuthButtons ───────────────────────────────────────────

const AuthButtons = () => (
  <>
    <Link to={ROUTES.LOGIN}    className="btn btn-outline-primary rounded-pill px-4">Login</Link>
    <Link to={ROUTES.REGISTER} className="btn btn-primary rounded-pill px-4">Sign Up</Link>
  </>
)

// ── MobileMenu ────────────────────────────────────────────

const MobileMenu = ({ user, onLogout }) => (
  <div className="border-top bg-white w-100" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
    <div className="container py-3">

      {/* Nav links */}
      <ul className="list-unstyled mb-3" role="list">
        {NAV_LINKS.map(({ to, label }) => (
          <li key={to} role="listitem">
            <NavLink
              to={to}
              end={to === ROUTES.HOME}
              className={({ isActive }) =>
                `d-block px-3 py-2 rounded-3 fw-medium text-decoration-none mb-1 ${
                  isActive ? 'text-primary bg-primary bg-opacity-10' : 'text-secondary'
                }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Auth section */}
      <div style={{ borderTop: '1px solid #f1f5f9' }} className="pt-3">
        {user ? (
          <>
            <div className="d-flex align-items-center gap-2 px-2 py-2 rounded-3 bg-light mb-2">
              <UserAvatar name={user.name} size={34} fontSize="0.9rem" />
              <div>
                <div className="fw-semibold small">{user.name}</div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>{user.email}</div>
              </div>
            </div>
            <Link
              to={ROUTES.DASHBOARD}
              className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-decoration-none text-secondary mb-1"
            >
              <i className="bi bi-grid text-primary" aria-hidden="true" />Dashboard
            </Link>
            <button
              className="btn btn-outline-danger btn-sm rounded-pill w-100 mt-2"
              onClick={onLogout}
            >
              <i className="bi bi-box-arrow-right me-2" aria-hidden="true" />Sign Out
            </button>
          </>
        ) : (
          <div className="d-flex gap-2">
            <Link to={ROUTES.LOGIN}    className="btn btn-outline-primary rounded-pill flex-grow-1">Login</Link>
            <Link to={ROUTES.REGISTER} className="btn btn-primary rounded-pill flex-grow-1">Sign Up</Link>
          </div>
        )}
      </div>
    </div>
  </div>
)

// ── Shared micro-components ───────────────────────────────

const UserAvatar = ({ name, size, fontSize }) => (
  <span
    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
    style={{ width: size, height: size, fontSize }}
    aria-hidden="true"
  >
    {name?.charAt(0).toUpperCase()}
  </span>
)

const DropdownItem = ({ to, icon, iconColor, label }) => (
  <li role="menuitem">
    <Link
      className="dropdown-item rounded-3 mx-1 d-flex align-items-center gap-2"
      style={{ width: 'calc(100% - 8px)' }}
      to={to}
    >
      <i className={`bi bi-${icon} ${iconColor}`} aria-hidden="true" />{label}
    </Link>
  </li>
)

export default Navbar
