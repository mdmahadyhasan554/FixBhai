/**
 * formatters.js — Pure utility functions for formatting and URL building.
 * No React, no side effects. All functions are independently testable.
 */

/**
 * Format a number as Indian Rupees.
 * @param {number} amount
 * @returns {string} e.g. "₹299"
 */
export const formatCurrency = (amount) => `₹${amount}`

/**
 * Format an ISO date string to a human-readable Indian locale date.
 * @param {string} dateStr — ISO date string e.g. "2025-04-10"
 * @returns {string} e.g. "10 Apr 2025" or "—" if empty
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

/**
 * Build a /booking URL with optional service and technician query params.
 * @param {{ service?: string, techId?: string|number }} options
 * @returns {string} e.g. "/booking?service=AC+Repair&tech=1"
 */
export const buildBookingUrl = ({ service = '', techId = '' } = {}) => {
  const params = new URLSearchParams()
  if (service) params.set('service', service)
  if (techId)  params.set('tech', String(techId))
  const qs = params.toString()
  return qs ? `/booking?${qs}` : '/booking'
}

/**
 * Capitalise the first letter of a string.
 * @param {string} str
 * @returns {string} e.g. "appliance" → "Appliance"
 */
export const capitalize = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1)

/**
 * Generate a zero-padded sequential booking ID.
 * @param {number} count — current number of bookings
 * @returns {string} e.g. "BK003"
 */
export const generateBookingId = (count) =>
  `BK${String(count + 1).padStart(3, '0')}`
