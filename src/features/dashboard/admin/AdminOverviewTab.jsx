import { Link } from 'react-router-dom'
import StatGrid from '../StatGrid'
import DataTable from '../DataTable'
import ActivityFeed from '../ActivityFeed'
import StatusBadge from '../../../components/common/StatusBadge'
import { ADMIN_STAT_CARDS, ROUTES } from '../../../constants'
import { TECHNICIANS } from '../../../api/data'

const AdminOverviewTab = ({ bookings, adminStats }) => {
  // Recent bookings table columns
  const bookingCols = [
    { key: 'id',         label: 'ID',          render: v => <span className="text-muted small">{v}</span> },
    { key: 'service',    label: 'Service',      render: v => <span className="fw-semibold">{v}</span> },
    { key: 'technician', label: 'Technician',   hideOnMobile: true },
    { key: 'date',       label: 'Date',         hideOnMobile: true, render: v => <span className="text-muted small">{v}</span> },
    { key: 'amount',     label: 'Amount',       render: v => <span className="fw-semibold text-primary">₹{v}</span> },
    { key: 'status',     label: 'Status',       render: v => <StatusBadge status={v} /> },
  ]

  // Top technicians table columns
  const techCols = [
    { key: 'name',       label: 'Name',         render: (v, row) => (
      <div className="d-flex align-items-center gap-2">
        <img src={row.avatar} alt={v} className="rounded-circle" width={32} height={32} style={{ objectFit: 'cover' }} />
        <span className="fw-semibold small">{v}</span>
      </div>
    )},
    { key: 'service',    label: 'Service',      hideOnMobile: true },
    { key: 'rating',     label: 'Rating',       render: v => <span className="fw-semibold text-warning">★ {v}</span> },
    { key: 'reviews',    label: 'Reviews',      hideOnMobile: true, render: v => <span className="text-muted small">{v}</span> },
    { key: 'available',  label: 'Status',       render: v => <StatusBadge status={v ? 'confirmed' : 'cancelled'} /> },
  ]

  const activity = bookings.slice(0, 6).map(b => ({
    id: b.id, icon: 'calendar-check', iconBg: '#dbeafe', iconColor: '#2563eb',
    title: `${b.service} booked`, subtitle: b.technician, time: b.date,
    badge: { type: 'info', label: b.status },
  }))

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h6 className="fw-bold mb-1">Platform Overview</h6>
          <p className="text-muted small mb-0">Real-time metrics across all services</p>
        </div>
        <div className="d-flex gap-2">
          <Link to={ROUTES.SERVICES} className="btn btn-sm btn-outline-primary rounded-pill">
            <i className="bi bi-tools me-1" />Services
          </Link>
          <Link to={ROUTES.TECHNICIANS} className="btn btn-sm btn-primary rounded-pill">
            <i className="bi bi-people me-1" />Technicians
          </Link>
        </div>
      </div>

      <StatGrid cards={ADMIN_STAT_CARDS} stats={adminStats} />

      <div className="row g-4">
        {/* Recent bookings */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Recent Bookings</h6>
                <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill">
                  {bookings.length} total
                </span>
              </div>
              <DataTable columns={bookingCols} rows={bookings.slice(0, 6)} emptyMsg="No bookings yet" />
            </div>
          </div>
        </div>

        {/* Activity */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Live Activity</h6>
              <ActivityFeed items={activity} />
            </div>
          </div>
        </div>
      </div>

      {/* Top technicians */}
      <div className="card border-0 shadow-sm rounded-4 mt-4">
        <div className="card-body p-4">
          <h6 className="fw-bold mb-3">Top Technicians</h6>
          <DataTable columns={techCols} rows={TECHNICIANS} emptyMsg="No technicians" />
        </div>
      </div>
    </>
  )
}

export default AdminOverviewTab
