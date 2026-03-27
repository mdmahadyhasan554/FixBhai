import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ServiceGrid from '../features/services/ServiceGrid'
import TechnicianCard from '../features/technicians/TechnicianCard'
import SectionHeader from '../components/common/SectionHeader'
import { SERVICES, TECHNICIANS } from '../api/data'
import { HOME_STATS, HOW_IT_WORKS, ROUTES } from '../constants'

const HomePage = () => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`${ROUTES.SERVICES}?q=${query}`)
  }

  return (
    <>
      <HeroSection query={query} setQuery={setQuery} onSearch={handleSearch} navigate={navigate} />
      <StatsBar />
      <ServicesSection navigate={navigate} />
      <HowItWorksSection />
      <TechniciansSection navigate={navigate} />
      <CtaSection navigate={navigate} />
    </>
  )
}

// ── Sections ──────────────────────────────────────────────

const HeroSection = ({ query, setQuery, onSearch, navigate }) => (
  <section className="hero-section">
    <div className="container py-5 position-relative" style={{ zIndex: 1 }}>
      <div className="row align-items-center">
        <div className="col-lg-7 text-white">
          <div className="hero-badge">
            <i className="bi bi-shield-check me-1" /> Trusted by 50,000+ customers
          </div>
          <h1 className="display-4 fw-bold mb-3 lh-sm">
            Trusted Services<br />at Your <span style={{ color: '#fbbf24' }}>Doorstep</span>
          </h1>
          <p className="lead mb-4" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Book verified technicians for AC repair, plumbing, electrical, cleaning and more — in minutes.
          </p>
          <form onSubmit={onSearch}>
            <div className="search-box">
              <i className="bi bi-search text-muted me-2" />
              <input
                placeholder="Search for AC repair, plumbing, cleaning..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Search</button>
            </div>
          </form>
          <div className="d-flex flex-wrap gap-2 mt-3">
            {['AC Repair', 'Plumbing', 'Electrical', 'Cleaning'].map(s => (
              <button key={s}
                className="btn btn-sm rounded-pill"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
                onClick={() => navigate(`${ROUTES.BOOKING}?service=${s}`)}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="col-lg-5 d-none d-lg-flex justify-content-center">
          <div className="text-center">
            <div style={{ fontSize: '10rem', lineHeight: 1 }}>🔧</div>
            <div className="d-flex gap-3 justify-content-center mt-3">
              {['⚡', '🚿', '❄️', '🧹'].map((e, i) => (
                <div key={i} className="rounded-3 p-3"
                  style={{ background: 'rgba(255,255,255,0.15)', fontSize: '2rem' }}>{e}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

const StatsBar = () => (
  <section className="py-4 bg-white border-bottom">
    <div className="container">
      <div className="row g-3 text-center">
        {HOME_STATS.map(s => (
          <div key={s.label} className="col-6 col-md-3">
            <div className="fw-bold fs-3 text-primary">{s.value}</div>
            <div className="text-muted small">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const ServicesSection = ({ navigate }) => (
  <section className="py-5">
    <div className="container">
      <SectionHeader
        title="Our Services"
        subtitle="Professional solutions for every home need"
        action={
          <button className="btn btn-outline-primary rounded-pill px-4"
            onClick={() => navigate(ROUTES.SERVICES)}>
            View All <i className="bi bi-arrow-right ms-1" />
          </button>
        }
      />
      <ServiceGrid services={SERVICES} />
    </div>
  </section>
)

const HowItWorksSection = () => (
  <section className="py-5" style={{ background: '#f1f5f9' }}>
    <div className="container">
      <div className="text-center mb-5">
        <h2 className="section-title mb-2">How It Works</h2>
        <p className="section-sub">Book a service in 4 simple steps</p>
      </div>
      <div className="row g-4">
        {HOW_IT_WORKS.map(h => (
          <div key={h.step} className="col-6 col-md-3 text-center">
            <div className="position-relative d-inline-block mb-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                style={{ width: 72, height: 72, background: '#dbeafe' }}>
                <i className={`bi bi-${h.icon} text-primary fs-3`} />
              </div>
              <span className="position-absolute top-0 end-0 badge rounded-circle bg-primary"
                style={{ width: 24, height: 24, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {h.step}
              </span>
            </div>
            <h6 className="fw-bold">{h.title}</h6>
            <p className="text-muted small mb-0">{h.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const TechniciansSection = ({ navigate }) => (
  <section className="py-5">
    <div className="container">
      <SectionHeader
        title="Top Technicians"
        subtitle="Verified experts ready to help"
        action={
          <button className="btn btn-outline-primary rounded-pill px-4"
            onClick={() => navigate(ROUTES.TECHNICIANS)}>
            View All <i className="bi bi-arrow-right ms-1" />
          </button>
        }
      />
      <div className="row g-3">
        {TECHNICIANS.slice(0, 3).map(t => (
          <div key={t.id} className="col-md-4">
            <TechnicianCard tech={t} />
          </div>
        ))}
      </div>
    </div>
  </section>
)

const CtaSection = ({ navigate }) => (
  <section className="py-5" style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)' }}>
    <div className="container text-center text-white py-3">
      <h2 className="fw-bold mb-3">Ready to get started?</h2>
      <p className="mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
        Book your first service today and experience the FixBhai difference.
      </p>
      <button className="btn btn-warning btn-lg rounded-pill px-5 fw-semibold"
        onClick={() => navigate(ROUTES.BOOKING)}>
        Book a Service Now <i className="bi bi-arrow-right ms-2" />
      </button>
    </div>
  </section>
)

export default HomePage
