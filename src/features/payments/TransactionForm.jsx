/**
 * TransactionForm
 *
 * Input for the mobile banking transaction ID.
 * Only shown for bKash, Nagad, Rocket — not for Cash.
 *
 * Props:
 *   methodId       — selected payment method id
 *   value          — current transaction ID string
 *   onChange       — called with new string
 *   error          — validation error message
 */
const TransactionForm = ({ methodId, value, onChange, error }) => {
  if (methodId === 'cash' || !methodId) return null

  const labels = { bkash: 'bKash', nagad: 'Nagad', rocket: 'Rocket' }
  const label  = labels[methodId] || methodId

  return (
    <div className="mt-3">
      <label className="form-label fw-semibold small" htmlFor="txn-id">
        <i className="bi bi-hash text-primary me-1" aria-hidden="true" />
        {label} Transaction ID <span className="text-danger">*</span>
      </label>
      <input
        id="txn-id"
        type="text"
        className={`form-control rounded-3 ${error ? 'is-invalid' : ''}`}
        placeholder={`Enter your ${label} transaction ID`}
        value={value}
        onChange={e => onChange(e.target.value.trim())}
        maxLength={100}
        aria-required="true"
        aria-describedby={error ? 'txn-error' : undefined}
        autoComplete="off"
      />
      {error && (
        <div id="txn-error" className="invalid-feedback d-block" role="alert">
          <i className="bi bi-exclamation-circle me-1" />
          {error}
        </div>
      )}
      <div className="form-text">
        Find the transaction ID in your {label} app under payment history.
      </div>
    </div>
  )
}

export default TransactionForm
