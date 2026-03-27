import { HOME_STATS } from '../../constants'

const STAT_COLOURS = ['#dbeafe', '#d1fae5', '#fef3c7', '#ede9fe']
const ICON_COLOURS = ['#2563eb', '#059669', '#d97706', '#7c3aed']

/**
 * StatsBar
 * Four-column animated trust metrics strip.
 */
const StatsBar = () => (
  <section className="py-5 bg-white" aria-label="Platform statistics">
    <div className="container">
      <div className="row g-4 justify-content-center">
        {HOME_STATS.map(({ value, label, icon }, i) => (
          <div key={label} className="col-6 col-md-3 text-center">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
              style={{ width: 56, height: 56, background: STAT_COLOURS[i] }}
              aria-hidden="true"
            >
              <i className={`bi bi-${icon}`} style={{ fontSize: '1.5rem', color: ICON_COLOURS[i] }} />
            </div>
            <div className="fw-bold mb-1" style={{ fontSize: '2rem', color: '#1e293b' }}>{value}</div>
            <div className="text-muted small">{label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default StatsBar
