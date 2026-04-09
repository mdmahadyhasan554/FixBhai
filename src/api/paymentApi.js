/**
 * paymentApi.js — Payment endpoints
 *
 * Real endpoints (VITE_USE_MOCK=false) → PHP backend:
 *   POST  /payments/create.php
 *   GET   /payments/user.php
 *   POST  /payments/verify.php  (admin only)
 */
import client from './client'
import { USE_MOCK } from './mock'

// ── Mock payment store ────────────────────────────────────
let _payments = []

const mockPayments = {
  async create(payload) {
    await new Promise(r => setTimeout(r, 600))
    const payment = {
      id:             _payments.length + 1,
      booking_id:     payload.bookingId,
      amount:         payload.amount,
      payment_method: payload.method,
      transaction_id: payload.transactionId || null,
      status:         payload.method === 'cash' ? 'pending' : 'pending',
      created_at:     new Date().toISOString(),
    }
    _payments.push(payment)
    return { success: true, data: payment }
  },
  async getUserPayments() {
    await new Promise(r => setTimeout(r, 400))
    return { success: true, data: _payments }
  },
  async verify(paymentId) {
    await new Promise(r => setTimeout(r, 400))
    const idx = _payments.findIndex(p => p.id === paymentId)
    if (idx === -1) throw new Error('Payment not found')
    _payments[idx].status = 'completed'
    return { success: true, data: _payments[idx] }
  },
}

/**
 * Create a payment record for a booking.
 * @param {{ bookingId, amount, method, transactionId? }} payload
 */
export const createPayment = async (payload) => {
  if (USE_MOCK) return mockPayments.create(payload)
  return client.post('/payments/create.php', {
    booking_id:     payload.bookingId,
    amount:         payload.amount,
    payment_method: payload.method,
    transaction_id: payload.transactionId || null,
  })
}

/**
 * Get all payments for the authenticated user.
 */
export const getUserPayments = async () => {
  if (USE_MOCK) return mockPayments.getUserPayments()
  return client.get('/payments/user.php')
}

/**
 * Admin: verify a payment and mark it completed.
 * @param {number} paymentId
 */
export const verifyPayment = async (paymentId) => {
  if (USE_MOCK) return mockPayments.verify(paymentId)
  return client.post('/payments/verify.php', { payment_id: paymentId })
}
