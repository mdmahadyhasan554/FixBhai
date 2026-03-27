import ServiceCard from './ServiceCard'

const ServiceGrid = ({ services }) => (
  <div className="row g-3">
    {services.map(s => (
      <div key={s.id} className="col-6 col-md-4 col-lg-3">
        <ServiceCard service={s} />
      </div>
    ))}
  </div>
)

export default ServiceGrid
