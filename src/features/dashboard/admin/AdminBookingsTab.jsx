import { useState } from 'react'
import DataTable from '../DataTable'
import StatusBadge from '../../../components/common/StatusBadge'
import { useBooking } from '../../../context/BookingContext'
import { BOOKING_STATUS_FILTERS } from '../../../constants'

const COLUMNS = [
  { key: 'id',         label: 'Booking ID',  render: v => <span className="text-muted small fw-mono">{v}</span> },
  { key: 'service',    label: 'Service',     render: v => <span className="fw-semibold">{v}</span> },
  { key: 'technician', label: 'Technician',  hideOnMobile: true },
  { key: 'date',       label: 'Date',        hideOnMobile: true, render: (v, row) => <span className="text-muted small">{v} {row.time}</span> },
  { key: 'amount',     label: 'Amount',      render: v => <span className="fw-semibold text-primary">৳{v}</span> },
  { key: 'status',     label: 'Status',      render: v => <StatusBadge status={v} /> },
  { key: 'id',         label: 'Actions',     render: (v, row) => <AdminBookingActions booking={row} /> },
]

const AdminBookingActions = ({ booking }) => {
  const { updateStatus } = useBooking()
  if (booking.status === 'pending') return (
    <div className="d-flex gap-1">
      <button className="btn btn-xs btn-outline-success rounded-pill px-2 py-0"
        style={{ fontSize: '0.72rem' }}
        onClick={() => updateStatus(booking.id, 'confirmed')}>Confirm</button>
      <button className="btn btn-xs btn-outline-danger rounded-pill px-2 py-0"
        style={{ fontSize: '0.72rem' }}
        onClick={() => updateStatus(booking.id, 'cancelled')}>Cancel</button>
    </div>
  )
  if (booking.status === 'confirmed') return (
    <button className="btn btn-xs btn-outline-success rounded-pill px-2 py-0"
      style={{ fontSize: '0.72rem' }}
      onClick={() => updateStatus(booking.id, 'completed')}>Mark Done</button>
  )
  return <span className="text-muted small">—</span>
}

const AdminBookingsTab = () => {
  const { bookings } = useBooking()
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h6 className="fw-bold mb-0">All Bookings</h6>
          <p className="text-muted small mb-0">{filtered.length} bookings</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4" role="tablist">
        {BOOKING_STATUS_FILTERS.map(({ value, label }) => (
          <button key={value} role="tab" aria-selected={filter === value}
            className={`btn btn-sm rounded-pill ${filter === value ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFilter(value)}>
            {label}
            <span className={`badge rounded-pill ms-2 ${filter === value ? 'bg-white text-primary' : 'bg-secondary bg-opacity-25 text-secondary'}`}
              style={{ fontSize: '0.68rem' }}>
              {value === 'all' ? bookings.length : bookings.filter(b => b.status === value).length}
            </span>
          </button>
        ))}
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-0">
          <DataTable columns={COLUMNS} rows={filtered} emptyMsg="No bookings match this filter" />
        </div>
      </div>
    </div>
  )
}

export default AdminBookingsTab
