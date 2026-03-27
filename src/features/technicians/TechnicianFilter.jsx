const TechnicianFilter = ({ filters, onChange }) => {
  const services = ['All', 'AC Repair', 'Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting']

  return (
    <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
      <div className="row g-3 align-items-end">
        <div className="col-md-4">
          <label className="form-label small fw-semibold">Service</label>
          <select className="form-select rounded-3" value={filters.service} onChange={e => onChange({ ...filters, service: e.target.value })}>
            {services.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label small fw-semibold">Availability</label>
          <select className="form-select rounded-3" value={filters.available} onChange={e => onChange({ ...filters, available: e.target.value })}>
            <option value="all">All</option>
            <option value="available">Available Now</option>
            <option value="busy">Busy</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label small fw-semibold">Sort By</label>
          <select className="form-select rounded-3" value={filters.sort} onChange={e => onChange({ ...filters, sort: e.target.value })}>
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="experience">Experience</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default TechnicianFilter
