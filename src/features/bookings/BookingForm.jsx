import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useBooking } from '../../context/BookingContext'
import { submitBooking } from '../../services/bookingService'
import useForm from '../../hooks/useForm'
import useAsync from '../../hooks/useAsync'
import { SERVICES } from '../../api/data'
import { TIME_SLOTS, ROUTES } from '../../constants'
import Button from '../../components/ui/Button'

const STEPS = ['Service', 'Schedule', 'Confirm']

const BookingForm = () => {
  const { values, setValue } = useForm({
    service: '', date: '', time: '', address: '', notes: '', techId: '',
  })
  const { run, loading } = useAsync()
  const { addBooking }   = useBooking()
  const { user }         = useAuth()
  const navigate         = useNavigate()
  const [params]         = useSearchParams()

  // Pre-fill from URL query params
  useEffect(() => {
    const svc    = params.get('service') || ''
    const techId = params.get('tech')    || ''
    if (svc)    setValue('service', svc)
    if (techId) setValue('techId',  techId)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Derive current step from form state
  const step = !values.service ? 0 : (!values.date || !values.time || !values.address) ? 1 : 2

  const handleSubmit = () => run(async () => {
    if (!user) { navigate(ROUTES.LOGIN); return }
    const details = await submitBooking(values)
    addBooking({ service: values.service, date: values.date, time: values.time, ...details })
    navigate(ROUTES.DASHBOARD)
  })

  const selectedService = SERVICES.find(s => s.name === values.service)

  return (
    <div className="booking-form-card p-4 p-md-5">
      <StepIndicator current={step} steps={STEPS} />

      {step === 0 && (
        <ServiceStep
          selected={values.service}
          onSelect={v => setValue('service', v)}
        />
      )}

      {step === 1 && (
        <ScheduleStep
          values={values}
          setValue={setValue}
          onBack={() => setValue('service', '')}
        />
      )}

      {step === 2 && (
        <ConfirmStep
          values={values}
          service={selectedService}
          loading={loading}
          onBack={() => setValue('date', '')}
          onConfirm={handleSubmit}
        />
      )}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────

const StepIndicator = ({ current, steps }) => (
  <div className="step-indicator mb-4">
    {steps.map((label, i) => (
      <div key={label} className="d-flex align-items-center" style={{ flex: i < steps.length - 1 ? 1 : 'none' }}>
        <div className={`step ${i < current ? 'done' : i === current ? 'active' : 'pending'}`}>
          {i < current ? <i className="bi bi-check" /> : i + 1}
        </div>
        <span className="ms-2 small fw-semibold d-none d-md-inline"
          style={{ color: i === current ? '#2563eb' : '#64748b' }}>
          {label}
        </span>
        {i < steps.length - 1 && <div className={`step-line mx-2 ${i < current ? 'done' : ''}`} />}
      </div>
    ))}
  </div>
)

const ServiceStep = ({ selected, onSelect }) => (
  <div>
    <h5 className="fw-bold mb-4">Select a Service</h5>
    <div className="row g-3">
      {SERVICES.map(s => (
        <div key={s.id} className="col-6 col-md-4 col-lg-3">
          <div
            className="service-card"
            style={selected === s.name ? { boxShadow: '0 0 0 2px #2563eb' } : {}}
            onClick={() => onSelect(s.name)}
            role="button" tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onSelect(s.name)}
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
  </div>
)

const ScheduleStep = ({ values, setValue, onBack }) => (
  <div>
    <h5 className="fw-bold mb-4">Schedule Your Visit</h5>
    <div className="row g-3 mb-3">
      <div className="col-md-6">
        <label className="form-label fw-semibold">Date</label>
        <input type="date" className="form-control rounded-3"
          value={values.date}
          min={new Date().toISOString().split('T')[0]}
          onChange={e => setValue('date', e.target.value)} />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Time Slot</label>
        <div className="d-flex flex-wrap gap-2">
          {TIME_SLOTS.map(t => (
            <button key={t} type="button"
              className={`btn btn-sm rounded-pill ${values.time === t ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setValue('time', t)}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
    <div className="mb-3">
      <label className="form-label fw-semibold">Address</label>
      <textarea className="form-control rounded-3" rows={3}
        placeholder="Enter your full address..."
        value={values.address}
        onChange={e => setValue('address', e.target.value)} />
    </div>
    <div className="mb-4">
      <label className="form-label fw-semibold">Notes (optional)</label>
      <input type="text" className="form-control rounded-3"
        placeholder="Any specific instructions..."
        value={values.notes}
        onChange={e => setValue('notes', e.target.value)} />
    </div>
    <Button variant="outline-secondary" onClick={onBack} className="px-4">
      <i className="bi bi-arrow-left me-1" /> Back
    </Button>
  </div>
)

const ConfirmStep = ({ values, service, loading, onBack, onConfirm }) => (
  <div>
    <h5 className="fw-bold mb-4">Confirm Booking</h5>
    <div className="card border-0 bg-light rounded-4 p-4 mb-4">
      <div className="row g-3">
        {[
          { label: 'Service', value: values.service, icon: 'tools'    },
          { label: 'Date',    value: values.date,    icon: 'calendar' },
          { label: 'Time',    value: values.time,    icon: 'clock'    },
          { label: 'Address', value: values.address, icon: 'geo-alt'  },
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
        <span className="fw-bold text-primary fs-5">₹{service?.price || 299}</span>
      </div>
    </div>
    <div className="d-flex gap-3">
      <Button variant="outline-secondary" onClick={onBack} className="px-4">
        <i className="bi bi-arrow-left me-1" /> Back
      </Button>
      <Button onClick={onConfirm} loading={loading} className="px-5">
        <i className="bi bi-check-circle me-1" /> Confirm Booking
      </Button>
    </div>
  </div>
)

export default BookingForm
