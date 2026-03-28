/**
 * technicianApi.js — Technician directory endpoints
 *
 * Real endpoints (VITE_USE_MOCK=false) → PHP backend:
 *   GET /technicians/index.php
 */
import client from './client'
import mock, { USE_MOCK } from './mock'

export const getTechnicians = async (params = {}) => {
  if (USE_MOCK) return mock.getTechnicians(params)
  return client.get('/technicians/index.php', { params })
}

export const getTechnicianById = async (id) => {
  if (USE_MOCK) return mock.getTechnicianById(id)
  return client.get('/technicians/index.php', { params: { id } })
}

export const getTechnicianReviews = async (id) => {
  if (USE_MOCK) return { data: [], total: 0 }
  return client.get('/technicians/index.php', { params: { id, reviews: 1 } })
}

export const getAvailableTechnicians = async (service) => {
  if (USE_MOCK) return mock.getTechnicians({ service, available: 'available' })
  return client.get('/technicians/index.php', { params: { service, available: 'available' } })
}
