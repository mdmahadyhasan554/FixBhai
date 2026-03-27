import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useBooking } from '../../context/BookingContext'
import { useAuth } from '../../context/AuthContext'
import { SERVICES, TECHNICIANS } from '../../api/data'
import Button from '../../components/ui/Button'

const STEPS = ['Service', 'Schedule', 'Confirm']

const BookingForm = () => {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ service: '', date: '', time: '', address: '', notes: '', techId: '' })
  const [loading, setLoading] = useState(false)
  const { addBooking } = useBooking()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  // Pre-fill from URL params
  useState(() => {
    const svc = params.get('service') || ''
    const techId = params.get('tech') || ''
    setForm(f => ({ ...f, service: svc, techId }))
  }, [])

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const handleSubmit = async () => {
    if (!user) { navigate('/login'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    const tech = TECHNICIANS.find(t => String(t.id) === String(form.techId))
    const svc = SERVICES.find(s => s.name === form.service)
    addBooking({
      service: form.service,
      technician: tech?.name || 'Auto Assigned',
      date: form.date,
      time: form.time,
      amount: svc?.price || 299,
    })
    setLoading(false)
    navigate('/dashboard')
  }

  const times = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']

  return (
    <div className="booking-form-card p-4 p-md-5">
      {/* Step Indicator */}
      <div className="step-indicator mb-4">
        {STEPS.map((s, i) => (
          <div key={s} className="d-flex align-items-center" style={{ flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div className={`step ${i < step ? 'done' : i === step ? 'active' : 'pending'}`}>
              {i < step ? <i className="bi bi-check" /> : i + 1}
            </div>
            <span className="ms-2 small fw-semibold d-none d-md-inline" style={{ color: i === step ? '#2563eb' : '#64748b' }}>{s}</span>
            {i < STEPS.length - 1 && <div className={`step-line mx-2 ${i < step ? 'done' : ''}`} />}
          </div>
        ))}
      </div>

      {/* Step 0: Service */}
      {step === 0 && (
        <div>
          <h5 className="fw-bold mb-4">Select a Service</h5>
          <div className="row g-3 mb-4">
            {SERVICES.map(s => (
              <div key={s.id} className="col-6 col-md-4 col-lg-3">
                <div
                  className={`service-card ${form.service === s.name ? 'border-primary' : ''}`}
                  style={form.service === s.name ? { boxShadow: '0 0 0 2px #2563eb' } : {}}
                  onClick={() => update('service', s.name)}
                >
                  <div className="service-icon" style={{ background: s.color }}>
                    <i className={`bi bi-${s.icon}`} style={{ color: s.iconColor }} />
                  </div>
                  <h6 className="fw-semibold mb-0 small">{s.name}</h6>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>₹{s.price}</p>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={() => setStep(1)} disabled={!form.service} className="px-5">
            Next <i className="bi bi-arrow-right ms-1" />
          </Button>
        </div>
      )}

      {/* Step 1: Schedule */}
      {step === 1 && (
        <div>
          <h5 className="fw-bold mb-4">Schedule Your Visit</h5>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Date</label>
              <input type="date" className="form-control rounded-3" value={form.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => update('date', e.target.value)} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Time Slot</label>
              <div className="d-flex flex-wrap gap-2">
                {times.map(t => (
                  <button key={t} type="button"
                    className={`btn btn-sm rounded-pill ${form.time === t ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => update('time', t)}>{t}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Address</label>
            <textarea className="form-control rounded-3" rows={3} placeholder="Enter your full address..."
              value={form.address} onChange={e => update('address', e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Notes (optional)</label>
            <input type="text" className="form-control rounded-3" placeholder="Any specific instructions..."
              value={form.notes} onChange={e => update('notes', e.target.value)} />
          </div>
          <div className="d-flex gap-3">
            <Button variant="outline-secondary" onClick={() => setStep(0)} className="px-4">
              <i className="bi bi-arrow-left me-1" /> Back
            </Button>
            <Button onClick={() => setStep(2)} disabled={!form.date || !form.time || !form.address} className="px-5">
              Next <i className="bi bi-arrow-right ms-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Confirm */}
      {step === 2 && (
        <div>
          <h5 className="fw-bold mb-4">Confirm Booking</h5>
          <div className="card border-0 bg-light rounded-4 p-4 mb-4">
            <div className="row g-3">
              {[
                { label: 'Service', value: form.service, icon: 'tools' },
                { label: 'Date', value: form.date, icon: 'calendar' },
                { label: 'Time', value: form.time, icon: 'clock' },
                { label: 'Address', value: form.address, icon: 'geo-alt' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="col-md-6">
                  <div className="d-flex align-items-start gap-2">
                    <i className={`bi bi-${icon} text-primary mt-1`} />
                    <div>
                      <div className="small text-muted">{label}</div>
                      <div className="fw-semibold">{value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <hr />
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-semibold">Total Amount</span>
              <span className="fw-bold text-primary fs-5">
                ₹{SERVICES.find(s => s.name === form.service)?.price || 299}
              </span>
            </div>
          </div>
          <div className="d-flex gap-3">
            <Button variant="outline-secondary" onClick={() => setStep(1)} className="px-4">
              <i className="bi bi-arrow-left me-1" /> Back
            </Button>
            <Button onClick={handleSubmit} loading={loading} className="px-5">
              <i className="bi bi-check-circle me-1" /> Confirm Booking
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingForm
