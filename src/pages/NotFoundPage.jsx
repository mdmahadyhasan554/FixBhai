import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { ROUTES } from '../constants'

/**
 * NotFoundPage — 404 catch-all.
 * Shown for any unmatched route.
 */
const NotFoundPage = () => {
  const navigate = useNavigate()
  return (
    <div className="container py-5 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="mb-4" style={{ fontSize: '6rem', lineHeight: 1 }} aria-hidden="true">🔧</div>
      <h1 className="fw-bold mb-2" style={{ fontSize: '5rem', color: '#e2e8f0' }}>404</h1>
      <h4 className="fw-bold mb-2">Page not found</h4>
      <p className="text-muted mb-4">
        Looks like this page went for a repair and never came back.
      </p>
      <div className="d-flex gap-3 justify-content-center">
        <Button variant="outline-secondary" rounded onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button rounded icon="house" onClick={() => navigate(ROUTES.HOME)}>
          Back to Home
        </Button>
      </div>
    </div>
  )
}

export default NotFoundPage
