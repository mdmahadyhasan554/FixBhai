import { useState } from 'react'

const ServiceSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="d-flex gap-2 mb-4">
      <div className="input-group">
        <span className="input-group-text bg-white border-end-0">
          <i className="bi bi-search text-muted" />
        </span>
        <input
          type="text"
          className="form-control border-start-0 ps-0"
          placeholder="Search services..."
          value={query}
          onChange={e => { setQuery(e.target.value); onSearch(e.target.value) }}
        />
      </div>
    </form>
  )
}

export default ServiceSearch
