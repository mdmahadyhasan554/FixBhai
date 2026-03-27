import { HOW_IT_WORKS } from '../../constants'

/**
 * HowItWorks
 * 4-step process section.
 */
const HowItWorks = () => (
  <section className="py-5" style={{ background: '#f1f5f9' }} aria-label="How it works">
    <div className="container">
      <div className="text-center mb-5">
        <h2 className="section-title mb-2">How It Works</h2>
        <p className="section-sub">Book a service in 4 simple steps</p>
      </div>
      <div className="row g-4">
        {HOW_IT_WORKS.map(({ step, title, desc, icon }) => (
          <div key={step} className="col-6 col-md-3 text-center">
            <div className="position-relative d-inline-block mb-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                style={{ width: 72, height: 72, background: '#dbeafe' }}
                aria-hidden="true"
              >
                <i className={`bi bi-${icon} text-primary fs-3`} />
              </div>
              <span
                className="position-absolute top-0 end-0 badge rounded-circle bg-primary"
                style={{
                  width: 24, height: 24,
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label={`Step ${step}`}
              >
                {step}
              </span>
            </div>
            <h6 className="fw-bold">{title}</h6>
            <p className="text-muted small mb-0">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default HowItWorks
