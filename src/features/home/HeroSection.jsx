import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants'

const QUICK = ['AC Repair', 'Plumbing', 'Electrical', 'Cleaning', 'Painting', 'Carpentry']

const HeroSection = () => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`${ROUTES.SERVICES}${query.trim() ? `?q=${encodeURIComponent(query)}` : ''}`)
  }

  return (
    <section className="hero-section" aria-label="Hero">
      <div className="container position-relative py-5" style={{ zIndex: 1 }}>
        <div className="row align-items-center g-5">

          {/* ── Left column ── */}
          <div className="col-lg-6 text-white">
            {/* Trust pill */}
            <div className="hero-badge mb-3">
              <i className="bi bi-shield-check me-2" aria-hidden="true" />
              Trusted by <strong>50,000+</strong> customers across Bangladesh
            </div>

            <h1 className="display-3 fw-bold lh-sm mb-3">
              Home Services,<br />
              <span style={{ color: '#fbbf24' }}>Done Right.</span>
            </h1>

            <p className="lead mb-4" style={{ color: 'rgba(255,255,255,0.82)', maxWidth: 480 }}>
              Find trusted technicians near you for AC repair, plumbing, electrical,
              cleaning and more — verified professionals at your doorstep.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} role="search" aria-label="Search services" className="mb-3">
              <div className="hero-search-bar">
                <div className="hero-search-field">
                  <i className="bi bi-search text-muted" aria-hidden="true" />
                  <input
                    type="search"
                    placeholder="What service do you need?"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    aria-label="Search services"
                    autoComplete="off"
                  />
                </div>
                <div className="hero-search-divider d-none d-md-block" />
                <div className="hero-search-field d-none d-md-flex">
                  <i className="bi bi-geo-alt text-muted" aria-hidden="true" />
                  <input type="text" placeholder="Dhaka, Chittagong, Sylhet..." aria-label="Location" />
                </div>
                <button type="submit" className="btn btn-warning fw-semibold px-4 rounded-3">
                  Search
                </button>
              </div>
            </form>

            {/* Quick-pick pills */}
            <div className="d-flex flex-wrap gap-2" role="list" aria-label="Popular services">
              <span className="text-white-50 small align-self-center me-1">Popular:</span>
              {QUICK.map(s => (
                <button key={s} role="listitem" type="button"
                  className="btn btn-sm rounded-pill hero-quick-pill"
                  onClick={() => navigate(`${ROUTES.BOOKING}?service=${encodeURIComponent(s)}`)}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* ── Right column — floating cards ── */}
          <div className="col-lg-6 d-none d-lg-block" aria-hidden="true">
            <HeroVisual />
          </div>

        </div>
      </div>
    </section>
  )
}

const HERO_CARDS = [
  { icon: 'wind',             bg: '#dbeafe', color: '#2563eb', label: 'AC Repair',   price: '৳800'  },
  { icon: 'lightning-charge', bg: '#fef3c7', color: '#d97706', label: 'Electrical',  price: '৳300'  },
  { icon: 'droplet',          bg: '#d1fae5', color: '#059669', label: 'Plumbing',    price: '৳400'  },
  { icon: 'stars',            bg: '#ede9fe', color: '#7c3aed', label: 'Cleaning',    price: '৳600'  },
]

const HeroVisual = () => (
  <div className="position-relative" style={{ height: 380 }}>
    {/* Main card */}
    <div className="hero-float-card hero-float-main shadow-lg">
      <div className="d-flex align-items-center gap-3 mb-3">
        <div className="rounded-3 p-2" style={{ background: '#dbeafe' }}>
          <i className="bi bi-tools text-primary fs-4" />
        </div>
        <div>
          <div className="fw-bold">AC Repair Booked!</div>
          <div className="text-muted small">Karim Sheikh · Today 10 AM</div>
        </div>
      </div>
      <div className="d-flex align-items-center gap-2">
        <img src="https://i.pravatar.cc/36?img=11" className="rounded-circle" width={36} height={36} alt="" />
        <div className="flex-grow-1">
          <div className="progress rounded-pill" style={{ height: 6 }}>
            <div className="progress-bar bg-success" style={{ width: '70%' }} />
          </div>
          <div className="text-muted" style={{ fontSize: '0.72rem' }}>Technician on the way</div>
        </div>
        <span className="badge bg-success rounded-pill">Live</span>
      </div>
    </div>

    {/* Service mini-cards */}
    <div className="hero-float-grid">
      {HERO_CARDS.map(({ icon, bg, color, label, price }) => (
        <div key={label} className="hero-float-mini shadow-sm">
          <div className="rounded-3 p-2 mb-2 d-inline-flex" style={{ background: bg }}>
            <i className={`bi bi-${icon}`} style={{ color, fontSize: '1.2rem' }} />
          </div>
          <div className="fw-semibold small">{label}</div>
          <div className="text-muted" style={{ fontSize: '0.72rem' }}>from {price}</div>
        </div>
      ))}
    </div>

    {/* Rating badge */}
    <div className="hero-float-badge shadow">
      <i className="bi bi-star-fill text-warning me-1" />
      <span className="fw-bold">4.8</span>
      <span className="text-muted small ms-1">/ 5.0</span>
    </div>
  </div>
)

export default HeroSection
