import ServiceCard from './ServiceCard'
import EmptyState from '../../components/common/EmptyState'

/**
 * ServiceGrid
 *
 * Props:
 *   services    — array of service objects
 *   compact     — passes compact mode to each ServiceCard
 *   selected    — currently selected service name (booking flow)
 *   onSelect    — called with service object when a card is clicked
 *   cols        — column config object: { xs, sm, md, lg, xl }
 *                 defaults to { xs: 6, md: 4, lg: 3 }
 *   gap         — Bootstrap gap class number (default: 3)
 *   emptyText   — custom empty state message
 *
 * Responsive defaults produce:
 *   mobile  → 2 columns
 *   tablet  → 3 columns
 *   desktop → 4 columns
 */
const DEFAULT_COLS = { xs: 6, md: 4, lg: 3 }

const ServiceGrid = ({
  services   = [],
  compact    = false,
  selected   = '',
  onSelect,
  cols       = DEFAULT_COLS,
  gap        = 3,
  emptyText  = 'No services found',
}) => {
  if (!services.length) {
    return (
      <EmptyState
        icon="tools"
        title={emptyText}
        subtitle="Try a different search or category"
      />
    )
  }

  // Build Bootstrap col class from cols config
  const colClass = Object.entries(cols)
    .map(([bp, span]) => bp === 'xs' ? `col-${span}` : `col-${bp}-${span}`)
    .join(' ')

  return (
    <div className={`row g-${gap}`} role="list" aria-label="Available services">
      {services.map(service => (
        <div key={service.id} className={colClass} role="listitem">
          <ServiceCard
            service={service}
            compact={compact}
            selected={selected === service.name}
            onClick={onSelect}
          />
        </div>
      ))}
    </div>
  )
}

export default ServiceGrid
