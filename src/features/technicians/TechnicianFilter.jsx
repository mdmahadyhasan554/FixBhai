import Card from '../../components/ui/Card'
import {
  TECH_SERVICES,
  TECH_AVAILABILITY,
  TECH_SORT_OPTIONS,
} from '../../constants'

/**
 * TechnicianFilter
 *
 * Fully controlled filter + sort bar.
 *
 * Props:
 *   filters   — { service, available, sort }
 *   onChange  — called with updated filters object
 *   onReset   — called when "Clear filters" is clicked
 *
 * All option lists come from constants — nothing hardcoded here.
 */
const TechnicianFilter = ({ filters = {}, onChange, onReset }) => {
  const update = (key, value) => onChange({ ...filters, [key]: value })

  const isDirty =
    (filters.service   && filters.service   !== 'All') ||
    (filters.available && filters.available !== 'all') ||
    (filters.sort      && filters.sort      !== 'rating')

  return (
    <Card bordered className="mb-4">
      <Card.Body className="p-3">
        <div className="row g-3 align-items-end">

          {/* Service filter */}
          <div className="col-12 col-sm-6 col-lg-3">
            <FilterSelect
              label="Service"
              icon="tools"
              value={filters.service || 'All'}
              onChange={v => update('service', v)}
            >
              {TECH_SERVICES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </FilterSelect>
          </div>

          {/* Availability filter */}
          <div className="col-12 col-sm-6 col-lg-3">
            <FilterSelect
              label="Availability"
              icon="circle-fill"
              value={filters.available || 'all'}
              onChange={v => update('available', v)}
            >
              {TECH_AVAILABILITY.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </FilterSelect>
          </div>

          {/* Sort */}
          <div className="col-12 col-sm-6 col-lg-3">
            <FilterSelect
              label="Sort By"
              icon="sort-down"
              value={filters.sort || 'rating'}
              onChange={v => update('sort', v)}
            >
              {TECH_SORT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </FilterSelect>
          </div>

          {/* Price range */}
          <div className="col-12 col-sm-6 col-lg-3">
            <label className="form-label small fw-semibold text-muted mb-1">
              <i className="bi bi-currency-rupee me-1" aria-hidden="true" />
              Max Price
            </label>
            <div className="d-flex align-items-center gap-2">
              <input
                type="range"
                className="form-range flex-grow-1"
                min={100}
                max={1000}
                step={50}
                value={filters.maxPrice || 1000}
                onChange={e => update('maxPrice', Number(e.target.value))}
                aria-label="Maximum price filter"
              />
              <span
                className="badge bg-primary bg-opacity-10 text-primary rounded-pill fw-semibold flex-shrink-0"
                style={{ minWidth: 56, textAlign: 'center' }}
              >
                ৳{filters.maxPrice || 1000}
              </span>
            </div>
          </div>

        </div>

        {/* Active filter chips + clear */}
        {isDirty && (
          <div className="d-flex flex-wrap align-items-center gap-2 mt-3 pt-3"
            style={{ borderTop: '1px solid #f1f5f9' }}>
            <span className="text-muted small">Active filters:</span>

            {filters.service && filters.service !== 'All' && (
              <ActiveChip
                label={filters.service}
                onRemove={() => update('service', 'All')}
              />
            )}
            {filters.available && filters.available !== 'all' && (
              <ActiveChip
                label={TECH_AVAILABILITY.find(a => a.value === filters.available)?.label}
                onRemove={() => update('available', 'all')}
              />
            )}
            {filters.sort && filters.sort !== 'rating' && (
              <ActiveChip
                label={TECH_SORT_OPTIONS.find(s => s.value === filters.sort)?.label}
                onRemove={() => update('sort', 'rating')}
              />
            )}

            <button
              className="btn btn-sm btn-outline-danger rounded-pill ms-auto px-3"
              onClick={onReset}
              aria-label="Clear all filters"
            >
              <i className="bi bi-x-circle me-1" aria-hidden="true" />
              Clear all
            </button>
          </div>
        )}

      </Card.Body>
    </Card>
  )
}

// ── Sub-components ────────────────────────────────────────

const FilterSelect = ({ label, icon, value, onChange, children }) => (
  <div>
    <label className="form-label small fw-semibold text-muted mb-1">
      {icon && <i className={`bi bi-${icon} me-1`} aria-hidden="true" />}
      {label}
    </label>
    <select
      className="form-select form-select-sm rounded-3"
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-label={label}
    >
      {children}
    </select>
  </div>
)

const ActiveChip = ({ label, onRemove }) => (
  <span className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill small fw-medium"
    style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: '0.78rem' }}>
    {label}
    <button
      type="button"
      className="btn-close btn-close-sm ms-1"
      style={{ fontSize: '0.55rem' }}
      onClick={onRemove}
      aria-label={`Remove ${label} filter`}
    />
  </span>
)

export default TechnicianFilter
