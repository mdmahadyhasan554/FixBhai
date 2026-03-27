import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import { ROUTES } from '../../constants'

/**
 * CtaSection
 * Two-column CTA — left: copy + buttons, right: decorative stats.
 */
const CtaSection = () => {
  const navigate = useNavigate()
  return (
    <section
      className="py-5"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)' }}
      aria-label="Call to action"
    >
      <div className="container py-3">
        <div className="row align-items-center g-5">

          {/* Left */}
          <div className="col-lg-6 text-white">
            <span className="badge rounded-pill px-3 py-2 mb-3 d-inline-block"
              style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24' }}>
              <i className="bi bi-lightning-charge-fill me-1" />Limited Time Offer
            </span>
            <h2 className="fw-bold mb-3" style={{ fontSize: '2.2rem' }}>
              Get ₹100 off your<br />first booking
            </h2>
            <p className="mb-4" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
              New to FixBhai? Use code <strong className="text-warning">FIRST100</strong> at checkout
              and experience trusted home services at your doorstep.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Button variant="warning" size="lg" rounded iconEnd="arrow-right"
                className="fw-semibold px-5"
                onClick={() => navigate(ROUTES.BOOKING)}>
                Book Now
              </Button>
              <Button variant="outline-light" size="lg" rounded
                onClick={() => navigate(ROUTES.SERVICES)}>
                Browse Services
              </Button>
            </div>
          </div>

          {/* Right — mini stats */}
          <div className="col-lg-6">
            <div className="row g-3">
              {[
                { value: '50K+',  label: 'Happy Customers',   icon: 'emoji-smile',   bg: 'rgba(255,255,255,0.1)' },
                { value: '2K+',   label: 'Expert Technicians',icon: 'people-fill',   bg: 'rgba(255,255,255,0.1)' },
                { value: '4.8★',  label: 'Average Rating',    icon: 'star-fill',     bg: 'rgba(251,191,36,0.15)' },
                { value: '30min', label: 'Avg Response Time', icon: 'clock-fill',    bg: 'rgba(255,255,255,0.1)' },
              ].map(({ value, label, icon, bg }) => (
                <div key={label} className="col-6">
                  <div className="rounded-4 p-4 text-white text-center" style={{ background: bg, backdropFilter: 'blur(8px)' }}>
                    <i className={`bi bi-${icon} d-block mb-2`} style={{ fontSize: '1.5rem', color: '#fbbf24' }} aria-hidden="true" />
                    <div className="fw-bold fs-4">{value}</div>
                    <div className="small" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default CtaSection
