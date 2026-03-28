/**
 * serviceApi.js — Service catalogue endpoints
 *
 * Real endpoints (VITE_USE_MOCK=false) → PHP backend:
 *   GET /services/index.php
 *   GET /services/index.php?id=1
 */
import client from './client'
import mock, { USE_MOCK } from './mock'

export const getServices = async (params = {}) => {
  if (USE_MOCK) return mock.getServices(params)
  return client.get('/services/index.php', { params })
}

export const getServiceById = async (id) => {
  if (USE_MOCK) return mock.getServiceById(id)
  return client.get('/services/index.php', { params: { id } })
}

export const getCategories = async () => {
  if (USE_MOCK) {
    const { data } = await mock.getServices()
    return [...new Set(data.map(s => s.category))]
  }
  return client.get('/services/index.php', { params: { categories: 1 } })
}
