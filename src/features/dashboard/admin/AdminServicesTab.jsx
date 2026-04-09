import { useState } from 'react'
import { SERVICES } from '../../../api/data'
import Button from '../../../components/ui/Button'

/**
 * AdminServicesTab
 * Manage service offerings, pricing, and categories
 */
const AdminServicesTab = () => {
  const [services, setServices] = useState(SERVICES)
  const [showModal, setShowModal] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddService = () => {
    setSelectedService(null)
    setShowModal(true)
  }

  const handleEditService = (service) => {
    setSelectedService(service)
    setShowModal(true)
  }

  const handleDeleteService = (id) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(prev => prev.filter(s => s.id !== id))
    }
  }

  const handleSaveService = (serviceData) => {
    if (selectedService) {
      setServices(prev => prev.map(s => s.id === selectedService.id ? { ...s, ...serviceData } : s))
    } else {
      setServices(prev => [...prev, { ...serviceData, id: Date.now(), bookings: 0, rating: 4.5 }])
    }
    setShowModal(false)
  }

  const totalBookings = services.reduce((sum, s) => sum + s.bookings, 0)
  const avgRating = (services.reduce((sum, s) => sum + s.rating, 0) / services.length).toFixed(1)
  const totalRevenue = services.reduce((sum, s) => sum + (s.price * s.bookings), 0)

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Service Management</h4>
          <p className="text-muted mb-0">Manage service offerings, pricing, and categories</p>
        </div>
        <Button variant="primary" onClick={handleAddService}>
          <i className="bi bi-plus-circle me-2" />Add Service
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-primary bg-opacity-10 p-3">
                <i className="bi bi-tools text-primary fs-4" />
              </div>
              <div>
                <div className="text-muted small">Total Services</div>
                <div className="fs-4 fw-bold">{services.length}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-success bg-opacity-10 p-3">
                <i className="bi bi-calendar-check text-success fs-4" />
              </div>
              <div>
                <div className="text-muted small">Total Bookings</div>
                <div className="fs-4 fw-bold">{totalBookings}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-warning bg-opacity-10 p-3">
                <i className="bi bi-star-fill text-warning fs-4" />
              </div>
              <div>
                <div className="text-muted small">Avg Rating</div>
                <div className="fs-4 fw-bold">{avgRating}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-info bg-opacity-10 p-3">
                <i className="bi bi-currency-dollar text-info fs-4" />
              </div>
              <div>
                <div className="text-muted small">Revenue</div>
                <div className="fs-4 fw-bold">৳{totalRevenue.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body">
          <input
            type="search"
            className="form-control rounded-3"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="row g-4">
        {filteredServices.length === 0 ? (
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
              <i className="bi bi-inbox fs-1 text-muted mb-3" />
              <p className="text-muted mb-0">No services found</p>
            </div>
          </div>
        ) : (
          filteredServices.map(service => (
            <div key={service.id} className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  {/* Icon */}
                  <div 
                    className="rounded-4 d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ 
                      width: 60, 
                      height: 60, 
                      background: service.color,
                      color: service.iconColor 
                    }}
                  >
                    <i className={`bi bi-${service.icon} fs-3`} />
                  </div>

                  {/* Name & Category */}
                  <h5 className="fw-bold mb-2">{service.name}</h5>
                  <div className="text-muted small mb-3">{service.category}</div>

                  {/* Stats */}
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <div className="bg-light rounded-3 p-2">
                        <div className="text-muted small">Price</div>
                        <div className="fw-bold">৳{service.price}</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-light rounded-3 p-2">
                        <div className="text-muted small">Rating</div>
                        <div className="fw-bold">
                          <i className="bi bi-star-fill text-warning me-1" />
                          {service.rating}
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="bg-light rounded-3 p-2">
                        <div className="text-muted small">Total Bookings</div>
                        <div className="fw-bold">{service.bookings.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="flex-grow-1"
                      onClick={() => handleEditService(service)}
                    >
                      <i className="bi bi-pencil me-1" />Edit
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <i className="bi bi-trash" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Service Modal */}
      {showModal && (
        <ServiceModal
          service={selectedService}
          onClose={() => setShowModal(false)}
          onSave={handleSaveService}
        />
      )}
    </div>
  )
}

// Service Modal Component
const ServiceModal = ({ service, onClose, onSave }) => {
  const [formData, setFormData] = useState(service || {
    name: '',
    category: 'appliance',
    price: 0,
    icon: 'tools',
    color: '#dbeafe',
    iconColor: '#2563eb'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const ICONS = [
    'tools', 'wind', 'droplet', 'lightning-charge', 'stars', 'brush', 
    'hammer', 'bug', 'camera-video', 'wrench', 'paint-bucket', 'gear'
  ]

  const COLORS = [
    { bg: '#dbeafe', text: '#2563eb', name: 'Blue' },
    { bg: '#d1fae5', text: '#059669', name: 'Green' },
    { bg: '#fef3c7', text: '#d97706', name: 'Yellow' },
    { bg: '#ede9fe', text: '#7c3aed', name: 'Purple' },
    { bg: '#fce7f3', text: '#db2777', name: 'Pink' },
    { bg: '#ffedd5', text: '#ea580c', name: 'Orange' },
  ]

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content rounded-4 border-0 shadow-lg">
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold">{service ? 'Edit Service' : 'Add New Service'}</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Service Name</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Category</label>
                  <select
                    className="form-select rounded-3"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="appliance">AC & Appliances</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="painting">Painting</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="pest">Pest Control</option>
                    <option value="security">Security</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Base Price (৳)</label>
                  <input
                    type="number"
                    className="form-control rounded-3"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                    min="0"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Icon</label>
                  <select
                    className="form-select rounded-3"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  >
                    {ICONS.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Color Theme</label>
                  <div className="d-flex gap-2 flex-wrap">
                    {COLORS.map(color => (
                      <button
                        key={color.name}
                        type="button"
                        className={`btn rounded-3 ${formData.color === color.bg ? 'border-primary border-2' : 'border'}`}
                        style={{ background: color.bg, color: color.text, width: 80 }}
                        onClick={() => setFormData({ ...formData, color: color.bg, iconColor: color.text })}
                      >
                        <i className={`bi bi-${formData.icon}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-4 p-3 bg-light rounded-3">
                <div className="small text-muted mb-2">Preview:</div>
                <div 
                  className="rounded-4 d-inline-flex align-items-center justify-content-center"
                  style={{ 
                    width: 60, 
                    height: 60, 
                    background: formData.color,
                    color: formData.iconColor 
                  }}
                >
                  <i className={`bi bi-${formData.icon} fs-3`} />
                </div>
                <div className="mt-2 fw-bold">{formData.name || 'Service Name'}</div>
                <div className="text-muted small">{formData.category}</div>
                <div className="fw-bold mt-1">৳{formData.price}</div>
              </div>
            </div>
            <div className="modal-footer border-0">
              <Button variant="outline-secondary" onClick={onClose}>Cancel</Button>
              <Button variant="primary" type="submit">
                {service ? 'Update Service' : 'Add Service'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminServicesTab
