import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'
import DashboardSidebar from '../features/dashboard/DashboardSidebar'
import OverviewTab from '../features/dashboard/OverviewTab'
import BookingsTab from '../features/dashboard/BookingsTab'
import ProfileTab from '../features/dashboard/ProfileTab'
import { DASHBOARD_NAV, ROUTES } from '../constants'

const TAB_COMPONENTS = {
  overview: OverviewTab,
  bookings: BookingsTab,
  profile:  ProfileTab,
}

const DashboardPage = () => {
  const { user, logout }              = useAuth()
  const { bookings, updateStatus, getStats } = useBooking()
  const navigate                      = useNavigate()
  const [activeTab, setActiveTab]     = useState('overview')

  if (!user) { navigate(ROUTES.LOGIN); return null }

  const stats       = getStats()
  const ActiveTab   = TAB_COMPONENTS[activeTab]
  const handleLogout = () => { logout(); navigate(ROUTES.HOME) }

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="flex-grow-1 overflow-auto">
        {/* Top bar */}
        <div className="bg-white border-bottom px-4 py-3 d-flex align-items-center justify-content-between sticky-top">
          <h5 className="fw-bold mb-0">
            {DASHBOARD_NAV.find(n => n.key === activeTab)?.label}
          </h5>
          <div className="d-flex align-items-center gap-3">
            {/* Mobile tab switcher */}
            <div className="d-flex d-lg-none gap-1">
              {DASHBOARD_NAV.map(item => (
                <button key={item.key}
                  className={`btn btn-sm rounded-pill ${activeTab === item.key ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setActiveTab(item.key)}>
                  <i className={`bi bi-${item.icon}`} />
                </button>
              ))}
            </div>
            <div className="d-flex align-items-center gap-2">
              <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
                style={{ width: 36, height: 36, fontSize: '0.9rem' }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="fw-semibold d-none d-md-inline">{user.name}</span>
            </div>
          </div>
        </div>

        {/* Active tab content */}
        <div className="p-4">
          <ActiveTab
            user={user}
            stats={stats}
            bookings={bookings}
            onViewAll={() => setActiveTab('bookings')}
            onCancel={id => updateStatus(id, 'cancelled')}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
