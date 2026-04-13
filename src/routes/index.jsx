import { Routes, Route, Navigate } from 'react-router-dom'
import Layout          from '../components/layout/Layout'
import ProtectedRoute  from '../components/common/ProtectedRoute'
import GuestRoute      from '../components/common/GuestRoute'
import { BookingProvider } from '../context/BookingContext'
import { ROUTES }      from '../constants'

// ── Pages ─────────────────────────────────────────────────
import HomePage             from '../pages/HomePage'
import ServicesPage         from '../pages/ServicesPage'
import TechniciansPage      from '../pages/TechniciansPage'
import BookingPage          from '../pages/BookingPage'
import LoginPage            from '../pages/LoginPage'
import RegisterPage         from '../pages/RegisterPage'
import DashboardPage        from '../pages/DashboardPage'
import AdminPage            from '../pages/AdminPage'
import TechnicianPortalPage from '../pages/TechnicianPortalPage'
import NotFoundPage         from '../pages/NotFoundPage'

/**
 * AppRoutes — single source of truth for all application routes.
 *
 * Route categories:
 *   Public      — accessible by anyone
 *   Guest-only  — redirect authenticated users away (login, register)
 *   Protected   — require authentication
 *   Role-based  — require authentication + specific role
 *   Catch-all   — 404 for unmatched paths
 *
 * Layout:
 *   All routes except DashboardPage, AdminPage, TechnicianPortalPage
 *   are wrapped in <Layout> (Navbar + Footer).
 *   Dashboard-style pages manage their own full-screen layout.
 * 
 * BookingProvider:
 *   Only wraps routes that need booking data to prevent unnecessary
 *   API calls on public pages.
 */

/** Wraps a page with the shared Navbar + Footer shell */
const WithLayout = ({ children }) => <Layout>{children}</Layout>

/** Wraps a page with BookingProvider for booking data access */
const WithBookings = ({ children }) => <BookingProvider>{children}</BookingProvider>

const AppRoutes = () => (
  <Routes>

    {/* ── Public routes (Layout wrapped) ─────────────────── */}
    <Route
      path={ROUTES.HOME}
      element={<WithLayout><HomePage /></WithLayout>}
    />
    <Route
      path={ROUTES.SERVICES}
      element={<WithLayout><ServicesPage /></WithLayout>}
    />
    <Route
      path={ROUTES.TECHNICIANS}
      element={<WithLayout><TechniciansPage /></WithLayout>}
    />

    {/* Booking requires auth — redirect to login if not authenticated */}
    <Route
      path={ROUTES.BOOKING}
      element={
        <ProtectedRoute>
          <WithBookings>
            <WithLayout><BookingPage /></WithLayout>
          </WithBookings>
        </ProtectedRoute>
      }
    />

    {/* ── Guest-only routes (redirect if already logged in) ── */}
    <Route
      path={ROUTES.LOGIN}
      element={
        <GuestRoute>
          <WithLayout><LoginPage /></WithLayout>
        </GuestRoute>
      }
    />
    <Route
      path={ROUTES.REGISTER}
      element={
        <GuestRoute>
          <WithLayout><RegisterPage /></WithLayout>
        </GuestRoute>
      }
    />

    {/* ── Protected routes (any authenticated user) ──────── */}
    <Route
      path={ROUTES.DASHBOARD}
      element={
        <ProtectedRoute>
          <WithBookings>
            <DashboardPage />
          </WithBookings>
        </ProtectedRoute>
      }
    />

    {/* ── Role-based routes ───────────────────────────────── */}

    {/* Admin only */}
    <Route
      path={ROUTES.ADMIN}
      element={
        <ProtectedRoute roles={['admin']} fallback={ROUTES.DASHBOARD}>
          <WithBookings>
            <WithLayout><AdminPage /></WithLayout>
          </WithBookings>
        </ProtectedRoute>
      }
    />

    {/* Technician only */}
    <Route
      path={ROUTES.TECH_PORTAL}
      element={
        <ProtectedRoute roles={['technician']} fallback={ROUTES.DASHBOARD}>
          <WithBookings>
            <TechnicianPortalPage />
          </WithBookings>
        </ProtectedRoute>
      }
    />

    {/* ── Convenience redirects ───────────────────────────── */}
    <Route path="/home" element={<Navigate to={ROUTES.HOME} replace />} />

    {/* ── 404 catch-all ───────────────────────────────────── */}
    <Route
      path={ROUTES.NOT_FOUND}
      element={<WithLayout><NotFoundPage /></WithLayout>}
    />

  </Routes>
)

export default AppRoutes
