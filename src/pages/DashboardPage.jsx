import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth }    from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'
import DashboardSidebar from '../features/dashboard/DashboardSidebar'
import DashboardTopBar  from '../features/dashboard/DashboardTopBar'
import OverviewTab      from '../features/dashboard/OverviewTab'
import BookingsTab      from '../features/dashboard/BookingsTab'
import ProfileTab       from '../features/dashboard/ProfileTab'
import { ROUTES } from '../constants'

const TAB_COMPONENTS = {
  overview: OverviewTab,
  bookings: BookingsTab,
  profile:  ProfileTab,
}

/**
 * DashboardPage
 * Assembles sidebar + top bar + active tab.
 * Contains zero UI markup — all layout is delegated to feature components.
 */
const DashboardPage = () => {
  const { user, logout }                              = useAuth()
  const { bookings, updateStatus, cancelBooking, getStats } = useBooking()
  const navigate                             = useNavigate()
  const [activeTab, setActiveTab]            = useState('overview')

  if (!user) { navigate(ROUTES.LOGIN); return null }

  const stats      = getStats()
  const ActiveTab  = TAB_COMPONENTS[activeTab]
  const handleLogout = () => { logout(); navigate(ROUTES.HOME) }

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="flex-grow-1 overflow-auto">
        <DashboardTopBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          user={user}
        />

        <div className="p-4">
          <ActiveTab
            user={user}
            stats={stats}
            bookings={bookings}
            onViewAll={() => setActiveTab('bookings')}
            onCancel={id => cancelBooking(id)}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
