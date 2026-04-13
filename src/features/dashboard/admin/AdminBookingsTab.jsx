import { useState, useEffect } from 'react'
import useAsync from '../../../hooks/useAsync'
import { getAllBookings } from '../../../api/adminApi'
import DataTable from '../DataTable'
import StatusBadge from '../../../components/common/StatusBadge'
import { BOOKING_STATUS_FILTERS } from '../../../constants'
import { changeStatus as apiChangeStatus } from '../../../services/bookingService'
import { useToast } from '../../../context/ToastContext'
import Button from '../../../components/ui/Button'

const COLUMNS = [
  { key: 'id',           label: 'Booking ID',  render: v => <span className="text-muted small fw-mono">#{v}</span> },
  { key: 'customer_name', label: 'Customer',    render: v => <span className="fw-semibold">{v}</span> },
  { key: 'service_name', label: 'Service',     render: v => <span className="fw-semibold">{v}</span> },
  { key: 'technician_name', label: 'Technician',  hideOnMobile: true, render: v => v || <span className="text-muted">Not assigned</span> },
  { key: 'booking_date', label: 'Date',        hideOnMobile: true, render: (v, row) => <span className="text-muted small">{v} {row.booking_time}</span> },
  { key: 'total_amount', label: 'Amount',      render: v => <span className="fw-semibold text-primary">৳{v}</span> },
  { key: 'status',       label: 'Status',      render: v => <StatusBadge status={v} /> },
  { key: 'actions',      label: 'Actions',     render: () => null }, // Will be replaced dynamically
]

const AdminBookingActions = ({ booking, onUpdate }) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (newStatus) => {
    setLoading(true)
    try {
      await apiChangeStatus(booking.id, newStatus)
      toast.success('Booking status updated.')
      onUpdate() // Reload bookings
    } catch (err) {
      toast.error(err?.message || 'Failed to update booking')
    } finally {
      setLoading(false)
    }
  }

  if (booking.status === 'pending') return (
    <div className="d-flex gap-1">
      <button 
        className="btn btn-xs btn-outline-success rounded-pill px-2 py-0"
        style={{ fontSize: '0.72rem' }}
        onClick={() => handleStatusChange('confirmed')}
        disabled={loading}
      >
        Confirm
      </button>
      <button 
        className="btn btn-xs btn-outline-danger rounded-pill px-2 py-0"
        style={{ fontSize: '0.72rem' }}
        onClick={() => handleStatusChange('cancelled')}
        disabled={loading}
      >
        Cancel
      </button>
    </div>
  )
  if (booking.status === 'confirmed') return (
    <button 
      className="btn btn-xs btn-outline-success rounded-pill px-2 py-0"
      style={{ fontSize: '0.72rem' }}
      onClick={() => handleStatusChange('completed')}
      disabled={loading}
    >
      Mark Done
    </button>
  )
  return <span className="text-muted small">—</span>
}

const AdminBookingsTab = () => {
  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState('all')
  const { run, loading } = useAsync()

  // Fetch all bookings on mount
  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = () => run(async () => {
    const response = await getAllBookings()
    setBookings(response.data || [])
  })

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  // Create columns with onUpdate callback
  const columnsWithActions = COLUMNS.map(col => {
    if (col.label === 'Actions') {
      return {
        ...col,
        render: (v, row) => <AdminBookingActions booking={row} onUpdate={loadBookings} />
      }
    }
    return col
  })

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h6 className="fw-bold mb-0">All Bookings</h6>
          <p className="text-muted small mb-0">{filtered.length} bookings</p>
        </div>
        <Button variant="outline-secondary" onClick={loadBookings} disabled={loading}>
          <i className="bi bi-arrow-clockwise me-2" />Refresh
        </Button>
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
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mb-0">Loading bookings...</p>
            </div>
          ) : (
            <DataTable 
              columns={columnsWithActions} 
              rows={filtered} 
              emptyMsg="No bookings match this filter" 
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminBookingsTab
