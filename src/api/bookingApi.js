/**
 * bookingApi.js — Booking management endpoints
 *
 * Real endpoints (when VITE_USE_MOCK=false):
 *   GET    /bookings
 *   GET    /bookings/:id
 *   POST   /bookings
 *   PATCH  /bookings/:id/status
 *   DELETE /bookings/:id
 *   POST   /bookings/:id/review
 */
import client from './client'
import mock, { USE_MOCK } from './mock'

/**
 * Fetch all bookings for the authenticated user.
 * @returns {{ data: Booking[], total: number }}
 */
export const getBookings = async () => {
  if (USE_MOCK) return mock.getBookings()
  return client.get('/bookings')
}

/**
 * Fetch a single booking by ID.
 * @param {string} id
 * @returns {Booking}
 */
export const getBookingById = async (id) => {
  if (USE_MOCK) return mock.getBookingById(id)
  return client.get(`/bookings/${id}`)
}

/**
 * Create a new booking.
 * @param {{
 *   service:          string,
 *   techId?:          string | number,
 *   date:             string,   // ISO date
 *   time:             string,
 *   address:          string,
 *   problemCategory:  string,
 *   description?:     string,
 *   notes?:           string,
 * }} payload
 * @returns {Booking}
 */
export const createBooking = async (payload) => {
  if (USE_MOCK) return mock.createBooking(payload)
  return client.post('/bookings', payload)
}

/**
 * Update the status of a booking.
 * @param {string} id
 * @param {'confirmed' | 'completed' | 'cancelled'} status
 * @returns {Booking}
 */
export const updateBookingStatus = async (id, status) => {
  if (USE_MOCK) return mock.updateBookingStatus(id, status)
  return client.patch(`/bookings/${id}/status`, { status })
}

/**
 * Cancel a booking (shorthand for updateBookingStatus → 'cancelled').
 * @param {string} id
 * @returns {Booking}
 */
export const cancelBooking = async (id) => {
  if (USE_MOCK) return mock.cancelBooking(id)
  return client.patch(`/bookings/${id}/status`, { status: 'cancelled' })
}

/**
 * Submit a review for a completed booking.
 * @param {string} id
 * @param {{ rating: number, comment: string }} review
 * @returns {{ success: boolean }}
 */
export const submitReview = async (id, review) => {
  if (USE_MOCK) return { success: true }
  return client.post(`/bookings/${id}/review`, review)
}
