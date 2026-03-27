import Badge from '../ui/Badge'
import { STATUS_MAP } from '../../constants'

/**
 * Booking-specific status badge — wraps generic Badge with STATUS_MAP lookup.
 */
const StatusBadge = ({ status }) => {
  const { type, label } = STATUS_MAP[status] || { type: 'info', label: status }
  return <Badge type={type}>{label}</Badge>
}

export default StatusBadge
