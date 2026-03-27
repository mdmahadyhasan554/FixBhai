import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useBooking } from '../../context/BookingContext'
import useForm from '../../hooks/useForm'
import useAsync from '../../hooks/useAsync'
import { SERVICES } from '../../api/data'
import { TIME_SLOTS, ROUTES, BOOKING_STEPS, PROBLEM_CATEGORIES } from '../../constants'
import { formatDate } from '../../utils/formatters'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import ServiceGrid from '../services/ServiceGrid'

/**
 * BookingForm — 3-step wizard
 *
 * Step 0 — Service selection
 * Step 1 — Schedule: date picker, time grid, address, problem description
 * Step 2 — Confirm & submit
 */
const BookingForm = () => {
  const { values, setValue } = useForm({
    service: '', date: '', time: '', address: '',
    problemCategory: '', description: '', notes: '', techId: '',
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

  // Derive step from form completeness
  const step = !values.service ? 0
    : (!values.date || !values.time || !values.address || !values.problemCategory) ? 1
    : 2

  // addBooking in context handles API call + optimistic update
  const handleSubmit = () => run(async () => {
    if (!user) { navigate(ROUTES.LOGIN); return }
    await addBooking(values)
    navigate(ROUTES.DASHBOARD)
  })

  const selectedService = SERVICES.find(s => s.name === values.service)

  return (
    <div className="booking-form-card p-4 p-md-5">
      <StepIndicator current={step} steps={BOOKING_STEPS} />

      {step === 0 && (
        <ServiceStep
          selected={values.service}
          onSelect={name => setValue('service', name)}
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

// ── Step 0: Service ───────────────────────────────────────

const ServiceStep = ({ selected, onSelect }) => (
  <div>
    <StepHeading
      icon="tools"
      title="Select a Service"
      subtitle="Choose the type of service you need"
    />
    <ServiceGrid
      services={SERVICES}
      compact
      selected={selected}
      onSelect={s => onSelect(s.name)}
      cols={{ xs: 6, md: 4, lg: 3 }}
      gap={3}
    />
  </div>
)

// ── Step 1: Schedule ──────────────────────────────────────

const ScheduleStep = ({ values, setValue, onBack }) => {
  const today = new Date().toISOString().split('T')[0]

  return (
    <div>
      <StepHeading
        icon="calendar-check"
        title="Schedule Your Visit"
        subtitle="Pick a date, time and describe the problem"
      />

      <div className="row g-4">

        {/* Date picker */}
        <div className="col-md-6">
          <label className="form-label fw-semibold small">
            <i className="bi bi-calendar3 text-primary me-2" aria-hidden="true" />
            Preferred Date <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            className="form-control form-control-lg rounded-3"
            value={values.date}
            min={today}
            onChange={e => setValue('date', e.target.value)}
            aria-label="Select preferred date"
            aria-required="true"
          />
          {values.date && (
            <div className="form-text text-success mt-1">
              <i className="bi bi-check-circle me-1" />
              {formatDate(values.date)}
            </div>
          )}
        </div>

        {/* Time slot grid */}
        <div className="col-md-6">
          <label className="form-label fw-semibold small">
            <i className="bi bi-clock text-primary me-2" aria-hidden="true" />
            Preferred Time <span className="text-danger">*</span>
          </label>
          <div
            className="d-grid gap-2"
            style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
            role="group"
            aria-label="Select time slot"
          >
            {TIME_SLOTS.map(slot => (
              <button
                key={slot}
                type="button"
                className={`btn btn-sm rounded-3 ${
                  values.time === slot
                    ? 'btn-primary'
                    : 'btn-outline-secondary'
                }`}
                onClick={() => setValue('time', slot)}
                aria-pressed={values.time === slot}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Problem category */}
        <div className="col-md-6">
          <label className="form-label fw-semibold small">
            <i className="bi bi-exclamation-circle text-primary me-2" aria-hidden="true" />
            Problem Type <span className="text-danger">*</span>
          </label>
          <div className="d-flex flex-wrap gap-2" role="group" aria-label="Select problem type">
            {PROBLEM_CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm rounded-pill ${
                  values.problemCategory === cat
                    ? 'btn-primary'
                    : 'btn-outline-secondary'
                }`}
                onClick={() => setValue('problemCategory', cat)}
                aria-pressed={values.problemCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="col-md-6">
          <label className="form-label fw-semibold small" htmlFor="booking-address">
            <i className="bi bi-geo-alt text-primary me-2" aria-hidden="true" />
            Service Address <span className="text-danger">*</span>
          </label>
          <textarea
            id="booking-address"
            className="form-control rounded-3"
            rows={3}
            placeholder="Flat no., building, street, area, city..."
            value={values.address}
            onChange={e => setValue('address', e.target.value)}
            aria-required="true"
          />
        </div>

        {/* Problem description */}
        <div className="col-12">
          <label className="form-label fw-semibold small" htmlFor="booking-description">
            <i className="bi bi-chat-text text-primary me-2" aria-hidden="true" />
            Describe the Problem
            <span className="text-muted fw-normal ms-1">(optional but helpful)</span>
          </label>
          <textarea
            id="booking-description"
            className="form-control rounded-3"
            rows={4}
            placeholder={`e.g. "My AC is making a loud rattling noise and not cooling properly. It's a 1.5 ton split AC, about 3 years old."`}
            value={values.description}
            onChange={e => setValue('description', e.target.value)}
            maxLength={500}
          />
          <div className="d-flex justify-content-between mt-1">
            <span className="form-text">More detail helps the technician come prepared</span>
            <span className="form-text">{values.description.length}/500</span>
          </div>
        </div>

        {/* Additional notes */}
        <div className="col-12">
          <Input
            label="Additional Notes"
            icon="sticky"
            name="notes"
            placeholder="Gate code, parking instructions, preferred language..."
            value={values.notes}
            onChange={e => setValue('notes', e.target.value)}
            hint="Anything else the technician should know"
          />
        </div>

      </div>

      {/* Validation hint */}
      {(!values.date || !values.time || !values.address || !values.problemCategory) && (
        <div className="alert alert-info rounded-3 small mt-3 mb-0 d-flex align-items-center gap-2">
          <i className="bi bi-info-circle-fill flex-shrink-0" />
          Please fill in date, time, problem type and address to continue.
        </div>
      )}

      <div className="mt-4">
        <Button variant="outline-secondary" rounded onClick={onBack} className="px-4">
          <i className="bi bi-arrow-left me-1" /> Back
        </Button>
      </div>
    </div>
  )
}

// ── Step 2: Confirm ───────────────────────────────────────

const ConfirmStep = ({ values, service, loading, onBack, onConfirm }) => {
  const summaryRows = [
    { label: 'Service',      value: values.service,         icon: 'tools'              },
    { label: 'Date',         value: formatDate(values.date), icon: 'calendar3'         },
    { label: 'Time',         value: values.time,             icon: 'clock'             },
    { label: 'Problem',      value: values.problemCategory,  icon: 'exclamation-circle'},
    { label: 'Address',      value: values.address,          icon: 'geo-alt'           },
  ]

  return (
    <div>
      <StepHeading
        icon="check-circle"
        title="Confirm Booking"
        subtitle="Review your details before confirming"
      />

      <Card bordered rounded="lg" className="mb-4">
        <Card.Body className="p-4">

          {/* Summary grid */}
          <div className="row g-3 mb-3">
            {summaryRows.map(({ label, value, icon }) => value && (
              <div key={label} className="col-md-6">
                <div className="d-flex align-items-start gap-3 p-3 rounded-3"
                  style={{ background: '#f8fafc' }}>
                  <div className="rounded-3 p-2 flex-shrink-0"
                    style={{ background: '#dbeafe' }}>
                    <i className={`bi bi-${icon} text-primary`} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>{label}</div>
                    <div className="fw-semibold small text-truncate">{value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Problem description preview */}
          {values.description && (
            <div className="p-3 rounded-3 mb-3" style={{ background: '#f8fafc' }}>
              <div className="text-muted small mb-1">
                <i className="bi bi-chat-text me-1" />Problem Description
              </div>
              <p className="small mb-0" style={{ lineHeight: 1.6 }}>{values.description}</p>
            </div>
          )}

          {/* Price row */}
          <div className="d-flex justify-content-between align-items-center pt-3"
            style={{ borderTop: '1px solid #f1f5f9' }}>
            <div>
              <div className="fw-semibold">Total Amount</div>
              <div className="text-muted small">Pay after service completion</div>
            </div>
            <div className="text-end">
              <div className="fw-bold text-primary" style={{ fontSize: '1.5rem' }}>
                ₹{service?.price || 299}
              </div>
              <div className="text-muted small">Inclusive of all charges</div>
            </div>
          </div>

        </Card.Body>
      </Card>

      {/* Trust badges */}
      <div className="d-flex flex-wrap gap-3 mb-4">
        {[
          { icon: 'shield-check',  text: 'Verified technician'  },
          { icon: 'clock-history', text: 'On-time guarantee'     },
          { icon: 'cash-coin',     text: 'Pay after service'     },
        ].map(({ icon, text }) => (
          <div key={text} className="d-flex align-items-center gap-2 small text-muted">
            <i className={`bi bi-${icon} text-success`} aria-hidden="true" />
            {text}
          </div>
        ))}
      </div>

      <div className="d-flex gap-3">
        <Button variant="outline-secondary" rounded onClick={onBack} className="px-4">
          <i className="bi bi-arrow-left me-1" /> Back
        </Button>
        <Button rounded loading={loading} onClick={onConfirm} className="px-5">
          <i className="bi bi-check-circle me-1" /> Confirm Booking
        </Button>
      </div>
    </div>
  )
}

// ── Shared ────────────────────────────────────────────────

const StepIndicator = ({ current, steps }) => (
  <div className="step-indicator mb-5">
    {steps.map((label, i) => (
      <div
        key={label}
        className="d-flex align-items-center"
        style={{ flex: i < steps.length - 1 ? 1 : 'none' }}
      >
        <div className={`step ${i < current ? 'done' : i === current ? 'active' : 'pending'}`}
          aria-current={i === current ? 'step' : undefined}>
          {i < current ? <i className="bi bi-check" aria-hidden="true" /> : i + 1}
        </div>
        <span
          className="ms-2 small fw-semibold d-none d-sm-inline"
          style={{ color: i === current ? '#2563eb' : i < current ? '#10b981' : '#94a3b8' }}
        >
          {label}
        </span>
        {i < steps.length - 1 && (
          <div className={`step-line mx-2 ${i < current ? 'done' : ''}`} />
        )}
      </div>
    ))}
  </div>
)

const StepHeading = ({ icon, title, subtitle }) => (
  <div className="mb-4">
    <div className="d-flex align-items-center gap-2 mb-1">
      <i className={`bi bi-${icon} text-primary fs-5`} aria-hidden="true" />
      <h5 className="fw-bold mb-0">{title}</h5>
    </div>
    {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
  </div>
)

export default BookingForm
