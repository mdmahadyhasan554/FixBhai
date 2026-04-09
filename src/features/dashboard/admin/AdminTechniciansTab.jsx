import { useState } from 'react'
import { TECHNICIANS } from '../../../api/data'
import Button from '../../../components/ui/Button'
import StatusBadge from '../../../components/common/StatusBadge'

/**
 * AdminTechniciansTab
 * Manage technician profiles, approvals, and performance
 */
const AdminTechniciansTab = () => {
  const [technicians, setTechnicians] = useState(TECHNICIANS.map(t => ({
    ...t,
    status: t.available ? 'approved' : 'pending',
    totalJobs: Math.floor(Math.random() * 100) + 20,
    completionRate: (Math.random() * 20 + 80).toFixed(1)
  })))
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTech, setSelectedTech] = useState(null)

  const filteredTechs = technicians.filter(tech => {
    const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tech.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || tech.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleApprove = (id) => {
    setTechnicians(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'approved', available: true } : t
    ))
  }

  const handleSuspend = (id) => {
    setTechnicians(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'suspended', available: false } : t
    ))
  }

  const handleReject = (id) => {
    if (confirm('Are you sure you want to reject this technician?')) {
      setTechnicians(prev => prev.filter(t => t.id !== id))
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'success'
      case 'pending': return 'warning'
      case 'suspended': return 'danger'
      default: return 'secondary'
    }
  }

  const pendingCount = technicians.filter(t => t.status === 'pending').length
  const approvedCount = technicians.filter(t => t.status === 'approved').length
  const suspendedCount = technicians.filter(t => t.status === 'suspended').length

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Technician Management</h4>
          <p className="text-muted mb-0">Approve, manage, and monitor technician performance</p>
        </div>
        {pendingCount > 0 && (
          <span className="badge bg-warning text-dark px-3 py-2">
            {pendingCount} Pending Approval{pendingCount > 1 ? 's' : ''}
          </span>
        )}
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
        {filteredTechs.length === 0 ? (
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
              <i className="bi bi-inbox fs-1 text-muted mb-3" />
              <p className="text-muted mb-0">No technicians found</p>
            </div>
          </div>
        ) : (
          filteredTechs.map(tech => (
            <div key={tech.id} className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  {/* Header */}
                  <div className="d-flex align-items-start gap-3 mb-3">
                    <img
                      src={tech.avatar}
                      alt={tech.name}
                      className="rounded-circle"
                      style={{ width: 60, height: 60, objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-start justify-content-between">
                        <div>
                          <h6 className="fw-bold mb-1">{tech.name}</h6>
                          <div className="text-muted small">{tech.service}</div>
                        </div>
                        {tech.verified && (
                          <i className="bi bi-patch-check-fill text-primary" title="Verified" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-3">
                    <span className={`badge bg-${getStatusColor(tech.status)} bg-opacity-10 text-${getStatusColor(tech.status)} px-3 py-2`}>
                      {tech.status.charAt(0).toUpperCase() + tech.status.slice(1)}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <div className="bg-light rounded-3 p-2 text-center">
                        <div className="text-muted small">Rating</div>
                        <div className="fw-bold">
                          <i className="bi bi-star-fill text-warning me-1" />
                          {tech.rating}
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-light rounded-3 p-2 text-center">
                        <div className="text-muted small">Jobs</div>
                        <div className="fw-bold">{tech.totalJobs}</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-light rounded-3 p-2 text-center">
                        <div className="text-muted small">Experience</div>
                        <div className="fw-bold">{tech.experience}</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-light rounded-3 p-2 text-center">
                        <div className="text-muted small">Completion</div>
                        <div className="fw-bold">{tech.completionRate}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mb-3">
                    <div className="small text-muted mb-1">
                      <i className="bi bi-telephone me-2" />{tech.phone}
                    </div>
                    <div className="small text-muted">
                      <i className="bi bi-geo-alt me-2" />{tech.location}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="d-flex gap-2">
                    {tech.status === 'pending' && (
                      <>
                        <Button 
                          variant="success" 
                          size="sm" 
                          className="flex-grow-1"
                          onClick={() => handleApprove(tech.id)}
                        >
                          <i className="bi bi-check-lg me-1" />Approve
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleReject(tech.id)}
                        >
                          <i className="bi bi-x-lg" />
                        </Button>
                      </>
                    )}
                    {tech.status === 'approved' && (
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
                    {tech.status === 'suspended' && (
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
          ))
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
const TechnicianModal = ({ technician, onClose }) => (
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
              <img
                src={technician.avatar}
                alt={technician.name}
                className="rounded-circle mb-3"
                style={{ width: 120, height: 120, objectFit: 'cover' }}
              />
              <h5 className="fw-bold mb-1">{technician.name}</h5>
              <div className="text-muted mb-2">{technician.service}</div>
              <div className="mb-3">
                <i className="bi bi-star-fill text-warning me-1" />
                <span className="fw-bold">{technician.rating}</span>
                <span className="text-muted small"> ({technician.reviews} reviews)</span>
              </div>
            </div>
            <div className="col-md-8">
              <h6 className="fw-bold mb-3">Contact Information</h6>
              <div className="mb-3">
                <div className="text-muted small">Phone</div>
                <div className="fw-semibold">{technician.phone}</div>
              </div>
              <div className="mb-3">
                <div className="text-muted small">Location</div>
                <div className="fw-semibold">{technician.location}</div>
              </div>
              <div className="mb-3">
                <div className="text-muted small">Experience</div>
                <div className="fw-semibold">{technician.experience}</div>
              </div>
              <div className="mb-3">
                <div className="text-muted small">Hourly Rate</div>
                <div className="fw-semibold">৳{technician.price}/hr</div>
              </div>
              <div className="mb-3">
                <div className="text-muted small">Total Jobs Completed</div>
                <div className="fw-semibold">{technician.totalJobs}</div>
              </div>
              <div className="mb-3">
                <div className="text-muted small">Completion Rate</div>
                <div className="fw-semibold">{technician.completionRate}%</div>
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

export default AdminTechniciansTab
