import StatGrid from '../StatGrid'
import DataTable from '../DataTable'
import ActivityFeed from '../ActivityFeed'
import StatusBadge from '../../../components/common/StatusBadge'
import { TECH_STAT_CARDS } from '../../../constants'
import { TECHNICIANS } from '../../../api/data'

const JOB_COLS = [
  { key: 'id',      label: 'Job ID',   render: v => <span className="text-muted small">{v}</span> },
  { key: 'service', label: 'Service',  render: v => <span className="fw-semibold">{v}</span> },
  { key: 'date',    label: 'Date',     hideOnMobile: true, render: (v, row) => <span className="text-muted small">{v} {row.time}</span> },
  { key: 'amount',  label: 'Earnings', render: v => <span className="fw-semibold text-success">৳{v}</span> },
  { key: 'status',  label: 'Status',   render: v => <StatusBadge status={v} /> },
]

const TechOverviewTab = ({ user, bookings, techStats }) => {
  const activity = bookings.slice(0, 5).map(b => ({
    id: b.id, icon: 'briefcase', iconBg: '#d1fae5', iconColor: '#059669',
    title: b.service, subtitle: b.date + ' · ' + b.time, time: b.date,
    badge: { type: 'success', label: b.status },
  }))

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h6 className="fw-bold mb-1">Welcome back, {user?.name} 👋</h6>
          <p className="text-muted small mb-0">Here's your job summary for today</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-success rounded-pill px-3 py-2">
            <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }} />
            Available
          </span>
        </div>
      </div>

      <StatGrid cards={TECH_STAT_CARDS} stats={techStats} />

      <div className="row g-4">
        {/* Assigned jobs */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Assigned Jobs</h6>
              <DataTable columns={JOB_COLS} rows={bookings.slice(0, 5)} emptyMsg="No jobs assigned yet" />
            </div>
          </div>
        </div>

        {/* Activity */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Recent Activity</h6>
              <ActivityFeed items={activity} />
            </div>
          </div>
        </div>
      </div>

      {/* Profile card */}
      <div className="card border-0 shadow-sm rounded-4 mt-4">
        <div className="card-body p-4">
          <h6 className="fw-bold mb-3">My Profile</h6>
          {TECHNICIANS.slice(0, 1).map(tech => (
            <div key={tech.id} className="d-flex align-items-center gap-4 flex-wrap">
              <img src={tech.avatar} alt={tech.name} className="rounded-circle"
                width={72} height={72} style={{ objectFit: 'cover', border: '3px solid #dbeafe' }} />
              <div className="flex-grow-1">
                <div className="row g-3">
                  {[
                    { label: 'Service',    value: tech.service    },
                    { label: 'Experience', value: tech.experience },
                    { label: 'Location',   value: tech.location   },
                    { label: 'Rating',     value: `★ ${tech.rating} (${tech.reviews} reviews)` },
                  ].map(f => (
                    <div key={f.label} className="col-6 col-md-3">
                      <div className="text-muted small">{f.label}</div>
                      <div className="fw-semibold small">{f.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default TechOverviewTab
