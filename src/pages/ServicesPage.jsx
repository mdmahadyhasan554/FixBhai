import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ServiceGrid from '../features/services/ServiceGrid'
import ServiceSearch from '../features/services/ServiceSearch'
import { SERVICES } from '../api/data'

const CATEGORIES = ['All', 'appliance', 'plumbing', 'electrical', 'cleaning', 'painting', 'carpentry', 'pest', 'security']

const ServicesPage = () => {
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [category, setCategory] = useState('All')

  const filtered = SERVICES.filter(s => {
    const matchQ = s.name.toLowerCase().includes(query.toLowerCase())
    const matchC = category === 'All' || s.category === category
    return matchQ && matchC
  })

  return (
    <div className="container py-5">
      <div className="mb-5">
        <h2 className="section-title mb-1">All Services</h2>
        <p className="section-sub">Find the right service for your home</p>
      </div>
      <ServiceSearch onSearch={setQuery} />
      <div className="d-flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map(c => (
          <button key={c} className={`btn btn-sm rounded-pill ${category === c ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setCategory(c)}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>
      {filtered.length ? (
        <ServiceGrid services={filtered} />
      ) : (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-search fs-1 d-block mb-2" />
          No services found for "{query}"
        </div>
      )}
    </div>
  )
}

export default ServicesPage
