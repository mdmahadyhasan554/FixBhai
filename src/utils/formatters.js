/** Format a number as Indian Rupees */
export const formatCurrency = (amount) => `₹${amount}`

/** Format ISO date string to readable format */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

/** Build a booking URL with optional query params */
export const buildBookingUrl = ({ service = '', techId = '' } = {}) => {
  const params = new URLSearchParams()
  if (service) params.set('service', service)
  if (techId)  params.set('tech', String(techId))
  const qs = params.toString()
  return qs ? `/booking?${qs}` : '/booking'
}

/** Capitalise first letter of a string */
export const capitalize = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1)

/** Generate a sequential booking ID */
export const generateBookingId = (count) =>
  `BK${String(count + 1).padStart(3, '0')}`
