import StatusBadge from '../../components/common/StatusBadge'

const BookingTable = ({ bookings, onCancel }) => (
  <div className="table-responsive">
    <table className="table table-hover align-middle mb-0">
      <thead className="table-light">
        <tr>
          <th className="border-0">ID</th>
          <th className="border-0">Service</th>
          <th className="border-0 d-none d-md-table-cell">Technician</th>
          <th className="border-0 d-none d-md-table-cell">Date & Time</th>
          <th className="border-0">Amount</th>
          <th className="border-0">Status</th>
          <th className="border-0">Action</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map(b => (
          <tr key={b.id}>
            <td><span className="text-muted small">{b.id}</span></td>
            <td><span className="fw-semibold">{b.service}</span></td>
            <td className="d-none d-md-table-cell text-muted small">{b.technician}</td>
            <td className="d-none d-md-table-cell text-muted small">{b.date} {b.time}</td>
            <td className="fw-semibold text-primary">₹{b.amount}</td>
            <td><StatusBadge status={b.status} /></td>
            <td><BookingAction booking={b} onCancel={onCancel} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const BookingAction = ({ booking, onCancel }) => {
  if (booking.status === 'pending')
    return (
      <button className="btn btn-sm btn-outline-danger rounded-pill"
        onClick={() => onCancel(booking.id)}>Cancel</button>
    )
  if (booking.status === 'confirmed')
    return <span className="text-muted small">Scheduled</span>
  if (booking.status === 'completed')
    return (
      <button className="btn btn-sm btn-outline-warning rounded-pill">
        <i className="bi bi-star me-1" />Rate
      </button>
    )
  return <span className="text-muted small">—</span>
}

export default BookingTable
