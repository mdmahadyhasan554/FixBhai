/**
 * TechnicianSearch
 * Controlled search input for the technicians page.
 *
 * Props:
 *   value    — current query string
 *   onChange — called with new string on every keystroke
 */
const TechnicianSearch = ({ value, onChange }) => (
  <div className="input-group mb-4" style={{ maxWidth: 480 }}>
    <span className="input-group-text bg-white border-end-0" aria-hidden="true">
      <i className="bi bi-search text-muted" />
    </span>
    <input
      type="search"
      className="form-control border-start-0 ps-1"
      placeholder="Search by name, service or location..."
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-label="Search technicians"
    />
    {value && (
      <button
        type="button"
        className="input-group-text bg-white border-start-0"
        onClick={() => onChange('')}
        aria-label="Clear search"
      >
        <i className="bi bi-x-circle text-muted" aria-hidden="true" />
      </button>
    )}
  </div>
)

export default TechnicianSearch
