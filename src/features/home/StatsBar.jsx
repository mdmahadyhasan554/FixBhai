import { HOME_STATS } from '../../constants'

/**
 * StatsBar
 * Four-column trust metrics strip below the hero.
 */
const StatsBar = () => (
  <section className="py-4 bg-white border-bottom" aria-label="Platform statistics">
    <div className="container">
      <div className="row g-3 text-center">
        {HOME_STATS.map(({ value, label, icon }) => (
          <div key={label} className="col-6 col-md-3">
            <i className={`bi bi-${icon} text-primary d-block mb-1`} aria-hidden="true" />
            <div className="fw-bold fs-3 text-primary">{value}</div>
            <div className="text-muted small">{label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default StatsBar
