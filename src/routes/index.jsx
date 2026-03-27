import { Routes, Route } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import ProtectedRoute from '../components/common/ProtectedRoute'
import { ROUTES } from '../constants'

// Pages
import HomePage        from '../pages/HomePage'
import ServicesPage    from '../pages/ServicesPage'
import TechniciansPage from '../pages/TechniciansPage'
import BookingPage     from '../pages/BookingPage'
import LoginPage       from '../pages/LoginPage'
import RegisterPage    from '../pages/RegisterPage'
import DashboardPage   from '../pages/DashboardPage'

/**
 * AppRoutes — single source of truth for all application routes.
 *
 * Wrapping logic lives here so App.jsx stays clean.
 * Add new routes in this file only.
 */
const WithLayout = ({ children }) => <Layout>{children}</Layout>

const AppRoutes = () => (
  <Routes>
    <Route path={ROUTES.HOME}        element={<WithLayout><HomePage /></WithLayout>} />
    <Route path={ROUTES.SERVICES}    element={<WithLayout><ServicesPage /></WithLayout>} />
    <Route path={ROUTES.TECHNICIANS} element={<WithLayout><TechniciansPage /></WithLayout>} />
    <Route path={ROUTES.BOOKING}     element={<WithLayout><BookingPage /></WithLayout>} />
    <Route path={ROUTES.LOGIN}       element={<WithLayout><LoginPage /></WithLayout>} />
    <Route path={ROUTES.REGISTER}    element={<WithLayout><RegisterPage /></WithLayout>} />
    <Route path={ROUTES.DASHBOARD}   element={
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    } />
  </Routes>
)

export default AppRoutes
