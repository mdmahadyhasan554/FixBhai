import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import useForm from '../../hooks/useForm'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import AuthLayout from './AuthLayout'
import PasswordInput from './PasswordInput'
import { ROUTES } from '../../constants'

// Inline validators
const isEmail  = v => (!v || !v.trim()) ? 'Email is required' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address'
const required = v => (v && v.toString().trim()) ? '' : 'This field is required'

const RULES = { email: isEmail, password: required }

/**
 * LoginForm — uses AuthContext.login() which owns loading + error state.
 */
const LoginForm = () => {
  const { values, errors, handleChange, validateAll } = useForm({ email: '', password: '' }, RULES)
  const { login, loading, error, clearError } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    if (!validateAll()) return
    try {
      const userData = await login(values)
      
      // Role-based redirect after login
      if (from && from !== ROUTES.LOGIN && from !== ROUTES.REGISTER) {
        // If redirected from a protected route, go back there
        navigate(from, { replace: true })
      } else if (userData?.role === 'admin') {
        // Admin users go to admin panel
        navigate(ROUTES.ADMIN, { replace: true })
      } else if (userData?.role === 'technician') {
        // Technicians go to technician portal
        navigate(ROUTES.TECH_PORTAL, { replace: true })
      } else {
        // Customers go to dashboard
        navigate(ROUTES.DASHBOARD, { replace: true })
      }
    } catch {
      // error already set in context
    }
  }

  return (
    <AuthLayout
      icon="tools"
      title="Welcome back"
      subtitle="Sign in to your FixBhai account"
      error={error}
      footerText="Don't have an account?"
      footerLink={{ to: ROUTES.REGISTER, label: 'Sign up free' }}
    >
      <form onSubmit={handleSubmit} noValidate aria-label="Login form">

        {/* Email */}
        <Input
          label="Email Address"
          icon="envelope"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
          aria-required="true"
        />

        {/* Password */}
        <PasswordInput
          label="Password"
          name="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Enter your password"
        />

        {/* Forgot password */}
        <div className="d-flex justify-content-end mb-4" style={{ marginTop: '-8px' }}>
          <a href="#" className="small text-primary text-decoration-none">
            Forgot password?
          </a>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          block
          rounded
          loading={loading}
          className="py-2 mb-3"
        >
          Sign In
        </Button>

      </form>
    </AuthLayout>
  )
}

export default LoginForm
