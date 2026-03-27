/**
 * PageHeader
 *
 * Standard page-level heading block used at the top of content pages.
 *
 * Props:
 *   title    — main heading
 *   subtitle — supporting text
 *   action   — optional ReactNode (e.g. a button) rendered on the right
 */
const PageHeader = ({ title, subtitle, action }) => (
  <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
    <div>
      <h2 className="section-title mb-1">{title}</h2>
      {subtitle && <p className="section-sub mb-0">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
)

export default PageHeader
