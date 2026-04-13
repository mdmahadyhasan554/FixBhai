import { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { uploadAvatar, deleteAvatar } from '../../api/userApi'
import Button from '../ui/Button'

/**
 * AvatarUpload Component
 * 
 * Handles profile picture upload, preview, and deletion
 * Features:
 * - Image preview before upload
 * - Drag and drop support
 * - File validation (type, size)
 * - Delete existing avatar
 * - Circular avatar display
 */
const AvatarUpload = ({ size = 150, editable = true, onUploadSuccess }) => {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const fileInputRef = useRef(null)
  
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [preview, setPreview] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  // Safety check for user - must be after all hooks
  if (!user) {
    return (
      <div className="text-center">
        <div
          className="rounded-circle d-inline-flex align-items-center justify-content-center bg-secondary text-white"
          style={{ width: size, height: size, fontSize: size * 0.38 }}
        >
          ?
        </div>
        <div className="mt-2 text-muted small">Loading...</div>
      </div>
    )
  }

  // Get user initials for fallback
  const getInitials = () => {
    if (!user || !user.name) return '?'
    const names = user.name.split(' ')
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase()
    }
    return user.name.substring(0, 2).toUpperCase()
  }

  const avatarUrl = preview || (user && user.avatar_url) || null
  const hasAvatar = Boolean(avatarUrl)

  // Handle avatar URL - add localhost if it's a relative path
  const getAvatarUrl = () => {
    if (!avatarUrl) return null
    if (typeof avatarUrl !== 'string') return null
    if (avatarUrl.startsWith('http') || avatarUrl.startsWith('data:')) return avatarUrl
    return `http://localhost${avatarUrl}`
  }

  const finalAvatarUrl = getAvatarUrl()

  // Validate file
  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload JPG, PNG, or GIF')
      return false
    }

    if (file.size > maxSize) {
      toast.error('File size exceeds 5MB limit')
      return false
    }

    return true
  }

  // Handle file selection
  const handleFileSelect = async (file) => {
    if (!file || !validateFile(file)) return

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Upload file
    setUploading(true)
    try {
      const response = await uploadAvatar(file)
      updateUser({ avatar_url: response.avatar_url })
      toast.success('Profile picture updated successfully')
      setPreview(null)
      if (onUploadSuccess) onUploadSuccess(response.avatar_url)
    } catch (error) {
      toast.error(error.message || 'Failed to upload profile picture')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) {
      return
    }

    setDeleting(true)
    try {
      await deleteAvatar()
      updateUser({ avatar_url: null })
      setPreview(null)
      toast.success('Profile picture removed')
    } catch (error) {
      toast.error(error.message || 'Failed to delete profile picture')
    } finally {
      setDeleting(false)
    }
  }

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="text-center">
      {/* Avatar Display */}
      <div
        className="position-relative d-inline-block"
        style={{ width: size, height: size }}
        onDragEnter={editable ? handleDrag : undefined}
        onDragLeave={editable ? handleDrag : undefined}
        onDragOver={editable ? handleDrag : undefined}
        onDrop={editable ? handleDrop : undefined}
      >
        {/* Avatar Circle */}
        <div
          className={`rounded-circle overflow-hidden border ${
            dragActive ? 'border-primary border-3' : 'border-2'
          }`}
          style={{
            width: size,
            height: size,
            backgroundColor: hasAvatar ? '#f8f9fa' : '#e9ecef',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
        >
          {hasAvatar ? (
            <img
              src={finalAvatarUrl}
              alt={user.name || 'User avatar'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                // Hide image if it fails to load
                e.target.style.display = 'none'
              }}
            />
          ) : (
            <span
              style={{
                fontSize: size / 3,
                fontWeight: 600,
                color: '#6c757d',
              }}
            >
              {getInitials()}
            </span>
          )}
        </div>

        {/* Upload/Delete Buttons */}
        {editable && (
          <div
            className="position-absolute bottom-0 end-0"
            style={{ transform: 'translate(10%, 10%)' }}
          >
            {hasAvatar && !preview ? (
              <Button
                size="sm"
                variant="danger"
                rounded
                onClick={handleDelete}
                loading={deleting}
                className="shadow-sm"
                style={{ width: 40, height: 40, padding: 0 }}
                title="Delete avatar"
              >
                <i className="bi bi-trash" />
              </Button>
            ) : (
              <Button
                size="sm"
                variant="primary"
                rounded
                onClick={() => fileInputRef.current?.click()}
                loading={uploading}
                className="shadow-sm"
                style={{ width: 40, height: 40, padding: 0 }}
                title="Upload avatar"
              >
                <i className={`bi bi-${uploading ? 'hourglass-split' : 'camera'}`} />
              </Button>
            )}
          </div>
        )}

        {/* Loading Overlay */}
        {(uploading || deleting) && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100 rounded-circle d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          >
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        style={{ display: 'none' }}
      />

      {/* Instructions */}
      {editable && (
        <div className="mt-3">
          <small className="text-muted d-block">
            {hasAvatar ? 'Click the button to change or remove' : 'Click to upload or drag and drop'}
          </small>
          <small className="text-muted">JPG, PNG or GIF (max 5MB)</small>
        </div>
      )}
    </div>
  )
}

export default AvatarUpload
