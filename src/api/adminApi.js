/**
 * adminApi.js — Admin-only endpoints
 * 
 * All endpoints require admin role
 */

import client from './client'

/**
 * Get all users (admin only)
 * @returns {Promise<{data: Array, total: number}>}
 */
export const getAllUsers = async () => {
  return client.get('/admin/users.php')
}

/**
 * Get all bookings (admin only)
 * @returns {Promise<{data: Array, total: number}>}
 */
export const getAllBookings = async () => {
  return client.get('/admin/bookings.php')
}

/**
 * Update user status (admin only)
 * @param {number} userId - User ID
 * @param {boolean} isActive - Active status
 * @returns {Promise<{success: boolean}>}
 */
export const updateUserStatus = async (userId, isActive) => {
  return client.post('/admin/user-status.php', { userId, isActive })
}

/**
 * Update user role (admin only)
 * @param {number} userId - User ID
 * @param {string} role - New role (customer, technician, admin)
 * @returns {Promise<{success: boolean}>}
 */
export const updateUserRole = async (userId, role) => {
  return client.post('/admin/user-role.php', { userId, role })
}

/**
 * Delete user (admin only)
 * @param {number} userId - User ID
 * @returns {Promise<{success: boolean}>}
 */
export const deleteUser = async (userId) => {
  return client.delete(`/admin/user.php?id=${userId}`)
}

/**
 * Create user (admin only)
 * @param {Object} userData - User data
 * @returns {Promise<{success: boolean, user: Object}>}
 */
export const createUser = async (userData) => {
  return client.post('/admin/user.php', userData)
}

/**
 * Update technician specialization (admin or technician)
 * @param {number} userId - User ID
 * @param {string} specialization - Specialization
 * @param {string} specializationOther - Other specialization (if "Other" selected)
 * @returns {Promise<{success: boolean}>}
 */
export const updateTechnicianSpecialization = async (userId, specialization, specializationOther = null) => {
  return client.post('/users/update-specialization.php', { 
    userId, 
    specialization,
    specializationOther 
  })
}

/**
 * Get all technicians (admin only)
 * @returns {Promise<{data: Array, total: number}>}
 */
export const getAllTechnicians = async () => {
  return client.get('/admin/technicians.php')
}

/**
 * Update technician status (admin only)
 * @param {number} technicianId - Technician ID
 * @param {string} status - Status (approved, pending, suspended)
 * @returns {Promise<{success: boolean}>}
 */
export const updateTechnicianStatus = async (technicianId, status) => {
  return client.post('/admin/technicians.php', { 
    action: 'update_status',
    technician_id: technicianId, 
    status 
  })
}
