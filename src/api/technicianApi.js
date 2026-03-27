/**
 * technicianApi.js — Technician directory endpoints
 *
 * Real endpoints (when VITE_USE_MOCK=false):
 *   GET  /technicians
 *   GET  /technicians/:id
 *   GET  /technicians/:id/reviews
 *   GET  /technicians/available
 */
import client from './client'
import mock, { USE_MOCK } from './mock'

/**
 * Fetch technicians with optional filters + sort.
 * @param {{
 *   service?:    string,
 *   available?:  'available' | 'busy' | 'all',
 *   maxPrice?:   number,
 *   sort?:       'rating' | 'price_asc' | 'price_desc' | 'experience' | 'reviews',
 *   q?:          string,
 *   page?:       number,
 *   limit?:      number,
 * }} params
 * @returns {{ data: Technician[], total: number }}
 */
export const getTechnicians = async (params = {}) => {
  if (USE_MOCK) return mock.getTechnicians(params)
  return client.get('/technicians', { params })
}

/**
 * Fetch a single technician's full profile.
 * @param {number|string} id
 * @returns {Technician}
 */
export const getTechnicianById = async (id) => {
  if (USE_MOCK) return mock.getTechnicianById(id)
  return client.get(`/technicians/${id}`)
}

/**
 * Fetch reviews for a technician.
 * @param {number|string} id
 * @returns {{ data: Review[], total: number }}
 */
export const getTechnicianReviews = async (id) => {
  if (USE_MOCK) return { data: [], total: 0 }
  return client.get(`/technicians/${id}/reviews`)
}

/**
 * Fetch only currently available technicians for a given service.
 * @param {string} service
 * @returns {{ data: Technician[], total: number }}
 */
export const getAvailableTechnicians = async (service) => {
  if (USE_MOCK) return mock.getTechnicians({ service, available: 'available' })
  return client.get('/technicians/available', { params: { service } })
}
