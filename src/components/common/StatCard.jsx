/**
 * Gradient stat card used in Dashboard and potentially other summary sections.
 */
const StatCard = ({ label, value, icon, gradient }) => (
  <div className="stat-card" style={{ background: gradient }}>
    <div className="d-flex justify-content-between align-items-start">
      <div>
        <div className="small mb-1" style={{ opacity: 0.85 }}>{label}</div>
        <div className="fw-bold fs-3">{value}</div>
      </div>
      <div className="rounded-3 p-2" style={{ background: 'rgba(255,255,255,0.2)' }}>
        <i className={`bi bi-${icon} fs-5`} />
      </div>
    </div>
  </div>
)

export default StatCard
