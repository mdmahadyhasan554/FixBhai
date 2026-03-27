import { useNavigate } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import { buildBookingUrl } from '../../utils/formatters'

const TechnicianCard = ({ tech }) => {
  const navigate = useNavigate()

  return (
    <div className="tech-card p-3 h-100">
      {/* Header */}
      <div className="d-flex align-items-start gap-3 mb-3">
        <img src={tech.avatar} alt={tech.name} className="tech-avatar" />
        <div className="flex-grow-1">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <h6 className="fw-bold mb-0">{tech.name}</h6>
            {tech.verified && (
              <i className="bi bi-patch-check-fill text-primary" title="Verified technician" />
            )}
          </div>
          <p className="text-muted small mb-1">{tech.service}</p>
          <RatingDisplay rating={tech.rating} reviews={tech.reviews} />
        </div>
        <Badge type={tech.available ? 'success' : 'danger'}>
          {tech.available ? 'Available' : 'Busy'}
        </Badge>
      </div>

      {/* Meta chips */}
      <div className="d-flex gap-2 flex-wrap mb-3">
        <MetaChip icon="briefcase" label={tech.experience} />
        <MetaChip icon="geo-alt"   label={tech.location}   />
      </div>

      {/* Footer */}
      <div className="d-flex align-items-center justify-content-between">
        <span className="fw-bold text-primary fs-5">₹{tech.price}</span>
        <button
          className="btn btn-primary btn-sm rounded-pill px-4"
          disabled={!tech.available}
          onClick={() => navigate(buildBookingUrl({ service: tech.service, techId: tech.id }))}
        >
          Book Now
        </button>
      </div>
    </div>
  )
}

const RatingDisplay = ({ rating, reviews }) => (
  <div className="d-flex align-items-center gap-1">
    <span className="rating-stars">{'★'.repeat(Math.round(rating))}</span>
    <span className="small fw-semibold">{rating}</span>
    <span className="text-muted small">({reviews})</span>
  </div>
)

const MetaChip = ({ icon, label }) => (
  <span className="badge bg-light text-dark rounded-pill px-3">
    <i className={`bi bi-${icon} me-1`} />{label}
  </span>
)

export default TechnicianCard
