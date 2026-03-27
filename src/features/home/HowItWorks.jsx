import { HOW_IT_WORKS } from '../../constants'

const STEP_COLOURS = ['#dbeafe', '#d1fae5', '#fef3c7', '#ede9fe']
const ICON_COLOURS = ['#2563eb', '#059669', '#d97706', '#7c3aed']

/**
 * HowItWorks
 * 4-step process section with connector lines.
 */
const HowItWorks = () => (
  <section className="py-5" style={{ background: '#f8fafc' }} aria-label="How it works">
    <div className="container">
      <div className="text-center mb-5">
        <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 mb-3 d-inline-block">
          Simple Process
        </span>
        <h2 className="section-title mb-2">How It Works</h2>
        <p className="section-sub">Book a service in 4 simple steps</p>
      </div>

      <div className="row g-4 position-relative">
        {/* Connector line — desktop only */}
        <div
          className="d-none d-md-block position-absolute"
          style={{
            top: 36, left: '12.5%', right: '12.5%',
            height: 2,
            background: 'linear-gradient(90deg, #dbeafe, #ede9fe)',
            zIndex: 0,
          }}
          aria-hidden="true"
        />

        {HOW_IT_WORKS.map(({ step, title, desc, icon }, i) => (
          <div key={step} className="col-6 col-md-3 text-center position-relative" style={{ zIndex: 1 }}>
            {/* Step circle */}
            <div className="position-relative d-inline-block mb-4">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                style={{ width: 72, height: 72, background: STEP_COLOURS[i] }}
                aria-hidden="true"
              >
                <i className={`bi bi-${icon} fs-3`} style={{ color: ICON_COLOURS[i] }} />
              </div>
              <span
                className="position-absolute top-0 end-0 rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center"
                style={{ width: 24, height: 24, fontSize: '0.72rem' }}
                aria-label={`Step ${step}`}
              >
                {step}
              </span>
            </div>
            <h6 className="fw-bold mb-2">{title}</h6>
            <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default HowItWorks
