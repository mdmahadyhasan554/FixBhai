import { useState } from 'react'
import { Link } from 'react-router-dom'
import BookingCard from './BookingCard'
import EmptyState from '../../components/common/EmptyState'
import { BOOKING_STATUS_FILTERS, ROUTES } from '../../constants'

/**
 * BookingList
 *
 * Displays bookings as cards with status filter tabs.
 *
 * Props:
 *   bookings   — array of booking objects
 *   onCancel   — called with id when user cancels a booking
 *   onRate     — called with id when user rates a booking
 *   compact    — use compact card variant
 *   showFilter — show status filter tabs (default: true)
 */
const BookingList = ({
  bookings   = [],
  onCancel,
  onRate,
  compact    = false,
  showFilter = true,
}) => {
  const [activeStatus, setActiveStatus] = useState('all')

  const filtered = activeStatus === 'all'
    ? bookings
    : bookings.filter(b => b.status === activeStatus)

  // Count per status for tab badges
  const counts = BOOKING_STATUS_FILTERS.reduce((acc, { value }) => {
    acc[value] = value === 'all'
      ? bookings.length
      : bookings.filter(b => b.status === value).length
    return acc
  }, {})

  return (
    <div>

      {/* Status filter tabs */}
      {showFilter && bookings.length > 0 && (
        <div
          className="d-flex flex-wrap gap-2 mb-4"
          role="tablist"
          aria-label="Filter bookings by status"
        >
          {BOOKING_STATUS_FILTERS.map(({ value, label }) => {
            const count = counts[value]
            if (value !== 'all' && count === 0) return null
            return (
              <button
                key={value}
                role="tab"
                aria-selected={activeStatus === value}
                className={`btn btn-sm rounded-pill d-flex align-items-center gap-2 ${
                  activeStatus === value ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setActiveStatus(value)}
              >
                {label}
                <span
                  className={`badge rounded-pill ${
                    activeStatus === value ? 'bg-white text-primary' : 'bg-secondary bg-opacity-25 text-secondary'
                  }`}
                  style={{ fontSize: '0.68rem', minWidth: 20 }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <EmptyState
          icon="calendar-x"
          title={
            activeStatus === 'all'
              ? 'No bookings yet'
              : `No ${activeStatus} bookings`
          }
          subtitle={
            activeStatus === 'all'
              ? 'Book your first service to get started'
              : 'Try a different status filter'
          }
          action={
            activeStatus === 'all' && (
              <Link to={ROUTES.BOOKING} className="btn btn-primary rounded-pill px-4">
                Book a Service
              </Link>
            )
          }
        />
      )}

      {/* Booking cards */}
      {filtered.length > 0 && (
        <div className={compact ? 'd-flex flex-column gap-2' : 'row g-3'}>
          {filtered.map(booking => (
            <div key={booking.id} className={compact ? '' : 'col-md-6 col-xl-4'}>
              <BookingCard
                booking={booking}
                onCancel={onCancel}
                onRate={onRate}
                compact={compact}
              />
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default BookingList
