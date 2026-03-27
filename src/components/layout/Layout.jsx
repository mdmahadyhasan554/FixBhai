import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

/**
 * MainLayout
 *
 * Wraps every public page with:
 *   - Skip-to-content link (accessibility)
 *   - Sticky Navbar
 *   - <main> with flex-grow so footer always sticks to bottom
 *   - Footer
 *   - Scroll-to-top on route change
 *
 * Usage:
 *   <Layout><HomePage /></Layout>
 */
const Layout = ({ children }) => {
  const { pathname } = useLocation()

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>

      {/* Skip navigation — visible only on keyboard focus */}
      <a
        href="#main-content"
        className="skip-nav"
        aria-label="Skip to main content"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main-content" className="flex-grow-1" tabIndex={-1}>
        {children}
      </main>

      <Footer />
    </div>
  )
}

export default Layout
