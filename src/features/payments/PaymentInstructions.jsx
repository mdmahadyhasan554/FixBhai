import { PAYMENT_METHODS } from '../../constants'

/**
 * PaymentInstructions
 *
 * Shows dynamic instructions based on the selected payment method.
 * For mobile banking: shows the number to send to.
 * For cash: shows a simple confirmation message.
 *
 * Props:
 *   methodId — selected payment method id
 *   amount   — booking amount in BDT
 */
const PaymentInstructions = ({ methodId, amount }) => {
  const method = PAYMENT_METHODS.find(m => m.id === methodId)
  if (!method) return null

  if (method.id === 'cash') {
    return (
      <div className="rounded-4 p-4 d-flex align-items-start gap-3"
        style={{ background: '#d1fae5', border: '1.5px solid #6ee7b7' }}>
        <i className="bi bi-cash-coin flex-shrink-0 mt-1" style={{ color: '#059669', fontSize: '1.4rem' }} />
        <div>
          <div className="fw-semibold mb-1" style={{ color: '#065f46' }}>Cash on Service</div>
          <p className="small mb-0" style={{ color: '#047857' }}>
            Pay <strong>৳{amount}</strong> in cash directly to the technician after the service is completed.
            No advance payment required.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-4 p-4" style={{ background: method.bg, border: `1.5px solid ${method.color}33` }}>
      <div className="d-flex align-items-center gap-2 mb-3">
        <i className="bi bi-info-circle-fill" style={{ color: method.color }} />
        <span className="fw-semibold small" style={{ color: method.color }}>
          How to pay via {method.label}
        </span>
      </div>

      <ol className="small mb-3 ps-3" style={{ color: '#374151', lineHeight: 2 }}>
        <li>Open your <strong>{method.label}</strong> app</li>
        <li>Go to <strong>Send Money</strong></li>
        <li>
          Enter number: <strong style={{ color: method.color }}>{method.number}</strong>
          <button
            type="button"
            className="btn btn-sm ms-2 py-0 px-2 rounded-pill"
            style={{ background: method.color, color: '#fff', fontSize: '0.68rem' }}
            onClick={() => navigator.clipboard?.writeText(method.number)}
            aria-label={`Copy ${method.label} number`}
          >
            Copy
          </button>
        </li>
        <li>Enter amount: <strong style={{ color: method.color }}>৳{amount}</strong></li>
        <li>Complete the transaction</li>
        <li>Copy the <strong>Transaction ID</strong> and enter it below</li>
      </ol>

      <div className="rounded-3 p-3 d-flex align-items-center gap-2"
        style={{ background: 'rgba(255,255,255,0.7)' }}>
        <i className="bi bi-exclamation-triangle-fill text-warning" />
        <span className="small text-muted">
          Your booking will be confirmed after admin verifies the transaction.
        </span>
      </div>
    </div>
  )
}

export default PaymentInstructions
