import { Link } from 'react-router-dom'

const Footer = () => (
  <footer className="footer pt-5 pb-3 mt-5">
    <div className="container">
      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <h5 className="fw-bold text-white mb-3">
            <i className="bi bi-tools me-2 text-warning" />FixBhai
          </h5>
          <p className="small" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Trusted home services at your doorstep. Book verified technicians for AC, plumbing, electrical, and more.
          </p>
          <div className="d-flex gap-3 mt-3">
            {['facebook', 'twitter', 'instagram', 'linkedin'].map(s => (
              <a key={s} href="#" className="fs-5"><i className={`bi bi-${s}`} /></a>
            ))}
          </div>
        </div>
        <div className="col-6 col-lg-2">
          <h6 className="text-white fw-semibold mb-3">Services</h6>
          <ul className="list-unstyled small">
            {['AC Repair', 'Plumbing', 'Electrical', 'Cleaning', 'Painting'].map(s => (
              <li key={s} className="mb-2"><Link to="/services">{s}</Link></li>
            ))}
          </ul>
        </div>
        <div className="col-6 col-lg-2">
          <h6 className="text-white fw-semibold mb-3">Company</h6>
          <ul className="list-unstyled small">
            {['About Us', 'Careers', 'Blog', 'Press', 'Contact'].map(s => (
              <li key={s} className="mb-2"><a href="#">{s}</a></li>
            ))}
          </ul>
        </div>
        <div className="col-lg-4">
          <h6 className="text-white fw-semibold mb-3">Contact Us</h6>
          <ul className="list-unstyled small">
            <li className="mb-2"><i className="bi bi-telephone me-2 text-warning" />+91 98765 43210</li>
            <li className="mb-2"><i className="bi bi-envelope me-2 text-warning" />support@fixbhai.in</li>
            <li className="mb-2"><i className="bi bi-geo-alt me-2 text-warning" />Mumbai, Maharashtra, India</li>
          </ul>
        </div>
      </div>
      <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <div className="d-flex flex-wrap justify-content-between align-items-center small" style={{ color: 'rgba(255,255,255,0.5)' }}>
        <span>© 2025 FixBhai. All rights reserved.</span>
        <div className="d-flex gap-3">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
