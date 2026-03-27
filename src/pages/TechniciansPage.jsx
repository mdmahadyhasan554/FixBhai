import TechnicianList from '../features/technicians/TechnicianList'
import TechnicianFilter from '../features/technicians/TechnicianFilter'
import SectionHeader from '../components/common/SectionHeader'
import useFilter from '../hooks/useFilter'
import { TECHNICIANS } from '../api/data'

// Pure filter function — separated from UI
const filterFn = (tech, filters, query) => {
  const matchS = !filters.service || filters.service === 'All' || tech.service === filters.service
  const matchA = !filters.available || filters.available === 'all'
    || (filters.available === 'available' ? tech.available : !tech.available)
  const matchQ = tech.name.toLowerCase().includes(query.toLowerCase())
    || tech.service.toLowerCase().includes(query.toLowerCase())
  return matchS && matchA && matchQ
}

// Pure sort function — separated from UI
const sortFn = (a, b, key) => {
  if (key === 'rating')     return b.rating - a.rating
  if (key === 'price_asc')  return a.price  - b.price
  if (key === 'price_desc') return b.price  - a.price
  if (key === 'experience') return parseInt(b.experience) - parseInt(a.experience)
  return 0
}

const TechniciansPage = () => {
  const { result, query, setQuery, filters, setFilters, sortKey, setSortKey } =
    useFilter(TECHNICIANS, filterFn, sortFn)

  return (
    <div className="container py-5">
      <SectionHeader title="Our Technicians" subtitle="Verified experts for every home service" />

      <div className="input-group mb-3" style={{ maxWidth: 400 }}>
        <span className="input-group-text bg-white border-end-0">
          <i className="bi bi-search text-muted" />
        </span>
        <input
          type="text"
          className="form-control border-start-0 ps-0"
          placeholder="Search by name or service..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <TechnicianFilter
        filters={{ ...filters, sort: sortKey }}
        onChange={({ sort, ...rest }) => { setFilters(rest); setSortKey(sort) }}
      />

      <p className="text-muted small mb-3">
        {result.length} technician{result.length !== 1 ? 's' : ''} found
      </p>

      <TechnicianList technicians={result} />
    </div>
  )
}

export default TechniciansPage
