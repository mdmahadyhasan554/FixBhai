import { useNavigate } from 'react-router-dom'

const ServiceCard = ({ service }) => {
  const navigate = useNavigate()
  return (
    <div className="service-card h-100" onClick={() => navigate(`/booking?service=${service.name}`)}>
      <div className="service-icon" style={{ background: service.color }}>
        <i className={`bi bi-${service.icon}`} style={{ color: service.iconColor }} />
      </div>
      <h6 className="fw-semibold mb-1">{service.name}</h6>
      <p className="text-muted small mb-2">Starting ₹{service.price}</p>
      <div className="d-flex align-items-center justify-content-center gap-1">
        <i className="bi bi-star-fill text-warning" style={{ fontSize: '0.75rem' }} />
        <span className="small fw-semibold">{service.rating}</span>
        <span className="text-muted small">({service.bookings}+)</span>
      </div>
    </div>
  )
}

export default ServiceCard
