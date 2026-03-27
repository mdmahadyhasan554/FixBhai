/**
 * StatGrid
 *
 * Renders a responsive row of gradient stat cards.
 * Reused by all three dashboards.
 *
 * Props:
 *   cards  — [{ key, label, icon, gradient }]
 *   stats  — { [key]: value }
 *   cols   — Bootstrap col class (default: 'col-6 col-lg-3')
 */
const StatGrid = ({ cards = [], stats = {}, cols = 'col-6 col-lg-3' }) => (
  <div className="row g-3 mb-4">
    {cards.map(card => (
      <div key={card.key} className={cols}>
        <div
          className="rounded-4 p-4 text-white d-flex align-items-center justify-content-between"
          style={{ background: card.gradient }}
        >
          <div>
            <div className="small mb-1" style={{ opacity: 0.85 }}>{card.label}</div>
            <div className="fw-bold" style={{ fontSize: '1.75rem', lineHeight: 1 }}>
              {stats[card.key] ?? '—'}
            </div>
          </div>
          <div
            className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.2)' }}
            aria-hidden="true"
          >
            <i className={`bi bi-${card.icon} fs-4`} />
          </div>
        </div>
      </div>
    ))}
  </div>
)

export default StatGrid
