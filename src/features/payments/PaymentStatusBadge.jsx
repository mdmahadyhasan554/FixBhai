import Badge from '../../components/ui/Badge'
import { PAYMENT_STATUS_MAP, PAYMENT_METHODS } from '../../constants'

/**
 * PaymentStatusBadge
 * Shows payment status (pending/completed/failed) with colour coding.
 *
 * Props:
 *   status        — 'pending' | 'completed' | 'failed'
 *   method        — payment method id (optional, shows method label)
 */
const PaymentStatusBadge = ({ status, method }) => {
  const s = PAYMENT_STATUS_MAP[status] || { type: 'secondary', label: status }
  const m = PAYMENT_METHODS.find(p => p.id === method)

  return (
    <div className="d-flex align-items-center gap-2 flex-wrap">
      <Badge type={s.type} dot>{s.label}</Badge>
      {m && (
        <span className="badge rounded-pill small"
          style={{ background: m.bg, color: m.color, fontSize: '0.72rem' }}>
          {m.label}
        </span>
      )}
    </div>
  )
}

export default PaymentStatusBadge
