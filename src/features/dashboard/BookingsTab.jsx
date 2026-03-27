import { Link } from 'react-router-dom'
import BookingTable from './BookingTable'
import EmptyState from '../../components/common/EmptyState'
import { ROUTES } from '../../constants'

const BookingsTab = ({ bookings, onCancel }) => (
  <div className="card border-0 shadow-sm rounded-4">
    <div className="card-body p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h6 className="fw-bold mb-0">All Bookings ({bookings.length})</h6>
        <Link to={ROUTES.BOOKING} className="btn btn-primary btn-sm rounded-pill px-4">
          <i className="bi bi-plus me-1" />New Booking
        </Link>
      </div>
      {bookings.length === 0
        ? <EmptyState icon="calendar-x" title="No bookings yet"
            subtitle="Book your first service to get started"
            action={<Link to={ROUTES.BOOKING} className="btn btn-primary btn-sm rounded-pill">Book Now</Link>} />
        : <BookingTable bookings={bookings} onCancel={onCancel} />
      }
    </div>
  </div>
)

export default BookingsTab
