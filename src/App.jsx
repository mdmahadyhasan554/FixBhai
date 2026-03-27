import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { BookingProvider } from './context/BookingContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import ErrorBoundary from './components/common/ErrorBoundary'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import TechniciansPage from './pages/TechniciansPage'
import BookingPage from './pages/BookingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import { ROUTES } from './constants'

// Wraps a page with the shared Navbar + Footer layout
const WithLayout = ({ children }) => <Layout>{children}</Layout>

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BookingProvider>
          <Routes>
            <Route path={ROUTES.HOME}         element={<WithLayout><HomePage /></WithLayout>} />
            <Route path={ROUTES.SERVICES}     element={<WithLayout><ServicesPage /></WithLayout>} />
            <Route path={ROUTES.TECHNICIANS}  element={<WithLayout><TechniciansPage /></WithLayout>} />
            <Route path={ROUTES.BOOKING}      element={<WithLayout><BookingPage /></WithLayout>} />
            <Route path={ROUTES.LOGIN}        element={<WithLayout><LoginPage /></WithLayout>} />
            <Route path={ROUTES.REGISTER}     element={<WithLayout><RegisterPage /></WithLayout>} />
            <Route path={ROUTES.DASHBOARD}    element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
          </Routes>
        </BookingProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
