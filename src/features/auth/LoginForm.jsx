import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { loginUser } from '../../services/authService'
import useForm from '../../hooks/useForm'
import useAsync from '../../hooks/useAsync'
import { required, isEmail } from '../../utils/validators'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { ROUTES } from '../../constants'

const RULES = {
  email:    v => isEmail(v),
  password: v => required(v),
}

const LoginForm = () => {
  const { values, errors, handleChange, validateAll } = useForm(
    { email: '', password: '' },
    RULES
  )
  const { run, loading, error } = useAsync()
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateAll()) return
    await run(async () => {
      const { user, token } = await loginUser(values)
      login(user, token)
      navigate(ROUTES.DASHBOARD)
    })
  }

  return (
    <div className="auth-card p-4 p-md-5 shadow-sm">
      <div className="text-center mb-4">
        <i className="bi bi-tools text-primary" style={{ fontSize: '2.5rem' }} />
        <h4 className="fw-bold mt-2">Welcome back</h4>
        <p className="text-muted small">Sign in to your FixBhai account</p>
      </div>

      {error && <div className="alert alert-danger rounded-3 py-2 small">{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <Input label="Email Address" icon="envelope" type="email" name="email"
          placeholder="you@example.com" value={values.email}
          onChange={handleChange} error={errors.email} />

        <Input label="Password" icon="lock" type="password" name="password"
          placeholder="Enter password" value={values.password}
          onChange={handleChange} error={errors.password} />

        <div className="d-flex justify-content-end mb-3">
          <a href="#" className="small text-primary">Forgot password?</a>
        </div>

        <Button type="submit" loading={loading} className="w-100 py-2 rounded-3">
          Sign In
        </Button>
      </form>

      <p className="text-center text-muted small mt-4 mb-0">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="text-primary fw-semibold">Sign up</Link>
      </p>
    </div>
  )
}

export default LoginForm
