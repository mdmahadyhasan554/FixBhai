import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import ServiceGrid from '../features/services/ServiceGrid'
import SectionHeader from '../components/common/SectionHeader'
import EmptyState from '../components/common/EmptyState'
import useFilter from '../hooks/useFilter'
import { SERVICES } from '../api/data'
import { SERVICE_CATEGORIES } from '../constants'
import { capitalize } from '../utils/formatters'

// Filter + sort logic — pure functions, easy to test
const filterFn = (item, filters, query) => {
  const matchQ = item.name.toLowerCase().includes(query.toLowerCase())
  const matchC = !filters.category || filters.category === 'All' || item.category === filters.category
  return matchQ && matchC
}

const ServicesPage = () => {
  const [params] = useSearchParams()
  const { result, query, setQuery, filters, setFilters } = useFilter(
    SERVICES,
    filterFn,
    null,
  )

  // Initialise query from URL on first render
  useCallback(() => {
    const q = params.get('q')
    if (q) setQuery(q)
  }, [])

  const activeCategory = filters.category || 'All'

  return (
    <div className="container py-5">
      <SectionHeader title="All Services" subtitle="Find the right service for your home" />

      <div className="input-group mb-4">
        <span className="input-group-text bg-white border-end-0">
          <i className="bi bi-search text-muted" />
        </span>
        <input
          type="text"
          className="form-control border-start-0 ps-0"
          placeholder="Search services..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {/* Category pills */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {SERVICE_CATEGORIES.map(c => (
          <button key={c}
            className={`btn btn-sm rounded-pill ${activeCategory === c ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFilters({ category: c })}>
            {capitalize(c)}
          </button>
        ))}
      </div>

      {result.length
        ? <ServiceGrid services={result} />
        : <EmptyState icon="search" title={`No services found for "${query}"`} />
      }
    </div>
  )
}

export default ServicesPage
