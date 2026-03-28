import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth }    from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'
import DashboardShell from '../features/dashboard/DashboardShell'
import TechOverviewTab from '../features/dashboard/technician/TechOverviewTab'
import BookingsTab     from '../features/dashboard/BookingsTab'
import ProfileTab      from '../features/dashboard/ProfileTab'
import { TECH_NAV, ROUTES } from '../constants'

const TABS = {
  overview:  TechOverviewTab,
  jobs:      BookingsTab,
  schedule:  () => <PlaceholderTab icon="calendar3"  title="Schedule"  desc="View and manage your upcoming job schedule." />,
  earnings:  () => <PlaceholderTab icon="wallet2"    title="Earnings"  desc="Track your earnings, payouts, and transaction history." />,
  profile:   ProfileTab,
}

/**
 * TechnicianPortalPage — Technician dashboard.
 * Role-restricted: roles={['technician']}
 */
const TechnicianPortalPage = () => {
  const { user, logout }          = useAuth()
  const { bookings, getStats, cancelBooking } = useBooking()
  const navigate                  = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  const stats = getStats()
  const techStats = {
    today:     bookings.filter(b => b.status === 'confirmed').length,
    completed: stats.completed,
    month:     bookings.length,
    earnings:  `৳${bookings.filter(b => b.status === 'completed').reduce((s, b) => s + (b.amount || 0), 0)}`,
  }

  const handleLogout = () => { logout(); navigate(ROUTES.HOME) }
  const ActiveTab = TABS[activeTab] || TABS.overview

  return (
    <DashboardShell
      navItems={TECH_NAV}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
      user={{ ...user, role: 'Technician' }}
      accentColor="#059669"
    >
      <ActiveTab
        user={user}
        stats={stats}
        techStats={techStats}
        bookings={bookings}
        onCancel={id => cancelBooking(id)}
        onLogout={handleLogout}
      />
    </DashboardShell>
  )
}

const PlaceholderTab = ({ icon, title, desc }) => (
  <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
    <i className={`bi bi-${icon} text-success mb-3`} style={{ fontSize: '3rem' }} />
    <h5 className="fw-bold mb-2">{title}</h5>
    <p className="text-muted mb-0">{desc}</p>
  </div>
)

export default TechnicianPortalPage
