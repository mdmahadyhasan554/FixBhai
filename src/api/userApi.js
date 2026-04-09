/**
 * User API
 * Handles user profile operations including avatar management
 */

import client from './client'

/**
 * Upload user avatar/profile picture
 * @param {File} file - Image file to upload
 * @returns {Promise<{avatar_url: string}>}
 */
export const uploadAvatar = async (file) => {
  const formData = new FormData()
  formData.append('avatar', file)

  const { data } = await client.post('/users/upload-avatar.php', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

/**
 * Delete user avatar/profile picture
 * @returns {Promise<{success: boolean}>}
 */
export const deleteAvatar = async () => {
  const { data } = await client.delete('/users/delete-avatar.php')
  return data
}

/**
 * Update user profile information
 * @param {Object} profileData - Profile data to update
 * @param {string} profileData.name - User's name
 * @param {string} profileData.phone - User's phone number
 * @returns {Promise<{user: Object}>}
 */
export const updateProfile = async (profileData) => {
  const { data } = await client.put('/users/update-profile.php', profileData)
  return data
}

/**
 * Get user profile
 * @param {number} userId - User ID
 * @returns {Promise<{user: Object}>}
 */
export const getUserProfile = async (userId) => {
  const { data } = await client.get(`/users/profile.php?id=${userId}`)
  return data
}
