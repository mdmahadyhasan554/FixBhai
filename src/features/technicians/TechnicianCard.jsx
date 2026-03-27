import { useNavigate } from 'react-router-dom'
import Badge from '../../components/ui/Badge'

const TechnicianCard = ({ tech }) => {
  const navigate = useNavigate()
  return (
    <div className="tech-card p-3 h-100">
      <div className="d-flex align-items-start gap-3 mb-3">
        <img src={tech.avatar} alt={tech.name} className="tech-avatar" />
        <div className="flex-grow-1">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <h6 className="fw-bold mb-0">{tech.name}</h6>
            {tech.verified && <i className="bi bi-patch-check-fill text-primary" title="Verified" />}
          </div>
          <p className="text-muted small mb-1">{tech.service}</p>
          <div className="d-flex align-items-center gap-1">
            <span className="rating-stars">{'★'.repeat(Math.round(tech.rating))}</span>
            <span className="small fw-semibold">{tech.rating}</span>
            <span className="text-muted small">({tech.reviews})</span>
          </div>
        </div>
        <Badge type={tech.available ? 'success' : 'danger'}>
          {tech.available ? 'Available' : 'Busy'}
        </Badge>
      </div>
      <div className="d-flex gap-2 flex-wrap mb-3">
        <span className="badge bg-light text-dark rounded-pill px-3">
          <i className="bi bi-briefcase me-1" />{tech.experience}
        </span>
        <span className="badge bg-light text-dark rounded-pill px-3">
          <i className="bi bi-geo-alt me-1" />{tech.location}
        </span>
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <span className="fw-bold text-primary fs-5">₹{tech.price}</span>
        <button
          className="btn btn-primary btn-sm rounded-pill px-4"
          disabled={!tech.available}
          onClick={() => navigate(`/booking?tech=${tech.id}&service=${tech.service}`)}
        >
          Book Now
        </button>
      </div>
    </div>
  )
}

export default TechnicianCard
