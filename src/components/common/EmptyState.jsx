/**
 * Reusable empty / no-results state.
 */
const EmptyState = ({ icon = 'inbox', title = 'Nothing here', subtitle, action }) => (
  <div className="text-center py-5 text-muted">
    <i className={`bi bi-${icon} fs-1 d-block mb-2`} />
    <p className="fw-semibold mb-1">{title}</p>
    {subtitle && <p className="small mb-3">{subtitle}</p>}
    {action && <div>{action}</div>}
  </div>
)

export default EmptyState
