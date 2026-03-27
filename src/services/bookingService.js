/**
 * bookingService.js
 *
 * Business logic layer for bookings.
 * Calls bookingApi — never touches axios or mock data directly.
 */
import { bookingApi } from '../api'

/**
 * Submit a new booking from the BookingForm values.
 * Returns the created booking object (with resolved technician + amount).
 */
export const submitBooking = (formData) =>
  bookingApi.createBooking({
    service:         formData.service,
    techId:          formData.techId          || null,
    date:            formData.date,
    time:            formData.time,
    address:         formData.address,
    problemCategory: formData.problemCategory || '',
    description:     formData.description     || '',
    notes:           formData.notes           || '',
  })

export const fetchBookings     = ()         => bookingApi.getBookings()
export const fetchBookingById  = (id)       => bookingApi.getBookingById(id)
export const cancelBooking     = (id)       => bookingApi.cancelBooking(id)
export const changeStatus      = (id, s)    => bookingApi.updateBookingStatus(id, s)
export const rateBooking       = (id, data) => bookingApi.submitReview(id, data)
