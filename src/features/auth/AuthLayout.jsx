import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { logo } from '../../assets'

/**
 * AuthLayout
 *
 * Shared card shell for LoginForm and RegisterForm.
 * Keeps both forms DRY — brand header, card wrapper, footer link.
 *
 * Props:
 *   icon       — bootstrap-icons name for the header icon
 *   title      — heading text
 *   subtitle   — subheading text
 *   footerText — text before the link
 *   footerLink — { to, label }
 *   error      — API-level error string (shown as alert)
 *   children   — the form body
 */
const AuthLayout = ({ icon, title, subtitle, footerText, footerLink, error, children }) => (
  <div className="auth-card shadow-sm p-4 p-md-5">

    {/* Brand header — logo + title */}
    <div className="text-center mb-4">
      <Link to={ROUTES.HOME} className="text-decoration-none d-inline-block mb-3">
        <img
          src={logo}
          alt="FixBhai"
          style={{ height: 52, width: 'auto', objectFit: 'contain' }}
        />
      </Link>
      <h4 className="fw-bold mb-1">{title}</h4>
      <p className="text-muted small mb-0">{subtitle}</p>
    </div>

    {/* API error alert */}
    {error && (
      <div
        className="alert alert-danger d-flex align-items-center gap-2 rounded-3 py-2 small mb-4"
        role="alert"
        aria-live="assertive"
      >
        <i className="bi bi-exclamation-triangle-fill flex-shrink-0" aria-hidden="true" />
        {error}
      </div>
    )}

    {/* Form body */}
    {children}

    {/* Footer link */}
    {footerLink && (
      <p className="text-center text-muted small mt-4 mb-0">
        {footerText}{' '}
        <Link to={footerLink.to} className="text-primary fw-semibold">
          {footerLink.label}
        </Link>
      </p>
    )}

  </div>
)

export default AuthLayout
