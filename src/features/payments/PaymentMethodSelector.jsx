import { PAYMENT_METHODS } from '../../constants'

/**
 * PaymentMethodSelector
 *
 * Displays bKash, Nagad, Rocket, Cash as selectable cards.
 *
 * Props:
 *   selected  — currently selected method id
 *   onSelect  — called with method id string
 */
const PaymentMethodSelector = ({ selected, onSelect }) => (
  <div>
    <label className="form-label fw-semibold small mb-3">
      <i className="bi bi-credit-card text-primary me-2" aria-hidden="true" />
      Select Payment Method <span className="text-danger">*</span>
    </label>
    <div className="row g-3" role="radiogroup" aria-label="Payment method">
      {PAYMENT_METHODS.map(method => {
        const isActive = selected === method.id
        return (
          <div key={method.id} className="col-6 col-md-3">
            <button
              type="button"
              role="radio"
              aria-checked={isActive}
              className="w-100 border rounded-4 p-3 text-center"
              style={{
                background:   isActive ? method.bg : '#fff',
                borderColor:  isActive ? method.color : '#e2e8f0',
                borderWidth:  isActive ? 2 : 1,
                cursor:       'pointer',
                transition:   'all 0.2s',
                outline:      'none',
              }}
              onClick={() => onSelect(method.id)}
            >
              {/* Icon bubble */}
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
                style={{ width: 48, height: 48, background: method.bg }}
                aria-hidden="true"
              >
                <i className={`bi bi-${method.icon}`} style={{ color: method.color, fontSize: '1.3rem' }} />
              </div>
              <div className="fw-semibold small" style={{ color: isActive ? method.color : '#1e293b' }}>
                {method.label}
              </div>
              {isActive && (
                <div className="mt-1">
                  <i className="bi bi-check-circle-fill" style={{ color: method.color, fontSize: '0.85rem' }} />
                </div>
              )}
            </button>
          </div>
        )
      })}
    </div>
  </div>
)

export default PaymentMethodSelector
