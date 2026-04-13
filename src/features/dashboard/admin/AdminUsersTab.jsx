import { useState, useEffect } from 'react'
import useAsync from '../../../hooks/useAsync'
import { getAllUsers, updateUserRole, updateUserStatus } from '../../../api/adminApi'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import StatusBadge from '../../../components/common/StatusBadge'

/**
 * AdminUsersTab
 * Manage all users - customers, technicians, and admins
 */
const AdminUsersTab = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const { run, loading } = useAsync()

  // Fetch users on mount
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => run(async () => {
    const response = await getAllUsers()
    setUsers(response.data || [])
  })

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const handleToggleStatus = async (userId, currentStatus) => {
    await run(async () => {
      await updateUserStatus(userId, !currentStatus)
      loadUsers()
    })
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  const handleSaveUser = async (userData) => {
    try {
      await run(async () => {
        if (selectedUser) {
          // Update existing user
          let updated = false
          
          // Update role if changed
          if (userData.role !== selectedUser.role) {
            console.log('Updating role:', selectedUser.id, userData.role)
            const result = await updateUserRole(selectedUser.id, userData.role)
            console.log('Role update result:', result)
            updated = true
          }
          
          // Update status if changed
          if (userData.is_active !== selectedUser.is_active) {
            console.log('Updating status:', selectedUser.id, userData.is_active)
            const result = await updateUserStatus(selectedUser.id, userData.is_active)
            console.log('Status update result:', result)
            updated = true
          }
          
          if (updated) {
            // Reload users to get fresh data
            await loadUsers()
          }
        }
        setShowModal(false)
      })
    } catch (error) {
      console.error('Error saving user:', error)
      alert('Failed to update user: ' + (error.message || 'Unknown error'))
    }
  }

  const handleDeleteUser = (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      // TODO: Implement delete user API
      setUsers(prev => prev.filter(u => u.id !== userId))
    }
  }

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'admin': return 'danger'
      case 'technician': return 'info'
      default: return 'secondary'
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">User Management</h4>
          <p className="text-muted mb-0">Manage all users, roles, and permissions</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={loadUsers} disabled={loading}>
            <i className="bi bi-arrow-clockwise me-2" />Refresh
          </Button>
          <Button variant="primary" onClick={() => { setSelectedUser(null); setShowModal(true) }}>
            <i className="bi bi-plus-circle me-2" />Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-primary bg-opacity-10 p-3">
                <i className="bi bi-people-fill text-primary fs-4" />
              </div>
              <div>
                <div className="text-muted small">Total Users</div>
                <div className="fs-4 fw-bold">{users.length}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-success bg-opacity-10 p-3">
                <i className="bi bi-person-check-fill text-success fs-4" />
              </div>
              <div>
                <div className="text-muted small">Active Users</div>
                <div className="fs-4 fw-bold">{users.filter(u => u.is_active).length}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-info bg-opacity-10 p-3">
                <i className="bi bi-person-badge-fill text-info fs-4" />
              </div>
              <div>
                <div className="text-muted small">Technicians</div>
                <div className="fs-4 fw-bold">{users.filter(u => u.role === 'technician').length}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-danger bg-opacity-10 p-3">
                <i className="bi bi-shield-fill-check text-danger fs-4" />
              </div>
              <div>
                <div className="text-muted small">Admins</div>
                <div className="fs-4 fw-bold">{users.filter(u => u.role === 'admin').length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <Input
                type="search"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon="search"
              />
            </div>
            <div className="col-md-3">
              <select 
                className="form-select rounded-3"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="customer">Customers</option>
                <option value="technician">Technicians</option>
                <option value="admin">Admins</option>
              </select>
            </div>
            <div className="col-md-3">
              <Button variant="outline-secondary" className="w-100" onClick={() => { setSearchTerm(''); setFilterRole('all') }}>
                <i className="bi bi-arrow-clockwise me-2" />Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 border-0">User</th>
                  <th className="py-3 border-0">Role</th>
                  <th className="py-3 border-0">Phone</th>
                  <th className="py-3 border-0">Status</th>
                  <th className="py-3 border-0">Joined</th>
                  <th className="py-3 border-0 text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <i className="bi bi-inbox fs-1 d-block mb-2" />
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: 40, height: 40 }}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="fw-semibold">{user.name}</div>
                            <div className="text-muted small">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`badge bg-${getRoleBadgeColor(user.role)} bg-opacity-10 text-${getRoleBadgeColor(user.role)} px-3 py-2`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 text-muted">{user.phone}</td>
                      <td className="py-3">
                        <StatusBadge status={user.is_active ? 'active' : 'inactive'} />
                      </td>
                      <td className="py-3 text-muted">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="py-3 text-end px-4">
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-outline-primary"
                            onClick={() => handleEditUser(user)}
                            title="Edit user"
                          >
                            <i className="bi bi-pencil" />
                          </button>
                          <button 
                            className={`btn btn-outline-${user.is_active ? 'warning' : 'success'}`}
                            onClick={() => handleToggleStatus(user.id, user.is_active)}
                            title={user.is_active ? 'Deactivate' : 'Activate'}
                          >
                            <i className={`bi bi-${user.is_active ? 'pause' : 'play'}-fill`} />
                          </button>
                          <button 
                            className="btn btn-outline-danger"
                            onClick={() => handleDeleteUser(user.id)}
                            title="Delete user"
                          >
                            <i className="bi bi-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Modal (Add/Edit) */}
      {showModal && (
        <UserModal
          user={selectedUser}
          onClose={() => setShowModal(false)}
          onSave={handleSaveUser}
          loading={loading}
        />
      )}
    </div>
  )
}

// User Modal Component
const UserModal = ({ user, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState(user || {
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    is_active: true
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow-lg">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">{user ? 'Edit User' : 'Add New User'}</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Name</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={!!user}
                />
                {user && <small className="text-muted">Name cannot be changed</small>}
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control rounded-3"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={!!user}
                />
                {user && <small className="text-muted">Email cannot be changed</small>}
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Phone</label>
                <input
                  type="tel"
                  className="form-control rounded-3"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  disabled={!!user}
                />
                {user && <small className="text-muted">Phone cannot be changed</small>}
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Role</label>
                <select
                  className="form-select rounded-3"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="customer">Customer</option>
                  <option value="technician">Technician</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isActive"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <label className="form-check-label" htmlFor="isActive">
                  Active Account
                </label>
              </div>
            </div>
            <div className="modal-footer border-0">
              <Button variant="outline-secondary" onClick={onClose} disabled={loading}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : user ? 'Update User' : 'Add User'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminUsersTab
