import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import useAsync from '../../hooks/useAsync'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import AuthLayout from './AuthLayout'
import PasswordInput from './PasswordInput'
import { ROUTES } from '../../constants'

// Inline validators — Bangladesh localised
const required         = v => (v && v.toString().trim()) ? '' : 'This field is required'
const isEmail          = v => (!v || !v.trim()) ? 'Email is required' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address'
// BD phone: must start with 01, exactly 11 digits
const isPhone          = v => {
  if (!v || !v.trim()) return 'Phone number is required'
  const clean = v.replace(/\s/g, '')
  if (!/^01[0-9]{9}$/.test(clean)) return 'Enter a valid BD number (01XXXXXXXXX)'
  return ''
}
const isStrongPassword = v => {
  if (!v) return 'Password is required'
  if (v.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(v)) return 'Include at least one uppercase letter'
  if (!/[0-9]/.test(v)) return 'Include at least one number'
  return ''
}
const matchesField = (other) => v => v === other ? '' : 'Passwords do not match'

const INITIAL = { name: '', email: '', phone: '', password: '', confirmPassword: '', terms: false }

/**
 * RegisterForm — uses AuthContext.register() which owns loading + error state.
 */
const RegisterForm = () => {
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const { register, loading, error, clearError } = useAuth()
  const navigate = useNavigate()

  const set = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    set(name, type === 'checkbox' ? checked : value)
  }

  const validate = () => {
    const rules = {
      name:            required,
      email:           isEmail,
      phone:           isPhone,
      password:        isStrongPassword,
      confirmPassword: matchesField(values.password),
      terms:           v => v ? '' : 'You must accept the terms to continue',
    }
    const newErrors = {}
    let valid = true
    Object.entries(rules).forEach(([field, fn]) => {
      const err = fn(values[field])
      if (err) { newErrors[field] = err; valid = false }
    })
    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    if (!validate()) return
    try {
      const userData = await register(values)
      
      // Role-based redirect after registration
      if (userData?.role === 'admin') {
        navigate(ROUTES.ADMIN, { replace: true })
      } else if (userData?.role === 'technician') {
        navigate(ROUTES.TECH_PORTAL, { replace: true })
      } else {
        navigate(ROUTES.DASHBOARD, { replace: true })
      }
    } catch {
      // error already set in context
    }
  }

  return (
    <AuthLayout
      icon="person-plus"
      title="Create your account"
      subtitle="Join FixBhai for trusted home services"
      error={error}
      footerText="Already have an account?"
      footerLink={{ to: ROUTES.LOGIN, label: 'Sign in' }}
    >
      <form onSubmit={handleSubmit} noValidate aria-label="Registration form">

        {/* Full name */}
        <Input
          label="Full Name"
          icon="person"
          name="name"
          placeholder="Your full name"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          autoComplete="name"
          aria-required="true"
        />

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

        {/* Phone */}
        <Input
          label="Phone Number"
          icon="telephone"
          type="tel"
          name="phone"
          placeholder="01XXXXXXXXX"
          value={values.phone}
          onChange={handleChange}
          error={errors.phone}
          autoComplete="tel"
          hint="Bangladeshi mobile number (e.g. 01712345678)"
          maxLength={11}
          aria-required="true"
        />

        {/* Password + strength meter */}
        <PasswordInput
          label="Password"
          name="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Create a strong password"
          showStrength
        />

        {/* Confirm password */}
        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Re-enter your password"
        />

        {/* Terms */}
        <TermsCheckbox
          checked={values.terms}
          onChange={handleChange}
          error={errors.terms}
        />

        {/* Submit */}
        <Button
          type="submit"
          block
          rounded
          loading={loading}
          className="py-2 mt-3"
        >
          Create Account
        </Button>

      </form>
    </AuthLayout>
  )
}

// ── Sub-components ────────────────────────────────────────

const TermsCheckbox = ({ checked, onChange, error }) => (
  <div className="mb-3">
    <div className="form-check">
      <input
        className={`form-check-input ${error ? 'is-invalid' : ''}`}
        type="checkbox"
        id="terms-checkbox"
        name="terms"
        checked={checked}
        onChange={onChange}
        aria-required="true"
        aria-describedby={error ? 'terms-error' : undefined}
      />
      <label className="form-check-label small" htmlFor="terms-checkbox">
        I agree to the{' '}
        <a href="#" className="text-primary text-decoration-none fw-medium">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="text-primary text-decoration-none fw-medium">Privacy Policy</a>
      </label>
    </div>
    {error && (
      <div id="terms-error" className="invalid-feedback d-block small mt-1" role="alert">
        <i className="bi bi-exclamation-circle me-1" aria-hidden="true" />
        {error}
      </div>
    )}
  </div>
)

export default RegisterForm
