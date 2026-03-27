import { SERVICES, TECHNICIANS } from '../api/data'

/** Resolve service price and technician name from form values */
export const resolveBookingDetails = ({ service, techId }) => {
  const svc  = SERVICES.find(s => s.name === service)
  const tech = TECHNICIANS.find(t => String(t.id) === String(techId))
  return {
    amount:     svc?.price || 299,
    technician: tech?.name || 'Auto Assigned',
  }
}

/**
 * Simulate submitting a booking to the API.
 * Returns resolved details merged with the original form data.
 */
export const submitBooking = async (formData) => {
  await new Promise(r => setTimeout(r, 1000))
  const details = resolveBookingDetails(formData)
  return {
    ...details,
    // Persist problem description fields
    problemCategory: formData.problemCategory || '',
    description:     formData.description     || '',
    address:         formData.address         || '',
    notes:           formData.notes           || '',
  }
}
