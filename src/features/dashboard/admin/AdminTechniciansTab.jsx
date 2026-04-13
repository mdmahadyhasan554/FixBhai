import { useState, useEffect } from 'react'
import useAsync from '../../../hooks/useAsync'
import { getAllTechnicians, updateTechnicianStatus, updateTechnicianSpecialization } from '../../../api/adminApi'
import Button from '../../../components/ui/Button'
import StatusBadge from '../../../components/common/StatusBadge'
import { TECHNICIAN_SPECIALIZATIONS } from '../../../constants'

/**
 * AdminTechniciansTab
 * Manage technician profiles, approvals, and performance
 */
const AdminTechniciansTab = () => {
  const [technicians, setTechnicians] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTech, setSelectedTech] = useState(null)
  const { run, loading } = useAsync()

  // Fetch technicians on mount
  useEffect(() => {
    loadTechnicians()
  }, [])

  const loadTechnicians = () => run(async () => {
    const response = await getAllTechnicians()
    setTechnicians(response.data || [])
  })

  const filteredTechs = technicians.filter(tech => {
    const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tech.email.toLowerCase().includes(searchTerm.toLowerCase())
    const status = tech.is_active ? 'approved' : 'suspended'
    const matchesStatus = filterStatus === 'all' || status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleApprove = async (id) => {
    await run(async () => {
      await updateTechnicianStatus(id, 'approved')
      loadTechnicians()
    })
  }

  const handleSuspend = async (id) => {
    await run(async () => {
      await updateTechnicianStatus(id, 'suspended')
      loadTechnicians()
    })
  }

  const handleReject = (id) => {
    if (confirm('Are you sure you want to reject this technician?')) {
      handleSuspend(id)
    }
  }

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'danger'
  }

  const pendingCount = 0 // No pending status in current DB
  const approvedCount = technicians.filter(t => t.is_active).length
  const suspendedCount = technicians.filter(t => !t.is_active).length

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Technician Management</h4>
          <p className="text-muted mb-0">Approve, manage, and monitor technician performance</p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <Button variant="outline-secondary" onClick={loadTechnicians} disabled={loading}>
            <i className="bi bi-arrow-clockwise me-2" />Refresh
          </Button>
          {pendingCount > 0 && (
            <span className="badge bg-warning text-dark px-3 py-2">
              {pendingCount} Pending Approval{pendingCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-info bg-opacity-10 p-3">
                <i className="bi bi-person-badge-fill text-info fs-4" />
              </div>
              <div>
                <div className="text-muted small">Total Technicians</div>
                <div className="fs-4 fw-bold">{technicians.length}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-success bg-opacity-10 p-3">
                <i className="bi bi-check-circle-fill text-success fs-4" />
              </div>
              <div>
                <div className="text-muted small">Approved</div>
                <div className="fs-4 fw-bold">{approvedCount}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-warning bg-opacity-10 p-3">
                <i className="bi bi-clock-fill text-warning fs-4" />
              </div>
              <div>
                <div className="text-muted small">Pending</div>
                <div className="fs-4 fw-bold">{pendingCount}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-danger bg-opacity-10 p-3">
                <i className="bi bi-x-circle-fill text-danger fs-4" />
              </div>
              <div>
                <div className="text-muted small">Suspended</div>
                <div className="fs-4 fw-bold">{suspendedCount}</div>
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
              <input
                type="search"
                className="form-control rounded-3"
                placeholder="Search by name or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select 
                className="form-select rounded-3"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="col-md-3">
              <Button variant="outline-secondary" className="w-100" onClick={() => { setSearchTerm(''); setFilterStatus('all') }}>
                <i className="bi bi-arrow-clockwise me-2" />Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Technicians Grid */}
      <div className="row g-4">
        {loading ? (
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mb-0">Loading technicians...</p>
            </div>
          </div>
        ) : filteredTechs.length === 0 ? (
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
              <i className="bi bi-inbox fs-1 text-muted mb-3" />
              <p className="text-muted mb-0">No technicians found</p>
            </div>
          </div>
        ) : (
          filteredTechs.map(tech => {
            const status = tech.is_active ? 'approved' : 'suspended'
            const statusColor = getStatusColor(tech.is_active)
            
            return (
            <div key={tech.id} className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  {/* Header */}
                  <div className="d-flex align-items-start gap-3 mb-3">
                    <div 
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: 60, height: 60, fontSize: '1.5rem' }}
                    >
                      {tech.name.charAt(0)}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-start justify-content-between">
                        <div>
                          <h6 className="fw-bold mb-1">{tech.name}</h6>
                          <div className="text-muted small">{tech.email}</div>
                          {tech.specialization_display && (
                            <div className="mt-1">
                              <span className="badge bg-info bg-opacity-10 text-info">
                                <i className="bi bi-tools me-1" />
                                {tech.specialization_display}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-3">
                    <span className={`badge bg-${statusColor} bg-opacity-10 text-${statusColor} px-3 py-2`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <div className="bg-light rounded-3 p-2 text-center">
                        <div className="text-muted small">Rating</div>
                        <div className="fw-bold">
                          <i className="bi bi-star-fill text-warning me-1" />
                          {tech.avg_rating || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-light rounded-3 p-2 text-center">
                        <div className="text-muted small">Jobs</div>
                        <div className="fw-bold">{tech.total_jobs}</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-light rounded-3 p-2 text-center">
                        <div className="text-muted small">Completed</div>
                        <div className="fw-bold">{tech.completed_jobs}</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-light rounded-3 p-2 text-center">
                        <div className="text-muted small">Rate</div>
                        <div className="fw-bold">{tech.completion_rate}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mb-3">
                    <div className="small text-muted mb-1">
                      <i className="bi bi-telephone me-2" />{tech.phone}
                    </div>
                    <div className="small text-muted">
                      <i className="bi bi-calendar me-2" />Joined {new Date(tech.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="d-flex gap-2">
                    {status === 'approved' && (
                      <>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="flex-grow-1"
                          onClick={() => setSelectedTech(tech)}
                        >
                          <i className="bi bi-eye me-1" />View Details
                        </Button>
                        <Button 
                          variant="outline-warning" 
                          size="sm"
                          onClick={() => handleSuspend(tech.id)}
                          title="Suspend"
                        >
                          <i className="bi bi-pause-fill" />
                        </Button>
                      </>
                    )}
                    {status === 'suspended' && (
                      <Button 
                        variant="success" 
                        size="sm" 
                        className="w-100"
                        onClick={() => handleApprove(tech.id)}
                      >
                        <i className="bi bi-play-fill me-1" />Reactivate
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )})
        )}
      </div>

      {/* Technician Details Modal */}
      {selectedTech && (
        <TechnicianModal
          technician={selectedTech}
          onClose={() => setSelectedTech(null)}
        />
      )}
    </div>
  )
}

// Technician Details Modal
const TechnicianModal = ({ technician, onClose }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [specialization, setSpecialization] = useState(technician.specialization || '')
  const [specializationOther, setSpecializationOther] = useState(technician.specialization_other || '')
  const { run, loading } = useAsync()

  const handleSaveSpecialization = async () => {
    await run(async () => {
      await updateTechnicianSpecialization(
        technician.id, 
        specialization,
        specialization === 'Other' ? specializationOther : null
      )
      setIsEditing(false)
      // Reload page to show updated data
      window.location.reload()
    })
  }

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content rounded-4 border-0 shadow-lg">
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold">Technician Details</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-4 text-center mb-4 mb-md-0">
                <div 
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold mx-auto mb-3"
                  style={{ width: 120, height: 120, fontSize: '3rem' }}
                >
                  {technician.name.charAt(0)}
                </div>
                <h5 className="fw-bold mb-1">{technician.name}</h5>
                <div className="text-muted mb-2">{technician.email}</div>
                <div className="mb-3">
                  <i className="bi bi-star-fill text-warning me-1" />
                  <span className="fw-bold">{technician.avg_rating || 'N/A'}</span>
                </div>
              </div>
              <div className="col-md-8">
                <h6 className="fw-bold mb-3">Contact Information</h6>
                <div className="mb-3">
                  <div className="text-muted small">Phone</div>
                  <div className="fw-semibold">{technician.phone}</div>
                </div>
                <div className="mb-3">
                  <div className="text-muted small">Email</div>
                  <div className="fw-semibold">{technician.email}</div>
                </div>
                
                <h6 className="fw-bold mb-3 mt-4">Specialization</h6>
                {!isEditing ? (
                  <div className="mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-info bg-opacity-10 text-info px-3 py-2">
                        <i className="bi bi-tools me-2" />
                        {technician.specialization_display || 'Not set'}
                      </span>
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setIsEditing(true)}
                      >
                        <i className="bi bi-pencil" /> Edit
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <select
                      className="form-select mb-2"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                    >
                      <option value="">Select specialization...</option>
                      {TECHNICIAN_SPECIALIZATIONS.map(spec => (
                        <option key={spec.value} value={spec.value}>
                          {spec.label}
                        </option>
                      ))}
                    </select>
                    {specialization === 'Other' && (
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Specify other specialization..."
                        value={specializationOther}
                        onChange={(e) => setSpecializationOther(e.target.value)}
                      />
                    )}
                    <div className="d-flex gap-2">
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={handleSaveSpecialization}
                        disabled={loading || !specialization}
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => setIsEditing(false)}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                
                <h6 className="fw-bold mb-3 mt-4">Performance</h6>
                <div className="mb-3">
                  <div className="text-muted small">Status</div>
                  <div className="fw-semibold">{technician.is_active ? 'Active' : 'Suspended'}</div>
                </div>
                <div className="mb-3">
                  <div className="text-muted small">Total Jobs Completed</div>
                  <div className="fw-semibold">{technician.total_jobs}</div>
                </div>
                <div className="mb-3">
                  <div className="text-muted small">Completion Rate</div>
                  <div className="fw-semibold">{technician.completion_rate}%</div>
                </div>
                <div className="mb-3">
                  <div className="text-muted small">Joined Date</div>
                  <div className="fw-semibold">{new Date(technician.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer border-0">
            <Button variant="outline-secondary" onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminTechniciansTab
