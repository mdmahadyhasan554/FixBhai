import { useRef } from 'react'
import { SERVICE_CATEGORIES } from '../../constants'
import { capitalize } from '../../utils/formatters'

/**
 * ServiceSearch
 *
 * Fully controlled search bar + category filter pills.
 *
 * Props:
 *   query          — current search string (controlled)
 *   onQueryChange  — called with new string on every keystroke
 *   category       — active category filter (controlled)
 *   onCategoryChange — called with new category string
 *   onSubmit       — optional form submit handler
 *   placeholder    — input placeholder text
 *   showCategories — show/hide category pills (default: true)
 *   resultCount    — if provided, shows "X results" label
 */
const ServiceSearch = ({
  query            = '',
  onQueryChange,
  category         = 'All',
  onCategoryChange,
  onSubmit,
  placeholder      = 'Search services — AC repair, plumbing, cleaning...',
  showCategories   = true,
  resultCount,
}) => {
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.(query)
  }

  const handleClear = () => {
    onQueryChange('')
    inputRef.current?.focus()
  }

  return (
    <div className="service-search">

      {/* Search input */}
      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="Search services"
        className="mb-3"
      >
        <div className="input-group input-group-lg shadow-sm" style={{ borderRadius: 14 }}>

          {/* Search icon */}
          <span
            className="input-group-text bg-white border-end-0 ps-3"
            style={{ borderRadius: '14px 0 0 14px', borderColor: '#e2e8f0' }}
            aria-hidden="true"
          >
            <i className="bi bi-search text-muted" />
          </span>

          {/* Input */}
          <input
            ref={inputRef}
            type="search"
            className="form-control border-start-0 border-end-0 px-2"
            style={{ borderColor: '#e2e8f0', fontSize: '0.95rem' }}
            placeholder={placeholder}
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            aria-label="Search services"
            autoComplete="off"
          />

          {/* Clear button — only when there's a query */}
          {query && (
            <button
              type="button"
              className="input-group-text bg-white border-start-0 border-end-0 px-2"
              style={{ borderColor: '#e2e8f0', cursor: 'pointer' }}
              onClick={handleClear}
              aria-label="Clear search"
            >
              <i className="bi bi-x-circle text-muted" />
            </button>
          )}

          {/* Search button */}
          <button
            type="submit"
            className="btn btn-primary px-4 fw-semibold"
            style={{ borderRadius: '0 14px 14px 0' }}
            aria-label="Submit search"
          >
            Search
          </button>
        </div>
      </form>

      {/* Category pills + result count row */}
      {(showCategories || resultCount !== undefined) && (
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">

          {/* Category pills */}
          {showCategories && (
            <div
              className="d-flex flex-wrap gap-2"
              role="group"
              aria-label="Filter by category"
            >
              {SERVICE_CATEGORIES.map(cat => {
                const isActive = category === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    className={`btn btn-sm rounded-pill px-3 ${
                      isActive
                        ? 'btn-primary'
                        : 'btn-outline-secondary'
                    }`}
                    onClick={() => onCategoryChange?.(cat)}
                    aria-pressed={isActive}
                    aria-label={`Filter by ${cat}`}
                  >
                    {cat === 'All'
                      ? <><i className="bi bi-grid me-1" aria-hidden="true" />All</>
                      : capitalize(cat)
                    }
                  </button>
                )
              })}
            </div>
          )}

          {/* Result count */}
          {resultCount !== undefined && (
            <span className="text-muted small ms-auto" aria-live="polite" aria-atomic="true">
              {resultCount} service{resultCount !== 1 ? 's' : ''} found
            </span>
          )}
        </div>
      )}

    </div>
  )
}

export default ServiceSearch
