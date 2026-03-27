import BookingForm from '../features/bookings/BookingForm'

const BookingPage = () => (
  <div className="container py-5">
    <div className="mb-4">
      <h2 className="section-title mb-1">Book a Service</h2>
      <p className="section-sub">Schedule a visit from our expert technicians</p>
    </div>
    <div className="row justify-content-center">
      <div className="col-lg-9">
        <BookingForm />
      </div>
    </div>
  </div>
)

export default BookingPage
