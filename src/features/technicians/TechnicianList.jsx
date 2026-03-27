import TechnicianCard from './TechnicianCard'
import EmptyState from '../../components/common/EmptyState'
import { ROUTES } from '../../constants'
import { Link } from 'react-router-dom'

/**
 * TechnicianList
 *
 * Props:
 *   technicians  — array of technician objects
 *   cols         — Bootstrap col config: { xs, sm, md, lg }
 *                  defaults to { xs: 12, md: 6, lg: 4 }
 *   compact      — passes compact mode to each card
 *   showCount    — show result count above the grid
 */
const DEFAULT_COLS = { xs: 12, md: 6, lg: 4 }

const TechnicianList = ({
  technicians = [],
  cols        = DEFAULT_COLS,
  compact     = false,
  showCount   = false,
}) => {
  if (!technicians.length) {
    return (
      <EmptyState
        icon="person-x"
        title="No technicians found"
        subtitle="Try adjusting your filters or search query"
        action={
          <Link to={ROUTES.BOOKING} className="btn btn-primary btn-sm rounded-pill px-4">
            Book Any Available Tech
          </Link>
        }
      />
    )
  }

  const colClass = Object.entries(cols)
    .map(([bp, span]) => bp === 'xs' ? `col-${span}` : `col-${bp}-${span}`)
    .join(' ')

  return (
    <div>
      {showCount && (
        <p className="text-muted small mb-3" aria-live="polite">
          {technicians.length} technician{technicians.length !== 1 ? 's' : ''} found
        </p>
      )}
      <div className="row g-3" role="list" aria-label="Technicians">
        {technicians.map(tech => (
          <div key={tech.id} className={colClass} role="listitem">
            <TechnicianCard tech={tech} compact={compact} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TechnicianList
