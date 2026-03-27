import { useNavigate } from 'react-router-dom'
import HeroSection        from '../features/home/HeroSection'
import CategoryStrip      from '../features/home/CategoryStrip'
import StatsBar           from '../features/home/StatsBar'
import HowItWorks         from '../features/home/HowItWorks'
import TrustBanner        from '../features/home/TrustBanner'
import TestimonialsSection from '../features/home/TestimonialsSection'
import CtaSection         from '../features/home/CtaSection'
import ServiceGrid        from '../features/services/ServiceGrid'
import TechnicianList     from '../features/technicians/TechnicianList'
import SectionHeader      from '../components/common/SectionHeader'
import Button             from '../components/ui/Button'
import { SERVICES, TECHNICIANS } from '../api/data'
import { ROUTES } from '../constants'

/**
 * HomePage — pure assembler, zero UI markup.
 *
 * Section order (marketplace pattern):
 *   1. Hero + search
 *   2. Category strip
 *   3. Trust banner
 *   4. Services grid
 *   5. How it works
 *   6. Top technicians
 *   7. Testimonials
 *   8. CTA
 */
const HomePage = () => {
  const navigate = useNavigate()

  return (
    <>
      <HeroSection />

      <CategoryStrip />

      <TrustBanner />

      {/* Services grid */}
      <section className="py-5 bg-white">
        <div className="container">
          <SectionHeader
            title="Popular Services"
            subtitle="Most booked services this week"
            action={
              <Button variant="outline-primary" rounded iconEnd="arrow-right"
                onClick={() => navigate(ROUTES.SERVICES)}>
                View All Services
              </Button>
            }
          />
          <ServiceGrid services={SERVICES} />
        </div>
      </section>

      <HowItWorks />

      {/* Top technicians */}
      <section className="py-5 bg-white">
        <div className="container">
          <SectionHeader
            title="Top-Rated Technicians"
            subtitle="Verified experts with proven track records"
            action={
              <Button variant="outline-primary" rounded iconEnd="arrow-right"
                onClick={() => navigate(ROUTES.TECHNICIANS)}>
                View All Technicians
              </Button>
            }
          />
          <TechnicianList technicians={TECHNICIANS.slice(0, 3)} />
        </div>
      </section>

      <StatsBar />

      <TestimonialsSection />

      <CtaSection />
    </>
  )
}

export default HomePage
