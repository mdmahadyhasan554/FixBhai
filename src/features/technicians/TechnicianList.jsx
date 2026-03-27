import TechnicianCard from './TechnicianCard'

const TechnicianList = ({ technicians }) => {
  if (!technicians.length) return (
    <div className="text-center py-5 text-muted">
      <i className="bi bi-person-x fs-1 d-block mb-2" />
      No technicians found
    </div>
  )
  return (
    <div className="row g-3">
      {technicians.map(t => (
        <div key={t.id} className="col-md-6 col-lg-4">
          <TechnicianCard tech={t} />
        </div>
      ))}
    </div>
  )
}

export default TechnicianList
