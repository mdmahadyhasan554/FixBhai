import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const RegisterForm = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    login({ name: form.name, email: form.email, role: 'customer' }, 'demo_token_456')
    navigate('/dashboard')
    setLoading(false)
  }

  return (
    <div className="auth-card p-4 p-md-5 shadow-sm">
      <div className="text-center mb-4">
        <div className="mb-3">
          <i className="bi bi-person-plus text-primary" style={{ fontSize: '2.5rem' }} />
        </div>
        <h4 className="fw-bold">Create Account</h4>
        <p className="text-muted small">Join FixBhai for trusted home services</p>
      </div>
      <form onSubmit={handleSubmit}>
        <Input label="Full Name" icon="person" placeholder="Your full name"
          value={form.name} onChange={e => update('name', e.target.value)} required />
        <Input label="Email Address" icon="envelope" type="email" placeholder="you@example.com"
          value={form.email} onChange={e => update('email', e.target.value)} required />
        <Input label="Phone Number" icon="telephone" type="tel" placeholder="+91 98765 43210"
          value={form.phone} onChange={e => update('phone', e.target.value)} required />
        <Input label="Password" icon="lock" type="password" placeholder="Create a password"
          value={form.password} onChange={e => update('password', e.target.value)} required />
        <Button type="submit" loading={loading} className="w-100 py-2 rounded-3 mt-2">
          Create Account
        </Button>
      </form>
      <p className="text-center text-muted small mt-4 mb-0">
        Already have an account? <Link to="/login" className="text-primary fw-semibold">Sign in</Link>
      </p>
    </div>
  )
}

export default RegisterForm
