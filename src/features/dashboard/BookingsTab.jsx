import { Link } from 'react-router-dom'
import BookingList from '../bookings/BookingList'
import { ROUTES } from '../../constants'

/**
 * BookingsTab — dashboard tab showing all user bookings.
 * Uses BookingList with status filter tabs and card layout.
 */
const BookingsTab = ({ bookings, onCancel }) => (
  <div>
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h6 className="fw-bold mb-0">My Bookings</h6>
        <p className="text-muted small mb-0">{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
      </div>
      <Link to={ROUTES.BOOKING} className="btn btn-primary btn-sm rounded-pill px-4">
        <i className="bi bi-plus me-1" aria-hidden="true" />New Booking
      </Link>
    </div>

    <BookingList
      bookings={bookings}
      onCancel={onCancel}
      showFilter
    />
  </div>
)

export default BookingsTab
