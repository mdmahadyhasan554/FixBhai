import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants'

const QUICK_SERVICES = ['AC Repair', 'Plumbing', 'Electrical', 'Cleaning']

/**
 * HeroSection
 * Full-width gradient hero with search box and quick-service pills.
 */
const HeroSection = () => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`${ROUTES.SERVICES}?q=${encodeURIComponent(query)}`)
  }

  return (
    <section className="hero-section" aria-label="Hero">
      <div className="container py-5 position-relative" style={{ zIndex: 1 }}>
        <div className="row align-items-center">

          {/* Left: copy + search */}
          <div className="col-lg-7 text-white">
            <div className="hero-badge">
              <i className="bi bi-shield-check me-1" aria-hidden="true" />
              Trusted by 50,000+ customers
            </div>

            <h1 className="display-4 fw-bold mb-3 lh-sm">
              Trusted Services<br />
              at Your <span style={{ color: '#fbbf24' }}>Doorstep</span>
            </h1>

            <p className="lead mb-4" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Book verified technicians for AC repair, plumbing, electrical,
              cleaning and more — in minutes.
            </p>

            {/* Search box */}
            <form onSubmit={handleSearch} role="search" aria-label="Search services">
              <div className="search-box">
                <i className="bi bi-search text-muted me-2" aria-hidden="true" />
                <input
                  placeholder="Search for AC repair, plumbing, cleaning..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  aria-label="Search services"
                />
                <button type="submit" className="btn btn-primary">Search</button>
              </div>
            </form>

            {/* Quick-service pills */}
            <div className="d-flex flex-wrap gap-2 mt-3" role="list" aria-label="Popular services">
              {QUICK_SERVICES.map(s => (
                <button
                  key={s}
                  role="listitem"
                  className="btn btn-sm rounded-pill"
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}
                  onClick={() => navigate(`${ROUTES.BOOKING}?service=${encodeURIComponent(s)}`)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Right: decorative emoji */}
          <div className="col-lg-5 d-none d-lg-flex justify-content-center" aria-hidden="true">
            <div className="text-center">
              <div style={{ fontSize: '10rem', lineHeight: 1 }}>🔧</div>
              <div className="d-flex gap-3 justify-content-center mt-3">
                {['⚡', '🚿', '❄️', '🧹'].map((emoji, i) => (
                  <div
                    key={i}
                    className="rounded-3 p-3"
                    style={{ background: 'rgba(255,255,255,0.15)', fontSize: '2rem' }}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default HeroSection
