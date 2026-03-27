import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { BookingProvider } from './context/BookingContext'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import TechniciansPage from './pages/TechniciansPage'
import BookingPage from './pages/BookingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'

const WithLayout = ({ children }) => <Layout>{children}</Layout>

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Routes>
          <Route path="/" element={<WithLayout><HomePage /></WithLayout>} />
          <Route path="/services" element={<WithLayout><ServicesPage /></WithLayout>} />
          <Route path="/technicians" element={<WithLayout><TechniciansPage /></WithLayout>} />
          <Route path="/booking" element={<WithLayout><BookingPage /></WithLayout>} />
          <Route path="/login" element={<WithLayout><LoginPage /></WithLayout>} />
          <Route path="/register" element={<WithLayout><RegisterPage /></WithLayout>} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </BookingProvider>
    </AuthProvider>
  )
}

export default App
