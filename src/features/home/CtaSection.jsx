import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import { ROUTES } from '../../constants'

/**
 * CtaSection
 * Full-width call-to-action banner at the bottom of the homepage.
 */
const CtaSection = () => {
  const navigate = useNavigate()
  return (
    <section
      className="py-5"
      style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)' }}
      aria-label="Call to action"
    >
      <div className="container text-center text-white py-3">
        <h2 className="fw-bold mb-3">Ready to get started?</h2>
        <p className="mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
          Book your first service today and experience the FixBhai difference.
        </p>
        <Button
          variant="warning"
          size="lg"
          rounded
          iconEnd="arrow-right"
          className="px-5 fw-semibold"
          onClick={() => navigate(ROUTES.BOOKING)}
        >
          Book a Service Now
        </Button>
      </div>
    </section>
  )
}

export default CtaSection
