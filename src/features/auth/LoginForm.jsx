import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    // Demo login
    if (form.email && form.password) {
      login({ name: form.email.split('@')[0], email: form.email, role: 'customer' }, 'demo_token_123')
      navigate('/dashboard')
    } else {
      setError('Please enter valid credentials')
    }
    setLoading(false)
  }

  return (
    <div className="auth-card p-4 p-md-5 shadow-sm">
      <div className="text-center mb-4">
        <div className="mb-3">
          <i className="bi bi-tools text-primary" style={{ fontSize: '2.5rem' }} />
        </div>
        <h4 className="fw-bold">Welcome back</h4>
        <p className="text-muted small">Sign in to your FixBhai account</p>
      </div>
      {error && <div className="alert alert-danger rounded-3 py-2 small">{error}</div>}
      <form onSubmit={handleSubmit}>
        <Input label="Email Address" icon="envelope" type="email" placeholder="you@example.com"
          value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
        <Input label="Password" icon="lock" type="password" placeholder="Enter password"
          value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
        <div className="d-flex justify-content-end mb-3">
          <a href="#" className="small text-primary">Forgot password?</a>
        </div>
        <Button type="submit" loading={loading} className="w-100 py-2 rounded-3">
          Sign In
        </Button>
      </form>
      <p className="text-center text-muted small mt-4 mb-0">
        Don't have an account? <Link to="/register" className="text-primary fw-semibold">Sign up</Link>
      </p>
    </div>
  )
}

export default LoginForm
