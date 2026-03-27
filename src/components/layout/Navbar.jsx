import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          <i className="bi bi-tools text-primary me-1" />
          Fix<span>Bhai</span>
        </Link>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav mx-auto gap-1">
            <li className="nav-item">
              <NavLink className="nav-link px-3" to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link px-3" to="/services">Services</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link px-3" to="/technicians">Technicians</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link px-3" to="/booking">Book Now</NavLink>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <div className="dropdown">
                <button className="btn btn-outline-primary rounded-pill dropdown-toggle" data-bs-toggle="dropdown">
                  <i className="bi bi-person-circle me-1" />{user.name}
                </button>
                <ul className="dropdown-menu dropdown-menu-end rounded-3 shadow border-0">
                  <li><Link className="dropdown-item" to="/dashboard"><i className="bi bi-grid me-2" />Dashboard</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2" />Logout</button></li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary rounded-pill px-4">Login</Link>
                <Link to="/register" className="btn btn-primary rounded-pill px-4">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
