import { useState } from 'react'
import TechnicianList from '../features/technicians/TechnicianList'
import TechnicianFilter from '../features/technicians/TechnicianFilter'
import { TECHNICIANS } from '../api/data'

const TechniciansPage = () => {
  const [filters, setFilters] = useState({ service: 'All', available: 'all', sort: 'rating' })
  const [search, setSearch] = useState('')

  const filtered = TECHNICIANS
    .filter(t => {
      const matchS = filters.service === 'All' || t.service === filters.service
      const matchA = filters.available === 'all' || (filters.available === 'available' ? t.available : !t.available)
      const matchQ = t.name.toLowerCase().includes(search.toLowerCase()) || t.service.toLowerCase().includes(search.toLowerCase())
      return matchS && matchA && matchQ
    })
    .sort((a, b) => {
      if (filters.sort === 'rating') return b.rating - a.rating
      if (filters.sort === 'price_asc') return a.price - b.price
      if (filters.sort === 'price_desc') return b.price - a.price
      if (filters.sort === 'experience') return parseInt(b.experience) - parseInt(a.experience)
      return 0
    })

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="section-title mb-1">Our Technicians</h2>
        <p className="section-sub">Verified experts for every home service</p>
      </div>
      <div className="input-group mb-3" style={{ maxWidth: 400 }}>
        <span className="input-group-text bg-white"><i className="bi bi-search text-muted" /></span>
        <input className="form-control border-start-0" placeholder="Search by name or service..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <TechnicianFilter filters={filters} onChange={setFilters} />
      <p className="text-muted small mb-3">{filtered.length} technician{filtered.length !== 1 ? 's' : ''} found</p>
      <TechnicianList technicians={filtered} />
    </div>
  )
}

export default TechniciansPage
