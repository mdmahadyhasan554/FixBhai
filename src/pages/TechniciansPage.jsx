import TechnicianList   from '../features/technicians/TechnicianList'
import TechnicianFilter from '../features/technicians/TechnicianFilter'
import TechnicianSearch from '../features/technicians/TechnicianSearch'
import PageHeader       from '../components/common/PageHeader'
import useFilter        from '../hooks/useFilter'
import { TECHNICIANS }  from '../api/data'

// Pure filter — no UI coupling
const filterFn = (tech, filters, query) => {
  const matchService = !filters.service  || filters.service  === 'All' || tech.service === filters.service
  const matchAvail   = !filters.available || filters.available === 'all'
    || (filters.available === 'available' ? tech.available : !tech.available)
  const matchPrice   = !filters.maxPrice || tech.price <= filters.maxPrice
  const matchQuery   = tech.name.toLowerCase().includes(query.toLowerCase())
    || tech.service.toLowerCase().includes(query.toLowerCase())
    || tech.location.toLowerCase().includes(query.toLowerCase())
  return matchService && matchAvail && matchPrice && matchQuery
}

// Pure sort — no UI coupling
const sortFn = (a, b, key) => {
  if (key === 'rating')     return b.rating  - a.rating
  if (key === 'price_asc')  return a.price   - b.price
  if (key === 'price_desc') return b.price   - a.price
  if (key === 'experience') return parseInt(b.experience) - parseInt(a.experience)
  if (key === 'reviews')    return b.reviews - a.reviews
  return 0
}

const DEFAULT_FILTERS = { service: 'All', available: 'all', maxPrice: 1000 }

/**
 * TechniciansPage
 * Assembles TechnicianSearch + TechnicianFilter + TechnicianList.
 * Contains zero UI markup.
 */
const TechniciansPage = () => {
  const { result, query, setQuery, filters, setFilters, sortKey, setSortKey } =
    useFilter(TECHNICIANS, filterFn, sortFn)

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
      <PageHeader
        title="Our Technicians"
        subtitle="Verified experts for every home service"
      />
      <TechnicianSearch value={query} onChange={setQuery} />
      <TechnicianFilter
        filters={{ ...filters, sort: sortKey || 'rating' }}
        onChange={handleFilterChange}
        onReset={handleReset}
      />
      <TechnicianList technicians={result} showCount />
    </div>
  )
}

export default TechniciansPage
