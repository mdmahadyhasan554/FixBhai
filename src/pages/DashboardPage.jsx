import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth }    from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'
import DashboardShell from '../features/dashboard/DashboardShell'
import OverviewTab    from '../features/dashboard/OverviewTab'
import BookingsTab    from '../features/dashboard/BookingsTab'
import ProfileTab     from '../features/dashboard/ProfileTab'
import { DASHBOARD_NAV, ROUTES } from '../constants'

const TABS = {
  overview: OverviewTab,
  bookings: BookingsTab,
  profile:  ProfileTab,
}

/**
 * DashboardPage — Customer dashboard.
 * Pure orchestrator — delegates all UI to DashboardShell + tab components.
 */
const DashboardPage = () => {
  const { user, logout }                              = useAuth()
  const { bookings, cancelBooking, getStats }         = useBooking()
  const navigate                                      = useNavigate()
  const [activeTab, setActiveTab]                     = useState('overview')

  if (!user) { navigate(ROUTES.LOGIN); return null }

  const stats      = getStats()
  const ActiveTab  = TABS[activeTab]
  const handleLogout = () => { logout(); navigate(ROUTES.HOME) }

  return (
    <DashboardShell
      navItems={DASHBOARD_NAV}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
      user={user}
      accentColor="#2563eb"
    >
      <ActiveTab
        user={user}
        stats={stats}
        bookings={bookings}
        onViewAll={() => setActiveTab('bookings')}
        onCancel={id => cancelBooking(id)}
        onLogout={handleLogout}
      />
    </DashboardShell>
  )
}

export default DashboardPage
