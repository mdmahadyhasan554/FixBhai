import { useState } from 'react'
import AvatarUpload from '../../components/common/AvatarUpload'
import { updateProfile } from '../../api/userApi'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

/**
 * ProfileTab — customer profile view inside the dashboard.
 *
 * Props:
 *   user     — { name, email, role }
 *   stats    — { total, completed, pending }
 *   onLogout — logout handler
 */

// Profile fields driven by data — adding a field is a one-line change
const getProfileFields = (user) => [
  { label: 'Full Name',    value: user.name,    icon: 'person'       },
  { label: 'Email',        value: user.email,   icon: 'envelope'     },
  { label: 'Phone',        value: user.phone || 'Not provided', icon: 'telephone' },
  { label: 'Role',         value: user.role || 'Customer', icon: 'shield-check' },
  { label: 'Member Since', value: new Date(user.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), icon: 'calendar' },
]

const ProfileTab = ({ user, stats, onLogout }) => {
  const { updateUser } = useAuth()
  const { toast } = useToast()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
  })

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }

    setSaving(true)
    try {
      const response = await updateProfile(formData)
      updateUser(response.user)
      toast.success('Profile updated successfully')
      setEditing(false)
    } catch (error) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
    })
    setEditing(false)
  }

  return (
    <div className="row g-4">
      {/* ── Avatar card ── */}
      <div className="col-lg-4">
        <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
          <AvatarUpload size={120} editable={true} />
          <h5 className="fw-bold mb-1 mt-3">{user.name}</h5>
          <p className="text-muted small mb-3">{user.email}</p>
          <span className="badge bg-primary rounded-pill px-3 py-2 text-capitalize">
            {user.role || 'Customer'}
          </span>
          <div className="mt-4 d-flex justify-content-center gap-4">
            <StatPill label="Bookings"  value={stats.total}     />
            <StatPill label="Completed" value={stats.completed} />
            <StatPill label="Pending"   value={stats.pending}   />
          </div>
        </div>
      </div>

      {/* ── Details card ── */}
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h6 className="fw-bold mb-0">Account Details</h6>
            {!editing && (
              <button 
                className="btn btn-outline-primary btn-sm rounded-pill px-3"
                onClick={() => setEditing(true)}
              >
                <i className="bi bi-pencil me-1" aria-hidden="true" />
                Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            // Edit Mode
            <div className="row g-3">
              <div className="col-md-6">
                <Input
                  label="Full Name"
                  icon="person"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>
              <div className="col-md-6">
                <Input
                  label="Phone Number"
                  icon="telephone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone"
                />
              </div>
              <div className="col-12">
                <Input
                  label="Email Address"
                  icon="envelope"
                  value={user.email}
                  disabled
                  readOnly
                />
                <small className="text-muted">Email cannot be changed</small>
              </div>
              <div className="col-12 mt-4">
                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    loading={saving}
                    className="rounded-pill px-4"
                  >
                    <i className="bi bi-check-lg me-1" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={handleCancel}
                    disabled={saving}
                    className="rounded-pill px-4"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="row g-3">
              {getProfileFields(user).map(f => (
                <div key={f.label} className="col-md-6">
                  <label className="form-label small text-muted">{f.label}</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className={`bi bi-${f.icon} text-muted`} aria-hidden="true" />
                    </span>
                    <input
                      className="form-control bg-light border-start-0"
                      value={f.value || ''}
                      readOnly
                      aria-label={f.label}
                    />
                  </div>
                </div>
              ))}
              <div className="col-12 mt-4">
                <button className="btn btn-outline-danger btn-sm rounded-pill px-4" onClick={onLogout}>
                  <i className="bi bi-box-arrow-right me-1" aria-hidden="true" />Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── StatPill — mini stat display used in the avatar card ─
const StatPill = ({ label, value }) => (
  <div className="text-center">
    <div className="fw-bold text-primary">{value}</div>
    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{label}</div>
  </div>
)

export default ProfileTab
