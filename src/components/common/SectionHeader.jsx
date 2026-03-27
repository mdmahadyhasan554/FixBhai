/**
 * Reusable section heading used across all pages.
 * Optionally renders a right-side action (e.g. "View All" button).
 */
const SectionHeader = ({ title, subtitle, action }) => (
  <div className="d-flex justify-content-between align-items-end mb-4">
    <div>
      <h2 className="section-title mb-1">{title}</h2>
      {subtitle && <p className="section-sub mb-0">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
)

export default SectionHeader
