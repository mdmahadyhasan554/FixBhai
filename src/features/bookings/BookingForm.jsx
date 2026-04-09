import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useBooking } from '../../context/BookingContext'
import useForm from '../../hooks/useForm'
import useAsync from '../../hooks/useAsync'
import { SERVICES } from '../../api/data'
import { createPayment } from '../../api/paymentApi'
import { TIME_SLOTS, ROUTES, BOOKING_STEPS, PROBLEM_CATEGORIES, PAYMENT_METHODS } from '../../constants'
import { formatDate } from '../../utils/formatters'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import ServiceGrid from '../services/ServiceGrid'
import PaymentMethodSelector from '../payments/PaymentMethodSelector'
import PaymentInstructions from '../payments/PaymentInstructions'
import TransactionForm from '../payments/TransactionForm'

const BookingForm = () => {
  const { values, setValue } = useForm({
    service: '', date: '', time: '', address: '',
    problemCategory: '', description: '', notes: '', techId: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [txnError, setTxnError]           = useState('')
  const { run, loading } = useAsync()
  const { addBooking }   = useBooking()
  const { user }         = useAuth()
  const navigate         = useNavigate()
  const [params]         = useSearchParams()

  useEffect(() => {
    const svc    = params.get('service') || ''
    const techId = params.get('tech')    || ''
    if (svc)    setValue('service', svc)
    if (techId) setValue('techId',  techId)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const step = !values.service ? 0
    : (!values.date || !values.time || !values.address || !values.problemCategory) ? 1
    : !paymentMethod ? 2
    : 3

  const selectedService = SERVICES.find(s => s.name === values.service)
  const amount = selectedService ? selectedService.price : 0

  const handleSubmit = () => run(async () => {
    if (!user) { navigate(ROUTES.LOGIN); return }
    if (paymentMethod !== 'cash' && !transactionId.trim()) {
      setTxnError('Transaction ID is required for mobile banking payments')
      return
    }
    setTxnError('')
    const booking = await addBooking(values)
    await createPayment({
      bookingId:     booking ? booking.id : 'TEMP',
      amount,
      method:        paymentMethod,
      transactionId: paymentMethod !== 'cash' ? transactionId : null,
    })
    navigate(ROUTES.DASHBOARD)
  })

  return (
    <div className="booking-form-card p-4 p-md-5">
      <StepIndicator current={step} steps={BOOKING_STEPS} />
      {step === 0 && <ServiceStep selected={values.service} onSelect={n => setValue('service', n)} />}
      {step === 1 && <ScheduleStep values={values} setValue={setValue} onBack={() => setValue('service', '')} />}
      {step === 2 && (
        <PaymentStep
          amount={amount}
          paymentMethod={paymentMethod}
          transactionId={transactionId}
          txnError={txnError}
          onMethodSelect={m => { setPaymentMethod(m); setTransactionId(''); setTxnError('') }}
          onTransactionChange={v => { setTransactionId(v); setTxnError('') }}
          onBack={() => setValue('date', '')}
        />
      )}
      {step === 3 && (
        <ConfirmStep
          values={values}
          service={selectedService}
          paymentMethod={paymentMethod}
          transactionId={transactionId}
          loading={loading}
          onBack={() => setPaymentMethod('')}
          onConfirm={handleSubmit}
        />
      )}
    </div>
  )
}

const ServiceStep = ({ selected, onSelect }) => (
  <div>
    <StepHeading icon="tools" title="Select a Service" subtitle="Choose the type of service you need" />
    <ServiceGrid services={SERVICES} compact selected={selected}
      onSelect={s => onSelect(s.name)} cols={{ xs: 6, md: 4, lg: 3 }} gap={3} />
  </div>
)

const ScheduleStep = ({ values, setValue, onBack }) => {
  const today = new Date().toISOString().split('T')[0]
  return (
    <div>
      <StepHeading icon="calendar-check" title="Schedule Your Visit" subtitle="Pick a date, time and describe the problem" />
      <div className="row g-4">
        <div className="col-md-6">
          <label className="form-label fw-semibold small">
            <i className="bi bi-calendar3 text-primary me-2" />Preferred Date <span className="text-danger">*</span>
          </label>
          <input type="date" className="form-control form-control-lg rounded-3"
            value={values.date} min={today} onChange={e => setValue('date', e.target.value)} />
          {values.date && <div className="form-text text-success mt-1"><i className="bi bi-check-circle me-1" />{formatDate(values.date)}</div>}
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold small">
            <i className="bi bi-clock text-primary me-2" />Preferred Time <span className="text-danger">*</span>
          </label>
          <div className="d-grid gap-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {TIME_SLOTS.map(slot => (
              <button key={slot} type="button"
                className={['btn btn-sm rounded-3', values.time === slot ? 'btn-primary' : 'btn-outline-secondary'].join(' ')}
                onClick={() => setValue('time', slot)}>{slot}</button>
            ))}
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold small">
            <i className="bi bi-exclamation-circle text-primary me-2" />Problem Type <span className="text-danger">*</span>
          </label>
          <div className="d-flex flex-wrap gap-2">
            {PROBLEM_CATEGORIES.map(cat => (
              <button key={cat} type="button"
                className={['btn btn-sm rounded-pill', values.problemCategory === cat ? 'btn-primary' : 'btn-outline-secondary'].join(' ')}
                onClick={() => setValue('problemCategory', cat)}>{cat}</button>
            ))}
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold small" htmlFor="booking-address">
            <i className="bi bi-geo-alt text-primary me-2" />Service Address <span className="text-danger">*</span>
          </label>
          <textarea id="booking-address" className="form-control rounded-3" rows={3}
            placeholder="e.g. House 12, Road 5, Dhanmondi, Dhaka"
            value={values.address} onChange={e => setValue('address', e.target.value)} />
        </div>
        <div className="col-12">
          <label className="form-label fw-semibold small" htmlFor="booking-description">
            <i className="bi bi-chat-text text-primary me-2" />Describe the Problem
            <span className="text-muted fw-normal ms-1">(optional)</span>
          </label>
          <textarea id="booking-description" className="form-control rounded-3" rows={3}
            placeholder="e.g. AC not cooling, making noise for 2 days"
            value={values.description} onChange={e => setValue('description', e.target.value)} maxLength={500} />
          <div className="d-flex justify-content-between mt-1">
            <span className="form-text">More detail helps the technician come prepared</span>
            <span className="form-text">{values.description.length}/500</span>
          </div>
        </div>
        <div className="col-12">
          <Input label="Additional Notes" icon="sticky" name="notes"
            placeholder="Gate code, parking instructions..."
            value={values.notes} onChange={e => setValue('notes', e.target.value)}
            hint="Anything else the technician should know" />
        </div>
      </div>
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

const PaymentStep = ({ amount, paymentMethod, transactionId, txnError, onMethodSelect, onTransactionChange, onBack }) => (
  <div>
    <StepHeading icon="credit-card" title="Payment Method" subtitle="Choose how you would like to pay" />
    <div className="d-flex align-items-center justify-content-between p-3 rounded-4 mb-4"
      style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
      <span className="fw-semibold">Service Charge</span>
      <span className="fw-bold text-primary" style={{ fontSize: '1.4rem' }}>৳{amount}</span>
    </div>
    <PaymentMethodSelector selected={paymentMethod} onSelect={onMethodSelect} />
    {paymentMethod && (
      <div className="mt-4">
        <PaymentInstructions methodId={paymentMethod} amount={amount} />
        <TransactionForm methodId={paymentMethod} value={transactionId}
          onChange={onTransactionChange} error={txnError} />
      </div>
    )}
    {!paymentMethod && (
      <div className="alert alert-info rounded-3 small mt-4 d-flex align-items-center gap-2">
        <i className="bi bi-info-circle-fill flex-shrink-0" />
        Please select a payment method to continue.
      </div>
    )}
    <div className="mt-4">
      <Button variant="outline-secondary" rounded onClick={onBack} className="px-4">
        <i className="bi bi-arrow-left me-1" /> Back
      </Button>
    </div>
  </div>
)

const ConfirmStep = ({ values, service, paymentMethod, transactionId, loading, onBack, onConfirm }) => {
  const method = PAYMENT_METHODS.find(m => m.id === paymentMethod)
  const summaryRows = [
    { label: 'Service',  value: values.service,         icon: 'tools'               },
    { label: 'Date',     value: formatDate(values.date), icon: 'calendar3'          },
    { label: 'Time',     value: values.time,             icon: 'clock'              },
    { label: 'Problem',  value: values.problemCategory,  icon: 'exclamation-circle' },
    { label: 'Address',  value: values.address,          icon: 'geo-alt'            },
  ]
  return (
    <div>
      <StepHeading icon="check-circle" title="Confirm Booking" subtitle="Review your details before confirming" />
      <Card bordered rounded="lg" className="mb-4">
        <Card.Body className="p-4">
          <div className="row g-3 mb-3">
            {summaryRows.map(({ label, value, icon }) => value && (
              <div key={label} className="col-md-6">
                <div className="d-flex align-items-start gap-3 p-3 rounded-3" style={{ background: '#f8fafc' }}>
                  <div className="rounded-3 p-2 flex-shrink-0" style={{ background: '#dbeafe' }}>
                    <i className={'bi bi-' + icon + ' text-primary'} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>{label}</div>
                    <div className="fw-semibold small text-truncate">{value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-3 mb-3"
            style={{ background: method ? method.bg : '#f8fafc', border: '1px solid ' + (method ? method.color + '44' : '#e2e8f0') }}>
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-credit-card" style={{ color: method ? method.color : undefined }} />
                <span className="fw-semibold small">{method ? method.label : ''}</span>
              </div>
              {transactionId && <span className="text-muted small">TXN: {transactionId}</span>}
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
            <div>
              <div className="fw-semibold">Total Amount</div>
              <div className="text-muted small">
                {paymentMethod === 'cash' ? 'Pay cash after service' : 'Pending admin verification'}
              </div>
            </div>
            <div className="fw-bold text-primary" style={{ fontSize: '1.5rem' }}>৳{service ? service.price : 0}</div>
          </div>
        </Card.Body>
      </Card>
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

const StepIndicator = ({ current, steps }) => (
  <div className="step-indicator mb-5">
    {steps.map((label, i) => (
      <div key={label} className="d-flex align-items-center" style={{ flex: i < steps.length - 1 ? 1 : 'none' }}>
        <div className={['step', i < current ? 'done' : i === current ? 'active' : 'pending'].join(' ')}
          aria-current={i === current ? 'step' : undefined}>
          {i < current ? <i className="bi bi-check" /> : i + 1}
        </div>
        <span className="ms-2 small fw-semibold d-none d-sm-inline"
          style={{ color: i === current ? '#2563eb' : i < current ? '#10b981' : '#94a3b8' }}>
          {label}
        </span>
        {i < steps.length - 1 && <div className={['step-line mx-2', i < current ? 'done' : ''].join(' ')} />}
      </div>
    ))}
  </div>
)

const StepHeading = ({ icon, title, subtitle }) => (
  <div className="mb-4">
    <div className="d-flex align-items-center gap-2 mb-1">
      <i className={'bi bi-' + icon + ' text-primary fs-5'} />
      <h5 className="fw-bold mb-0">{title}</h5>
    </div>
    {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
  </div>
)

export default BookingForm
