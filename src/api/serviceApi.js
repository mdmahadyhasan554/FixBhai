/**
 * serviceApi.js — Service catalogue endpoints
 *
 * Real endpoints (when VITE_USE_MOCK=false):
 *   GET  /services
 *   GET  /services/:id
 *   GET  /services/categories
 */
import client from './client'
import mock, { USE_MOCK } from './mock'

/**
 * Fetch all services with optional filters.
 * @param {{ category?: string, q?: string }} params
 * @returns {{ data: Service[], total: number }}
 */
export const getServices = async (params = {}) => {
  if (USE_MOCK) return mock.getServices(params)
  return client.get('/services', { params })
}

/**
 * Fetch a single service by ID.
 * @param {number|string} id
 * @returns {Service}
 */
export const getServiceById = async (id) => {
  if (USE_MOCK) return mock.getServiceById(id)
  return client.get(`/services/${id}`)
}

/**
 * Fetch all available service categories.
 * @returns {string[]}
 */
export const getCategories = async () => {
  if (USE_MOCK) {
    const { data } = await mock.getServices()
    return [...new Set(data.map(s => s.category))]
  }
  return client.get('/services/categories')
}
