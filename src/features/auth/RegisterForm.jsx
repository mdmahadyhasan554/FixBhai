import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { registerUser } from '../../services/authService'
import useForm from '../../hooks/useForm'
import useAsync from '../../hooks/useAsync'
import { required, isEmail, minLength } from '../../utils/validators'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { ROUTES } from '../../constants'

const RULES = {
  name:     v => required(v),
  email:    v => isEmail(v),
  phone:    v => required(v),
  password: v => minLength(6)(v),
}

const RegisterForm = () => {
  const { values, errors, handleChange, validateAll } = useForm(
    { name: '', email: '', phone: '', password: '' },
    RULES
  )
  const { run, loading, error } = useAsync()
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateAll()) return
    await run(async () => {
      const { user, token } = await registerUser(values)
      login(user, token)
      navigate(ROUTES.DASHBOARD)
    })
  }

  return (
    <div className="auth-card p-4 p-md-5 shadow-sm">
      <div className="text-center mb-4">
        <i className="bi bi-person-plus text-primary" style={{ fontSize: '2.5rem' }} />
        <h4 className="fw-bold mt-2">Create Account</h4>
        <p className="text-muted small">Join FixBhai for trusted home services</p>
      </div>

      {error && <div className="alert alert-danger rounded-3 py-2 small">{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <Input label="Full Name"      icon="person"    name="name"     placeholder="Your full name"
          value={values.name}     onChange={handleChange} error={errors.name} />
        <Input label="Email Address"  icon="envelope"  name="email"    type="email" placeholder="you@example.com"
          value={values.email}    onChange={handleChange} error={errors.email} />
        <Input label="Phone Number"   icon="telephone" name="phone"    type="tel" placeholder="+91 98765 43210"
          value={values.phone}    onChange={handleChange} error={errors.phone} />
        <Input label="Password"       icon="lock"      name="password" type="password" placeholder="Min. 6 characters"
          value={values.password} onChange={handleChange} error={errors.password} />

        <Button type="submit" loading={loading} className="w-100 py-2 rounded-3 mt-2">
          Create Account
        </Button>
      </form>

      <p className="text-center text-muted small mt-4 mb-0">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary fw-semibold">Sign in</Link>
      </p>
    </div>
  )
}

export default RegisterForm
