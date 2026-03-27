import { Link } from 'react-router-dom'
import {
  ROUTES,
  FOOTER_SERVICES,
  FOOTER_COMPANY,
  FOOTER_SOCIAL,
  FOOTER_CONTACT,
} from '../../constants'

/**
 * Footer
 *
 * Four-column layout:
 *   1. Brand + tagline + social links
 *   2. Services quick links
 *   3. Company links
 *   4. Contact info
 *
 * All link data lives in constants/index.js — nothing hardcoded here.
 */
const Footer = () => (
  <footer className="footer pt-5 pb-3 mt-auto" role="contentinfo">
    <div className="container">

      {/* Main grid */}
      <div className="row g-4 mb-4">

        {/* Brand column */}
        <div className="col-lg-4">
          <Link to={ROUTES.HOME} className="text-decoration-none d-inline-flex align-items-center gap-2 mb-3">
            <i className="bi bi-tools text-warning fs-5" aria-hidden="true" />
            <span className="fw-bold fs-5 text-white">FixBhai</span>
          </Link>
          <p className="small mb-3" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
            Trusted home services at your doorstep. Book verified technicians
            for AC, plumbing, electrical, and more.
          </p>
          <div className="d-flex gap-3" role="list" aria-label="Social media links">
            {FOOTER_SOCIAL.map(({ name, href }) => (
              <a
                key={name}
                href={href}
                className="footer-social-link"
                aria-label={`Follow us on ${name}`}
                role="listitem"
                rel="noopener noreferrer"
              >
                <i className={`bi bi-${name} fs-5`} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Services column */}
        <div className="col-6 col-lg-2">
          <h6 className="text-white fw-semibold mb-3">Services</h6>
          <ul className="list-unstyled small" role="list">
            {FOOTER_SERVICES.map(name => (
              <li key={name} className="mb-2" role="listitem">
                <Link to={ROUTES.SERVICES} className="footer-link">{name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company column */}
        <div className="col-6 col-lg-2">
          <h6 className="text-white fw-semibold mb-3">Company</h6>
          <ul className="list-unstyled small" role="list">
            {FOOTER_COMPANY.map(name => (
              <li key={name} className="mb-2" role="listitem">
                <a href="#" className="footer-link">{name}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact column */}
        <div className="col-lg-4">
          <h6 className="text-white fw-semibold mb-3">Contact Us</h6>
          <ul className="list-unstyled small" role="list">
            {FOOTER_CONTACT.map(({ icon, text }) => (
              <li key={text} className="mb-2 d-flex align-items-start gap-2" role="listitem">
                <i className={`bi bi-${icon} text-warning mt-1 flex-shrink-0`} aria-hidden="true" />
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{text}</span>
              </li>
            ))}
          </ul>

          {/* Newsletter */}
          <div className="mt-3">
            <p className="small fw-semibold text-white mb-2">Get service updates</p>
            <div className="input-group input-group-sm">
              <input
                type="email"
                className="form-control rounded-start-3 border-0"
                placeholder="your@email.com"
                aria-label="Email for newsletter"
              />
              <button
                className="btn btn-warning rounded-end-3 fw-semibold px-3"
                type="button"
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Bottom bar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 small"
        style={{ color: 'rgba(255,255,255,0.45)' }}>
        <span>© {new Date().getFullYear()} FixBhai. All rights reserved.</span>
        <div className="d-flex gap-3">
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Service</a>
          <a href="#" className="footer-link">Cookie Policy</a>
        </div>
      </div>

    </div>
  </footer>
)

export default Footer
