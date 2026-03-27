import { formatDate } from '../../utils/formatters'

/**
 * ActivityFeed
 *
 * Vertical timeline of recent activity items.
 * Reused in customer, technician, and admin dashboards.
 *
 * Props:
 *   items — [{ id, icon, iconBg, iconColor, title, subtitle, time, badge? }]
 */
const ActivityFeed = ({ items = [] }) => {
  if (!items.length) return (
    <div className="text-center py-4 text-muted small">
      <i className="bi bi-clock-history d-block mb-2 fs-4" />
      No recent activity
    </div>
  )

  return (
    <div className="activity-feed">
      {items.map((item, i) => (
        <div key={item.id || i} className="activity-item d-flex gap-3">
          {/* Icon */}
          <div className="activity-icon flex-shrink-0">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 36, height: 36, background: item.iconBg || '#dbeafe' }}
              aria-hidden="true"
            >
              <i className={`bi bi-${item.icon}`} style={{ color: item.iconColor || '#2563eb', fontSize: '0.85rem' }} />
            </div>
            {i < items.length - 1 && <div className="activity-line" />}
          </div>

          {/* Content */}
          <div className="pb-4 flex-grow-1 min-w-0">
            <div className="d-flex align-items-start justify-content-between gap-2">
              <div>
                <div className="fw-semibold small">{item.title}</div>
                {item.subtitle && (
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>{item.subtitle}</div>
                )}
              </div>
              <div className="d-flex flex-column align-items-end gap-1 flex-shrink-0">
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                  {item.time ? formatDate(item.time) : ''}
                </span>
                {item.badge && (
                  <span className={`badge badge-${item.badge.type} rounded-pill`} style={{ fontSize: '0.68rem' }}>
                    {item.badge.label}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ActivityFeed
