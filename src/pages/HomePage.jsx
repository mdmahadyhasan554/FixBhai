import { useNavigate } from 'react-router-dom'
import HeroSection    from '../features/home/HeroSection'
import StatsBar       from '../features/home/StatsBar'
import HowItWorks     from '../features/home/HowItWorks'
import CtaSection     from '../features/home/CtaSection'
import ServiceGrid    from '../features/services/ServiceGrid'
import TechnicianList from '../features/technicians/TechnicianList'
import SectionHeader  from '../components/common/SectionHeader'
import Button         from '../components/ui/Button'
import { SERVICES, TECHNICIANS } from '../api/data'
import { ROUTES } from '../constants'

/**
 * HomePage
 * Assembles all homepage sections. Contains zero UI markup.
 */
const HomePage = () => {
  const navigate = useNavigate()

  return (
    <>
      <HeroSection />

      <StatsBar />

      {/* Services preview */}
      <section className="py-5">
        <div className="container">
          <SectionHeader
            title="Our Services"
            subtitle="Professional solutions for every home need"
            action={
              <Button variant="outline-primary" rounded iconEnd="arrow-right"
                onClick={() => navigate(ROUTES.SERVICES)}>
                View All
              </Button>
            }
          />
          <ServiceGrid services={SERVICES} />
        </div>
      </section>

      <HowItWorks />

      {/* Top technicians preview */}
      <section className="py-5">
        <div className="container">
          <SectionHeader
            title="Top Technicians"
            subtitle="Verified experts ready to help"
            action={
              <Button variant="outline-primary" rounded iconEnd="arrow-right"
                onClick={() => navigate(ROUTES.TECHNICIANS)}>
                View All
              </Button>
            }
          />
          <TechnicianList technicians={TECHNICIANS.slice(0, 3)} />
        </div>
      </section>

      <CtaSection />
    </>
  )
}

export default HomePage
