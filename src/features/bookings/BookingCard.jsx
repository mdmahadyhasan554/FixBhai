import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/common/StatusBadge'
import { formatDate } from '../../utils/formatters'
import { SERVICE_COLOURS } from '../../constants'

/**
 * BookingCard
 *
 * A rich card view of a single booking.
 * Used in BookingList and anywhere a booking needs to be displayed prominently.
 *
 * Props:
 *   booking   — booking object
 *   onCancel  — called with booking.id when user cancels
 *   onRate    — called with booking.id when user rates
 *   compact   — slim single-line layout (for dashboard overview)
 */
const BookingCard = ({ booking, onCancel, onRate, compact = false }) => {
  if (compact) return <BookingCardCompact booking={booking} onCancel={onCancel} />

  const {
    id, service, technician, date, time,
    amount, status, problemCategory, description,
  } = booking

  return (
    <Card bordered hoverable className="h-100">
      <Card.Body className="p-4">

        {/* ── Header ── */}
        <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
          <div className="d-flex align-items-center gap-3">
            <ServiceIconBubble service={service} />
            <div>
              <h6 className="fw-bold mb-0">{service}</h6>
              <span className="text-muted small">{id}</span>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* ── Details grid ── */}
        <div className="row g-2 mb-3">
          <DetailItem icon="person"    label="Technician" value={technician || 'Auto Assigned'} />
          <DetailItem icon="calendar3" label="Date"       value={formatDate(date)} />
          <DetailItem icon="clock"     label="Time"       value={time} />
          {problemCategory && (
            <DetailItem icon="exclamation-circle" label="Problem" value={problemCategory} />
          )}
        </div>

        {/* ── Problem description ── */}
        {description && (
          <div className="p-3 rounded-3 mb-3" style={{ background: '#f8fafc' }}>
            <div className="text-muted small mb-1">
              <i className="bi bi-chat-text me-1" aria-hidden="true" />
              Problem Description
            </div>
            <p className="small mb-0" style={{ lineHeight: 1.6 }}>{description}</p>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="d-flex align-items-center justify-content-between pt-3"
          style={{ borderTop: '1px solid #f1f5f9' }}>
          <div>
            <span className="fw-bold text-primary" style={{ fontSize: '1.1rem' }}>
              ৳{amount}
            </span>
            <span className="text-muted small ms-1">/ visit</span>
          </div>
          <BookingActions
            booking={booking}
            onCancel={onCancel}
            onRate={onRate}
          />
        </div>

      </Card.Body>
    </Card>
  )
}

// ── Compact variant ───────────────────────────────────────

// Compact single-line variant — used in dashboard overview recent bookings
const BookingCardCompact = ({ booking }) => (
  <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-white border"
    style={{ borderColor: '#f1f5f9' }}>
    <ServiceIconBubble service={booking.service} size={40} />
    <div className="flex-grow-1 min-w-0">
      <div className="fw-semibold small text-truncate">{booking.service}</div>
      <div className="text-muted" style={{ fontSize: '0.72rem' }}>
        {formatDate(booking.date)} · {booking.time}
      </div>
    </div>
    <div className="d-flex align-items-center gap-2 flex-shrink-0">
      <span className="fw-bold text-primary small">৳{booking.amount}</span>
      <StatusBadge status={booking.status} />
    </div>
  </div>
)

// ── Action buttons ────────────────────────────────────────

const BookingActions = ({ booking, onCancel, onRate }) => {
  if (booking.status === 'pending') {
    return (
      <Button
        variant="outline-danger"
        size="sm"
        rounded
        icon="x-circle"
        onClick={() => onCancel?.(booking.id)}
      >
        Cancel
      </Button>
    )
  }
  if (booking.status === 'confirmed') {
    return (
      <div className="d-flex gap-2">
        <Button variant="outline-secondary" size="sm" rounded icon="telephone">
          Contact
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          rounded
          onClick={() => onCancel?.(booking.id)}
        >
          Cancel
        </Button>
      </div>
    )
  }
  if (booking.status === 'completed') {
    return (
      <Button
        variant="outline-warning"
        size="sm"
        rounded
        icon="star"
        onClick={() => onRate?.(booking.id)}
      >
        Rate Service
      </Button>
    )
  }
  return <span className="text-muted small">—</span>
}

// ── Micro-components ──────────────────────────────────────

// ServiceIconBubble uses the centralised SERVICE_COLOURS map from constants
const ServiceIconBubble = ({ service, size = 48 }) => {
  const meta = SERVICE_COLOURS[service] || { bg: '#f1f5f9', color: '#64748b', icon: 'tools' }
  return (
    <div
      className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
      style={{ width: size, height: size, background: meta.bg }}
      aria-hidden="true"
    >
      <i className={`bi bi-${meta.icon}`} style={{ color: meta.color, fontSize: size * 0.42 }} />
    </div>
  )
}

const DetailItem = ({ icon, label, value }) => (
  <div className="col-6">
    <div className="d-flex align-items-start gap-2">
      <i className={`bi bi-${icon} text-primary mt-1 flex-shrink-0`}
        style={{ fontSize: '0.8rem' }} aria-hidden="true" />
      <div>
        <div className="text-muted" style={{ fontSize: '0.68rem' }}>{label}</div>
        <div className="fw-semibold small">{value || '—'}</div>
      </div>
    </div>
  </div>
)

export default BookingCard
