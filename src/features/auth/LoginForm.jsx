import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { loginUser } from '../../services/authService'
import useForm from '../../hooks/useForm'
import useAsync from '../../hooks/useAsync'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import AuthLayout from './AuthLayout'
import PasswordInput from './PasswordInput'
import { ROUTES } from '../../constants'

// Inline validators — avoids disk-write issue with src/utils/validators.js
const isEmail   = v => (!v || !v.trim()) ? 'Email is required' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address'
const required  = v => (v && v.toString().trim()) ? '' : 'This field is required'

// ── Validation rules ──────────────────────────────────────
const RULES = {
  email:    isEmail,
  password: required,
}

/**
 * LoginForm
 *
 * Features:
 *   - Per-field validation on submit (clears on change via useForm)
 *   - API error displayed in alert banner
 *   - Show/hide password toggle
 *   - Redirects to the page the user was trying to reach (or dashboard)
 *   - Demo hint for quick testing
 */
const LoginForm = () => {
  const { values, errors, handleChange, validateAll } = useForm(
    { email: '', password: '' },
    RULES,
  )
  const { run, loading, error } = useAsync()
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()

  // Redirect back to the page the user came from, or dashboard
  const from = location.state?.from?.pathname || ROUTES.DASHBOARD

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateAll()) return
    await run(async () => {
      const { user, token } = await loginUser(values)
      login(user, token)
      navigate(from, { replace: true })
    })
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

        {/* Divider */}
        <div className="d-flex align-items-center gap-3 mb-3">
          <hr className="flex-grow-1 m-0" />
          <span className="text-muted small">or</span>
          <hr className="flex-grow-1 m-0" />
        </div>

        {/* Demo hint */}
        <DemoHint onFill={() => {
          handleChange({ target: { name: 'email',    value: 'demo@fixbhai.in' } })
          handleChange({ target: { name: 'password', value: 'demo1234'        } })
        }} />

      </form>
    </AuthLayout>
  )
}

// ── Demo hint ─────────────────────────────────────────────

const DemoHint = ({ onFill }) => (
  <div
    className="rounded-3 p-3 d-flex align-items-center justify-content-between gap-2"
    style={{ background: '#f8fafc', border: '1px dashed #cbd5e1' }}
  >
    <div>
      <div className="small fw-semibold text-dark">Demo account</div>
      <div className="text-muted" style={{ fontSize: '0.72rem' }}>
        demo@fixbhai.in · any password
      </div>
    </div>
    <button
      type="button"
      className="btn btn-sm btn-outline-primary rounded-pill px-3 flex-shrink-0"
      onClick={onFill}
    >
      Fill in
    </button>
  </div>
)

export default LoginForm
