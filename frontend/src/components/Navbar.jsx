import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm fixed-top">
      <div className="container-fluid px-3 px-md-4">
        <Link className="navbar-brand d-flex align-items-center gap-2 text-decoration-none" to="/listings">
          <i className="fa-solid fa-compass fa-lg" style={{ color: '#e31c5e' }}></i>
          <span className="fw-bold fs-4" style={{ color: '#e31c5e' }}>Airbnb</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          {/* Center navigation links */}
          <ul className="navbar-nav mx-auto mx-lg-0 gap-1 gap-lg-3">
            <li className="nav-item">
              <Link className={`nav-link fw-medium ${location.pathname === '/listings' ? 'active' : ''}`} to="/listings">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-medium" href="#">Experiences</a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-medium" href="#">Services</a>
            </li>
          </ul>

          {/* Right side action buttons + Account dropdown */}
          <div className="d-flex flex-column flex-md-row gap-2 gap-md-3 ms-auto align-items-md-center">
            <Link className="btn btn-outline-danger rounded-pill px-4 py-2 fw-medium" to="/users/signup">
              Become a host
            </Link>
            <Link className="btn btn-danger rounded-pill px-4 py-2 fw-medium" to="/listings/new">
              Create Listing
            </Link>
            
            {/* Account Dropdown */}
            <div className="dropdown ms-md-2">
              <button
                className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-medium dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {!isAuthenticated ? (
                  <>
                    <i className="fa-solid fa-user me-1"></i> Account
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-user me-1"></i> {user?.username}
                  </>
                )}
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3">
                {!isAuthenticated ? (
                  <>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2" to="/users/login">
                        <i className="fa-solid fa-sign-in-alt"></i> Sign in
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2" to="/users/signup">
                        <i className="fa-solid fa-user-plus"></i> Sign up
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2" to="/bookings">
                        <i className="fa-solid fa-calendar-check"></i> My bookings
                      </Link>
                    </li>
                    <li>
                      <button 
                        className="dropdown-item d-flex align-items-center gap-2 text-danger"
                        onClick={handleLogout}
                      >
                        <i className="fa-solid fa-right-from-bracket"></i> Log out
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;