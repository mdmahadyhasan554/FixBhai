import TechnicianList from '../features/technicians/TechnicianList'
import TechnicianFilter from '../features/technicians/TechnicianFilter'
import SectionHeader from '../components/common/SectionHeader'
import useFilter from '../hooks/useFilter'
import { TECHNICIANS } from '../api/data'

// ── Pure filter function ──────────────────────────────────
const filterFn = (tech, filters, query) => {
  const matchService  = !filters.service   || filters.service   === 'All' || tech.service === filters.service
  const matchAvail    = !filters.available || filters.available === 'all'
    || (filters.available === 'available' ? tech.available : !tech.available)
  const matchPrice    = !filters.maxPrice  || tech.price <= filters.maxPrice
  const matchQuery    = tech.name.toLowerCase().includes(query.toLowerCase())
    || tech.service.toLowerCase().includes(query.toLowerCase())
    || tech.location.toLowerCase().includes(query.toLowerCase())
  return matchService && matchAvail && matchPrice && matchQuery
}

// ── Pure sort function ────────────────────────────────────
const sortFn = (a, b, key) => {
  if (key === 'rating')     return b.rating  - a.rating
  if (key === 'price_asc')  return a.price   - b.price
  if (key === 'price_desc') return b.price   - a.price
  if (key === 'experience') return parseInt(b.experience) - parseInt(a.experience)
  if (key === 'reviews')    return b.reviews - a.reviews
  return 0
}

const DEFAULT_FILTERS = { service: 'All', available: 'all', sort: 'rating', maxPrice: 1000 }

const TechniciansPage = () => {
  const { result, query, setQuery, filters, setFilters, sortKey, setSortKey } =
    useFilter(TECHNICIANS, filterFn, sortFn)

  // Merge sort key into filters object for TechnicianFilter
  const mergedFilters = { ...filters, sort: sortKey || 'rating' }

  const handleFilterChange = ({ sort, ...rest }) => {
    setFilters(rest)
    setSortKey(sort)
  }

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS)
    setSortKey('rating')
    setQuery('')
  }

  return (
    <div className="container py-5">
      <SectionHeader
        title="Our Technicians"
        subtitle="Verified experts for every home service"
      />

      {/* Search bar */}
      <div className="input-group mb-4" style={{ maxWidth: 480 }}>
        <span className="input-group-text bg-white border-end-0">
          <i className="bi bi-search text-muted" aria-hidden="true" />
        </span>
        <input
          type="search"
          className="form-control border-start-0 ps-1"
          placeholder="Search by name, service or location..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search technicians"
        />
        {query && (
          <button
            className="input-group-text bg-white border-start-0"
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            <i className="bi bi-x-circle text-muted" />
          </button>
        )}
      </div>

      {/* Filter bar */}
      <TechnicianFilter
        filters={mergedFilters}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Results */}
      <TechnicianList technicians={result} showCount />
    </div>
  )
}

export default TechniciansPage
