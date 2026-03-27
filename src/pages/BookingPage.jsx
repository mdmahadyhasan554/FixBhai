import BookingForm from '../features/bookings/BookingForm'
import PageHeader  from '../components/common/PageHeader'

/**
 * BookingPage
 * Assembles PageHeader + BookingForm. Contains zero UI markup.
 */
const BookingPage = () => (
  <div className="container py-5">
    <PageHeader
      title="Book a Service"
      subtitle="Schedule a visit from our expert technicians"
    />
    <div className="row justify-content-center">
      <div className="col-lg-9">
        <BookingForm />
      </div>
    </div>
  </div>
)

export default BookingPage
