import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { buildBookingUrl } from '../../utils/formatters'

/**
 * TechnicianCard
 *
 * Props:
 *   tech      — technician object from TECHNICIANS data
 *   compact   — slim horizontal layout for lists/sidebars
 *
 * Data shape:
 *   { id, name, service, rating, reviews, experience,
 *     location, available, price, avatar, verified }
 */
const TechnicianCard = ({ tech, compact = false }) => {
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()

  const handleBook = () =>
    navigate(buildBookingUrl({ service: tech.service, techId: tech.id }))

  if (compact) return <TechnicianCardCompact tech={tech} onBook={handleBook} />

  return (
    <>
      <Card hoverable className="h-100">
        <Card.Body className="p-4">

          {/* ── Header row ── */}
          <div className="d-flex align-items-start gap-3 mb-3">
            <TechAvatar src={tech.avatar} name={tech.name} size={68} />

            <div className="flex-grow-1 min-w-0">
              {/* Name + verified */}
              <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                <h6 className="fw-bold mb-0 text-truncate">{tech.name}</h6>
                {tech.verified && (
                  <i
                    className="bi bi-patch-check-fill text-primary flex-shrink-0"
                    title="Verified technician"
                    aria-label="Verified technician"
                  />
                )}
              </div>

              {/* Service tag */}
              <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill small fw-medium mb-2">
                {tech.service}
              </span>

              {/* Star rating */}
              <StarRating rating={tech.rating} reviews={tech.reviews} />
            </div>

            {/* Availability badge */}
            <Badge
              type={tech.available ? 'success' : 'secondary'}
              dot
              size="sm"
              className="flex-shrink-0"
            >
              {tech.available ? 'Available' : 'Busy'}
            </Badge>
          </div>

          {/* ── Meta chips ── */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            <MetaChip icon="briefcase"   label={tech.experience}  />
            <MetaChip icon="geo-alt"     label={tech.location}    />
            <MetaChip icon="chat-square-text" label={`${tech.reviews} reviews`} />
          </div>

          {/* ── Divider ── */}
          <hr className="my-3" style={{ borderColor: '#f1f5f9' }} />

          {/* ── Footer: price + actions ── */}
          <div className="d-flex align-items-center justify-content-between gap-2">
            <PriceDisplay price={tech.price} />
            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                rounded
                icon="person"
                onClick={() => setProfileOpen(true)}
                aria-label={`View ${tech.name}'s profile`}
              >
                Profile
              </Button>
              <Button
                variant="primary"
                size="sm"
                rounded
                icon="calendar-check"
                disabled={!tech.available}
                onClick={handleBook}
                aria-label={`Book ${tech.name}`}
              >
                Book
              </Button>
            </div>
          </div>

        </Card.Body>
      </Card>

      {/* Profile modal */}
      <TechnicianProfileModal
        tech={tech}
        show={profileOpen}
        onClose={() => setProfileOpen(false)}
        onBook={handleBook}
      />
    </>
  )
}

// Compact variant — slim horizontal layout for sidebars and homepage previews
const TechnicianCardCompact = ({ tech, onBook }) => (
  <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-white border"
    style={{ borderColor: '#f1f5f9' }}>
    <TechAvatar src={tech.avatar} name={tech.name} size={48} />
    <div className="flex-grow-1 min-w-0">
      <div className="d-flex align-items-center gap-1 mb-1">
        <span className="fw-semibold small text-truncate">{tech.name}</span>
        {tech.verified && <i className="bi bi-patch-check-fill text-primary" style={{ fontSize: '0.75rem' }} />}
      </div>
      <StarRating rating={tech.rating} reviews={tech.reviews} small />
    </div>
    <div className="text-end flex-shrink-0">
      <div className="fw-bold text-primary small">₹{tech.price}</div>
      <button className="btn btn-primary btn-sm rounded-pill px-3 mt-1"
        disabled={!tech.available} onClick={onBook}>
        Book
      </button>
    </div>
  </div>
)

// ── Profile Modal ─────────────────────────────────────────

const TechnicianProfileModal = ({ tech, show, onClose, onBook }) => (
  <Modal
    show={show}
    onClose={onClose}
    title="Technician Profile"
    size="md"
    footer={
      <>
        <Button variant="outline-secondary" rounded onClick={onClose}>Close</Button>
        <Button
          variant="primary"
          rounded
          icon="calendar-check"
          disabled={!tech.available}
          onClick={() => { onBook(); onClose() }}
        >
          Book Now
        </Button>
      </>
    }
  >
    {/* Profile header */}
    <div className="text-center mb-4">
      <TechAvatar src={tech.avatar} name={tech.name} size={88} className="mx-auto mb-3" />
      <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
        <h5 className="fw-bold mb-0">{tech.name}</h5>
        {tech.verified && (
          <i className="bi bi-patch-check-fill text-primary fs-5" title="Verified" />
        )}
      </div>
      <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">
        {tech.service}
      </span>
    </div>

    {/* Stats row */}
    <div className="row g-3 mb-4 text-center">
      {[
        { label: 'Rating',     value: tech.rating,     icon: 'star-fill',  color: '#f59e0b' },
        { label: 'Reviews',    value: tech.reviews,    icon: 'chat-dots',  color: '#2563eb' },
        { label: 'Experience', value: tech.experience, icon: 'briefcase',  color: '#059669' },
      ].map(s => (
        <div key={s.label} className="col-4">
          <div className="rounded-4 p-3" style={{ background: '#f8fafc' }}>
            <i className={`bi bi-${s.icon} d-block mb-1`} style={{ color: s.color, fontSize: '1.3rem' }} />
            <div className="fw-bold">{s.value}</div>
            <div className="text-muted" style={{ fontSize: '0.72rem' }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>

    {/* Details */}
    <div className="d-flex flex-column gap-2">
      {[
        { icon: 'geo-alt',    label: 'Location',     value: tech.location                    },
        { icon: 'currency-rupee', label: 'Rate',     value: `₹${tech.price} per visit`       },
        { icon: 'circle-fill', label: 'Status',      value: tech.available ? 'Available now' : 'Currently busy' },
      ].map(d => (
        <div key={d.label} className="d-flex align-items-center gap-3 p-3 rounded-3"
          style={{ background: '#f8fafc' }}>
          <i className={`bi bi-${d.icon} text-primary`} style={{ width: 20 }} aria-hidden="true" />
          <div>
            <div className="text-muted" style={{ fontSize: '0.72rem' }}>{d.label}</div>
            <div className="fw-semibold small">{d.value}</div>
          </div>
        </div>
      ))}
    </div>
  </Modal>
)

// ── Shared micro-components ───────────────────────────────

export const StarRating = ({ rating, reviews, small = false }) => {
  const full  = Math.floor(rating)
  const half  = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  const size  = small ? '0.65rem' : '0.78rem'

  return (
    <div className="d-flex align-items-center gap-1" aria-label={`Rating: ${rating} out of 5`}>
      <span aria-hidden="true" style={{ fontSize: size, lineHeight: 1 }}>
        {'★'.repeat(full)}
        {half ? '½' : ''}
        <span style={{ color: '#cbd5e1' }}>{'★'.repeat(empty)}</span>
      </span>
      <span className={`fw-semibold ${small ? '' : 'small'}`} style={{ fontSize: small ? '0.72rem' : '0.82rem' }}>
        {rating}
      </span>
      {reviews !== undefined && (
        <span className="text-muted" style={{ fontSize: small ? '0.68rem' : '0.78rem' }}>
          ({reviews})
        </span>
      )}
    </div>
  )
}

const TechAvatar = ({ src, name, size, className = '' }) => (
  <div className={`flex-shrink-0 ${className}`} style={{ width: size, height: size }}>
    <img
      src={src}
      alt={`${name} profile photo`}
      className="rounded-circle w-100 h-100"
      style={{ objectFit: 'cover', border: '3px solid #dbeafe' }}
      onError={e => { e.target.style.display = 'none' }}
    />
  </div>
)

const MetaChip = ({ icon, label }) => (
  <span className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill small"
    style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.78rem' }}>
    <i className={`bi bi-${icon}`} aria-hidden="true" style={{ fontSize: '0.72rem' }} />
    {label}
  </span>
)

const PriceDisplay = ({ price }) => (
  <div>
    <span className="fw-bold text-primary" style={{ fontSize: '1.25rem' }}>₹{price}</span>
    <span className="text-muted small ms-1">/ visit</span>
  </div>
)

export default TechnicianCard
