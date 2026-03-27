import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'

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

    {/* Brand header */}
    <div className="text-center mb-4">
      <div
        className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
        style={{ width: 56, height: 56, background: '#dbeafe' }}
        aria-hidden="true"
      >
        <i className={`bi bi-${icon} text-primary`} style={{ fontSize: '1.6rem' }} />
      </div>
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
