/**
 * bookingApi.js — Booking management endpoints
 *
 * Real endpoints (VITE_USE_MOCK=false) → PHP backend:
 *   GET   /bookings/user.php
 *   POST  /bookings/create.php
 *   PATCH /bookings/status.php
 */
import client from './client'
import mock, { USE_MOCK } from './mock'

export const getBookings = async () => {
  if (USE_MOCK) return mock.getBookings()
  return client.get('/bookings/user.php')
}

export const getBookingById = async (id) => {
  if (USE_MOCK) return mock.getBookingById(id)
  return client.get('/bookings/user.php', { params: { id } })
}

export const createBooking = async (payload) => {
  if (USE_MOCK) return mock.createBooking(payload)
  return client.post('/bookings/create.php', payload)
}

export const updateBookingStatus = async (id, status) => {
  if (USE_MOCK) return mock.updateBookingStatus(id, status)
  return client.patch('/bookings/status.php', { id, status })
}

export const cancelBooking = async (id) => {
  if (USE_MOCK) return mock.cancelBooking(id)
  return client.patch('/bookings/status.php', { id, status: 'cancelled' })
}

export const submitReview = async (id, review) => {
  if (USE_MOCK) return { success: true }
  return client.post('/bookings/review.php', { id, ...review })
}
