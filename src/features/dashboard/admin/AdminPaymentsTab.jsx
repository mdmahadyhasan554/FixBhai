import { useState } from 'react'
import { verifyPayment, getUserPayments } from '../../../api/paymentApi'
import useAsync from '../../../hooks/useAsync'
import PaymentStatusBadge from '../../payments/PaymentStatusBadge'
import { useToast } from '../../../context/ToastContext'

/**
 * AdminPaymentsTab
 * Admin view: list all payments, verify pending mobile banking transactions.
 */
const AdminPaymentsTab = ({ payments: initialPayments = [] }) => {
  const [payments, setPayments] = useState(initialPayments)
  const { run, loading }        = useAsync()
  const { toast }               = useToast()

  const handleVerify = async (paymentId) => {
    await run(async () => {
      const { data } = await verifyPayment(paymentId)
      setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'completed' } : p))
      toast.success('Payment verified successfully!')
    })
  }

  const pending   = payments.filter(p => p.status === 'pending')
  const completed = payments.filter(p => p.status === 'completed')

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h6 className="fw-bold mb-0">Payment Management</h6>
          <p className="text-muted small mb-0">
            {pending.length} pending · {completed.length} verified
          </p>
        </div>
        <div className="d-flex gap-2">
          <span className="badge bg-warning bg-opacity-20 text-warning rounded-pill px-3 py-2">
            {pending.length} Pending
          </span>
          <span className="badge bg-success bg-opacity-20 text-success rounded-pill px-3 py-2">
            {completed.length} Verified
          </span>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-credit-card fs-1 d-block mb-2" />
          No payments yet
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th className="border-0 fw-semibold small text-muted py-3 px-4">Booking</th>
                  <th className="border-0 fw-semibold small text-muted py-3">Method</th>
                  <th className="border-0 fw-semibold small text-muted py-3 d-none d-md-table-cell">Transaction ID</th>
                  <th className="border-0 fw-semibold small text-muted py-3">Amount</th>
                  <th className="border-0 fw-semibold small text-muted py-3">Status</th>
                  <th className="border-0 fw-semibold small text-muted py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td className="px-4">
                      <span className="fw-semibold small">{p.booking_id}</span>
                    </td>
                    <td>
                      <PaymentStatusBadge status={p.status} method={p.payment_method} />
                    </td>
                    <td className="d-none d-md-table-cell">
                      {p.transaction_id
                        ? <code className="small bg-light px-2 py-1 rounded">{p.transaction_id}</code>
                        : <span className="text-muted small">—</span>
                      }
                    </td>
                    <td className="fw-semibold text-primary">৳{p.amount}</td>
                    <td>
                      <span className={`badge rounded-pill ${p.status === 'completed' ? 'bg-success' : p.status === 'failed' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      {p.status === 'pending' && p.payment_method !== 'cash' && (
                        <button
                          className="btn btn-sm btn-success rounded-pill px-3"
                          disabled={loading}
                          onClick={() => handleVerify(p.id)}
                        >
                          <i className="bi bi-check-circle me-1" />Verify
                        </button>
                      )}
                      {p.status === 'completed' && (
                        <span className="text-success small"><i className="bi bi-check-circle-fill me-1" />Verified</span>
                      )}
                      {p.payment_method === 'cash' && p.status === 'pending' && (
                        <span className="text-muted small">Cash — collect on site</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPaymentsTab
