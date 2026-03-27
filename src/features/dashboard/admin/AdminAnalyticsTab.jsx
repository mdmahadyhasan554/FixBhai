import { SERVICES } from '../../../api/data'
import { useBooking } from '../../../context/BookingContext'

/**
 * AdminAnalyticsTab
 * Service performance breakdown + booking distribution.
 */
const AdminAnalyticsTab = () => {
  const { bookings } = useBooking()

  // Count bookings per service
  const serviceStats = SERVICES.map(s => {
    const count = bookings.filter(b => b.service === s.name).length
    const revenue = bookings.filter(b => b.service === s.name && b.status === 'completed')
      .reduce((sum, b) => sum + (b.amount || 0), 0)
    return { ...s, count, revenue }
  }).sort((a, b) => b.count - a.count)

  const maxCount = Math.max(...serviceStats.map(s => s.count), 1)

  // Status distribution
  const statusDist = ['pending', 'confirmed', 'completed', 'cancelled'].map(status => ({
    status,
    count: bookings.filter(b => b.status === status).length,
    pct: bookings.length ? Math.round(bookings.filter(b => b.status === status).length / bookings.length * 100) : 0,
  }))

  const STATUS_COLOURS = { pending: '#f59e0b', confirmed: '#3b82f6', completed: '#10b981', cancelled: '#ef4444' }

  return (
    <div className="row g-4">
      {/* Service performance */}
      <div className="col-lg-7">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-body p-4">
            <h6 className="fw-bold mb-4">Service Performance</h6>
            <div className="d-flex flex-column gap-3">
              {serviceStats.map(s => (
                <div key={s.id}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-2 d-flex align-items-center justify-content-center"
                        style={{ width: 28, height: 28, background: s.color }}>
                        <i className={`bi bi-${s.icon}`} style={{ color: s.iconColor, fontSize: '0.75rem' }} />
                      </div>
                      <span className="small fw-semibold">{s.name}</span>
                    </div>
                    <div className="d-flex gap-3 text-end">
                      <span className="small text-muted">{s.count} bookings</span>
                      <span className="small fw-semibold text-primary">₹{s.revenue}</span>
                    </div>
                  </div>
                  <div className="progress rounded-pill" style={{ height: 6 }}>
                    <div className="progress-bar rounded-pill"
                      style={{ width: `${(s.count / maxCount) * 100}%`, background: s.iconColor }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status distribution */}
      <div className="col-lg-5">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-body p-4">
            <h6 className="fw-bold mb-4">Booking Status Distribution</h6>
            <div className="d-flex flex-column gap-3">
              {statusDist.map(({ status, count, pct }) => (
                <div key={status}>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="small fw-semibold text-capitalize">{status}</span>
                    <span className="small text-muted">{count} ({pct}%)</span>
                  </div>
                  <div className="progress rounded-pill" style={{ height: 8 }}>
                    <div className="progress-bar rounded-pill"
                      style={{ width: `${pct}%`, background: STATUS_COLOURS[status] }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-4 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
              <div className="row g-2 text-center">
                <div className="col-6">
                  <div className="fw-bold text-primary fs-4">{bookings.length}</div>
                  <div className="text-muted small">Total Bookings</div>
                </div>
                <div className="col-6">
                  <div className="fw-bold text-success fs-4">
                    ₹{bookings.filter(b => b.status === 'completed').reduce((s, b) => s + (b.amount || 0), 0)}
                  </div>
                  <div className="text-muted small">Total Revenue</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAnalyticsTab
