import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth }    from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'
import DashboardShell from '../features/dashboard/DashboardShell'
import AdminOverviewTab  from '../features/dashboard/admin/AdminOverviewTab'
import AdminBookingsTab  from '../features/dashboard/admin/AdminBookingsTab'
import AdminAnalyticsTab from '../features/dashboard/admin/AdminAnalyticsTab'
import AdminPaymentsTab  from '../features/dashboard/admin/AdminPaymentsTab'
import { ADMIN_NAV, ROUTES } from '../constants'
import { TECHNICIANS as TECH_DATA } from '../api/data'

const TABS = {
  overview:    AdminOverviewTab,
  bookings:    AdminBookingsTab,
  payments:    AdminPaymentsTab,
  analytics:   AdminAnalyticsTab,
  users:       () => <PlaceholderTab icon="people" title="User Management" desc="Manage customer accounts, roles, and permissions." />,
  technicians: () => <PlaceholderTab icon="person-badge" title="Technician Management" desc="Approve, suspend, and manage technician profiles." />,
  services:    () => <PlaceholderTab icon="tools" title="Service Configuration" desc="Add, edit, and manage service offerings and pricing." />,
}

/**
 * AdminPage — Admin dashboard.
 * Role-restricted: roles={['admin']}
 */
const AdminPage = () => {
  const { user, logout }          = useAuth()
  const { bookings, getStats }    = useBooking()
  const navigate                  = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  const stats = getStats()
  const adminStats = {
    revenue:     `৳${bookings.filter(b => b.status === 'completed').reduce((s, b) => s + (b.amount || 0), 0)}`,
    bookings:    bookings.length,
    users:       '1,240',
    technicians: TECH_DATA.length,
  }

  const handleLogout = () => { logout(); navigate(ROUTES.HOME) }
  const ActiveTab = TABS[activeTab] || TABS.overview

  return (
    <DashboardShell
      navItems={ADMIN_NAV}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
      user={{ ...user, role: 'Admin' }}
      accentColor="#7c3aed"
    >
      <ActiveTab bookings={bookings} adminStats={adminStats} stats={stats} />
    </DashboardShell>
  )
}

const PlaceholderTab = ({ icon, title, desc }) => (
  <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
    <i className={`bi bi-${icon} text-primary mb-3`} style={{ fontSize: '3rem' }} />
    <h5 className="fw-bold mb-2">{title}</h5>
    <p className="text-muted mb-0">{desc}</p>
  </div>
)

export default AdminPage
