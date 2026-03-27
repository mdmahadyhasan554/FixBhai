import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import { buildBookingUrl } from '../../utils/formatters'

/**
 * ServiceCard
 *
 * Props:
 *   service  — service object from SERVICES data
 *   compact  — smaller variant used in booking form picker
 *   selected — highlights the card (used in booking flow)
 *   onClick  — optional override; defaults to navigate to booking
 *
 * Data shape expected:
 *   { id, name, icon, color, iconColor, price, rating, bookings, category }
 */
const ServiceCard = ({ service, compact = false, selected = false, onClick }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) { onClick(service); return }
    navigate(buildBookingUrl({ service: service.name }))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <Card
      hoverable
      bordered={selected}
      className={`h-100 text-center service-card-wrap ${selected ? 'service-card-selected' : ''}`}
      style={selected ? { outline: '2px solid #2563eb', outlineOffset: 1 } : {}}
      role="button"
      tabIndex={0}
      aria-label={`Book ${service.name} starting at ₹${service.price}`}
      aria-pressed={selected}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <Card.Body className={compact ? 'p-3' : 'p-4'}>

        {/* Icon bubble */}
        <ServiceIcon
          icon={service.icon}
          color={service.color}
          iconColor={service.iconColor}
          size={compact ? 52 : 64}
        />

        {/* Name */}
        <h6 className={`fw-semibold mb-1 ${compact ? 'small' : ''}`}>
          {service.name}
        </h6>

        {/* Price */}
        <p className="text-muted mb-2" style={{ fontSize: compact ? '0.72rem' : '0.82rem' }}>
          Starting <span className="fw-semibold text-dark">₹{service.price}</span>
        </p>

        {/* Rating row */}
        {!compact && (
          <RatingRow rating={service.rating} bookings={service.bookings} />
        )}

        {/* Book CTA — only on full-size cards */}
        {!compact && (
          <div className="mt-3">
            <span className="btn btn-primary btn-sm rounded-pill px-4 w-100">
              Book Now
            </span>
          </div>
        )}

      </Card.Body>
    </Card>
  )
}

// ── Sub-components ────────────────────────────────────────

const ServiceIcon = ({ icon, color, iconColor, size }) => (
  <div
    className="d-flex align-items-center justify-content-center mx-auto mb-3 rounded-3"
    style={{ width: size, height: size, background: color, flexShrink: 0 }}
    aria-hidden="true"
  >
    <i
      className={`bi bi-${icon}`}
      style={{ fontSize: size * 0.42, color: iconColor }}
    />
  </div>
)

const RatingRow = ({ rating, bookings }) => (
  <div className="d-flex align-items-center justify-content-center gap-1">
    <i className="bi bi-star-fill text-warning" style={{ fontSize: '0.72rem' }} aria-hidden="true" />
    <span className="small fw-semibold">{rating}</span>
    <span className="text-muted small">({bookings.toLocaleString()}+)</span>
  </div>
)

export default ServiceCard
