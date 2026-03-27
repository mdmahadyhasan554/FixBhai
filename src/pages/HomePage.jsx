import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ServiceGrid from '../features/services/ServiceGrid'
import TechnicianCard from '../features/technicians/TechnicianCard'
import { SERVICES, TECHNICIANS } from '../api/data'

const STATS = [
  { value: '50K+', label: 'Happy Customers', icon: 'emoji-smile' },
  { value: '2K+', label: 'Expert Technicians', icon: 'people' },
  { value: '25+', label: 'Services Offered', icon: 'tools' },
  { value: '4.8★', label: 'Average Rating', icon: 'star' },
]

const HOW_IT_WORKS = [
  { step: 1, title: 'Choose a Service', desc: 'Browse from 25+ home services', icon: 'grid' },
  { step: 2, title: 'Book a Slot', desc: 'Pick your preferred date and time', icon: 'calendar-check' },
  { step: 3, title: 'Expert Arrives', desc: 'Verified technician at your door', icon: 'person-check' },
  { step: 4, title: 'Job Done', desc: 'Pay after the work is complete', icon: 'patch-check' },
]

const HomePage = () => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/services?q=${query}`)
  }

  return (
    <>
      {/* Hero */}
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
              <form onSubmit={handleSearch}>
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
                  <button key={s} className="btn btn-sm rounded-pill"
                    style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
                    onClick={() => navigate(`/booking?service=${s}`)}>
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
                    <div key={i} className="rounded-3 p-3" style={{ background: 'rgba(255,255,255,0.15)', fontSize: '2rem' }}>{e}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-4 bg-white border-bottom">
        <div className="container">
          <div className="row g-3 text-center">
            {STATS.map(s => (
              <div key={s.label} className="col-6 col-md-3">
                <div className="py-2">
                  <div className="fw-bold fs-3 text-primary">{s.value}</div>
                  <div className="text-muted small">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="section-title mb-1">Our Services</h2>
              <p className="section-sub mb-0">Professional solutions for every home need</p>
            </div>
            <button className="btn btn-outline-primary rounded-pill px-4" onClick={() => navigate('/services')}>
              View All <i className="bi bi-arrow-right ms-1" />
            </button>
          </div>
          <ServiceGrid services={SERVICES} />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5" style={{ background: '#f1f5f9' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title mb-2">How It Works</h2>
            <p className="section-sub">Book a service in 4 simple steps</p>
          </div>
          <div className="row g-4">
            {HOW_IT_WORKS.map((h, i) => (
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

      {/* Top Technicians */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="section-title mb-1">Top Technicians</h2>
              <p className="section-sub mb-0">Verified experts ready to help</p>
            </div>
            <button className="btn btn-outline-primary rounded-pill px-4" onClick={() => navigate('/technicians')}>
              View All <i className="bi bi-arrow-right ms-1" />
            </button>
          </div>
          <div className="row g-3">
            {TECHNICIANS.slice(0, 3).map(t => (
              <div key={t.id} className="col-md-4">
                <TechnicianCard tech={t} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)' }}>
        <div className="container text-center text-white py-3">
          <h2 className="fw-bold mb-3">Ready to get started?</h2>
          <p className="mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Book your first service today and experience the FixBhai difference.
          </p>
          <button className="btn btn-warning btn-lg rounded-pill px-5 fw-semibold"
            onClick={() => navigate('/booking')}>
            Book a Service Now <i className="bi bi-arrow-right ms-2" />
          </button>
        </div>
      </section>
    </>
  )
}

export default HomePage
