import { TRUST_BADGES } from '../../constants'

/**
 * TrustBanner
 * 4-column trust signals strip.
 */
const TrustBanner = () => (
  <section className="py-4" style={{ background: '#f8fafc' }} aria-label="Why choose FixBhai">
    <div className="container">
      <div className="row g-3">
        {TRUST_BADGES.map(({ icon, label, desc }) => (
          <div key={label} className="col-6 col-md-3">
            <div className="d-flex align-items-start gap-3 p-3 rounded-4 bg-white h-100"
              style={{ border: '1px solid #f1f5f9' }}>
              <div className="rounded-3 p-2 flex-shrink-0" style={{ background: '#dbeafe' }}>
                <i className={`bi bi-${icon} text-primary`} style={{ fontSize: '1.2rem' }} aria-hidden="true" />
              </div>
              <div>
                <div className="fw-semibold small">{label}</div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>{desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default TrustBanner
