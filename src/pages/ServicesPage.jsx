import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ServiceGrid   from '../features/services/ServiceGrid'
import ServiceSearch from '../features/services/ServiceSearch'
import PageHeader    from '../components/common/PageHeader'
import useFilter     from '../hooks/useFilter'
import { SERVICES }  from '../api/data'

// Pure filter — no UI coupling, lives at module level
const filterFn = (item, filters, query) => {
  const matchQ = item.name.toLowerCase().includes(query.toLowerCase())
  const matchC = !filters.category || filters.category === 'All'
    || item.category === filters.category
  return matchQ && matchC
}

/**
 * ServicesPage
 * Assembles ServiceSearch + ServiceGrid. Contains zero UI markup.
 */
const ServicesPage = () => {
  const [params] = useSearchParams()
  const { result, query, setQuery, filters, setFilters } = useFilter(SERVICES, filterFn)

  useEffect(() => {
    const q = params.get('q')
    if (q) setQuery(q)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container py-5">
      <PageHeader
        title="All Services"
        subtitle="Find the right service for your home"
      />
      <ServiceSearch
        query={query}
        onQueryChange={setQuery}
        category={filters.category || 'All'}
        onCategoryChange={cat => setFilters({ category: cat })}
        resultCount={result.length}
      />
      <ServiceGrid
        services={result}
        emptyText={query ? `No results for "${query}"` : 'No services available'}
      />
    </div>
  )
}

export default ServicesPage
