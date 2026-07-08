import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* Header - Full width */}
      <header className="bg-white border-bottom" style={{ width: '100vw' }}>
        <div className="container-fluid px-4 px-lg-5">
          <nav className="navbar navbar-expand-lg navbar-light py-2 py-lg-3">
            <Link to="/" className="navbar-brand d-flex align-items-center">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/3208/3208720.png" 
                alt="Logo" 
                width="40" 
                height="40" 
                className="me-2"
              />
              <span className="fs-4 fs-lg-3 fw-bold text-dark">CareConnect</span>
            </Link>
            
            <button 
              className="navbar-toggler border-0" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className="collapse navbar-collapse justify-content-lg-end" id="navbarNav">
              <ul className="navbar-nav align-items-center mt-3 mt-lg-0">
                <li className="nav-item mx-2 mx-lg-3">
                  <Link to="/" className="nav-link text-dark fw-medium">Home</Link>
                </li>
                <li className="nav-item mx-2 mx-lg-3">
                  <Link to="/about" className="nav-link text-dark fw-medium">About</Link>
                </li>
                <li className="nav-item mx-2 mx-lg-3">
                  <Link to="/contact" className="nav-link text-dark fw-medium">Contact</Link>
                </li>
                <li className="nav-item mx-2 mx-lg-3">
                  <Link to="/login" className="nav-link text-dark fw-medium">Login</Link>
                </li>
                <li className="nav-item dropdown mx-2 mx-lg-3 mt-2 mt-lg-0">
                  <button 
                    className="btn btn-primary px-3 px-lg-4 py-2 rounded-pill dropdown-toggle w-100 w-lg-auto"
                    data-bs-toggle="dropdown"
                  >
                    Get Started
                  </button>
                  <ul className="dropdown-menu dropdown-menu-lg-end">
                    <li>
                      <Link to="/register/donor" className="dropdown-item">
                        <i className="fas fa-user me-2"></i>Register as Donor
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <Link to="/register/organization" className="dropdown-item">
                        <i className="fas fa-home me-2"></i>Register Care Home
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section - Full width */}
      <section className="py-4 py-lg-5" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: 'calc(100vh - 76px)',
        display: 'flex',
        alignItems: 'center',
        width: '100vw'
      }}>
        <div className="container-fluid px-4 px-lg-5">
          <div className="row align-items-center py-3 py-lg-5 gx-5">
            <div className="col-lg-6 text-white mb-4 mb-lg-0">
              <h1 className="display-5 display-lg-4 fw-bold mb-3 mb-lg-4">
                Bridge the Gap of Compassion
              </h1>
              <p className="lead mb-3 mb-lg-4" style={{ opacity: 0.9, fontSize: '1.1rem' }}>
                Directly connect with verified Old Age Homes & Orphanages. 
                Every donation—whether money, food, or service—creates real impact.
              </p>
              <div className="d-flex flex-column flex-sm-row flex-wrap gap-3">
                <Link to="/register/donor" className="btn btn-light btn-lg px-3 px-lg-4 py-2 py-lg-3 rounded-pill shadow text-nowrap">
                  <i className="fas fa-heart me-2 text-primary"></i>
                  Start Donating
                </Link>
                <Link to="/register/organization" className="btn btn-outline-light btn-lg px-3 px-lg-4 py-2 py-lg-3 rounded-pill text-nowrap">
                  <i className="fas fa-hands-helping me-2"></i>
                  List Your Home
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="position-relative">
                <div className="bg-white p-2 p-lg-4 rounded-4 shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                    alt="Helping Hands" 
                    className="img-fluid rounded-3 w-100"
                    style={{ height: '300px', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Full width */}
      <section className="py-4 py-lg-5 bg-light" style={{ width: '100vw' }}>
        <div className="container-fluid px-4 px-lg-5">
          <div className="text-center mb-4 mb-lg-5">
            <h2 className="fw-bold mb-2 mb-lg-3">Why Choose CareConnect?</h2>
            <p className="text-muted">Transparent, Verified, and Impactful Giving</p>
          </div>
          
          <div className="row g-3 g-lg-4">
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="card border-0 bg-white shadow-sm h-100 p-3 p-lg-4">
                <div className="text-center mb-3 mb-lg-4">
                  <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-shield-alt fa-lg text-white"></i>
                  </div>
                </div>
                <h5 className="text-center mb-2 mb-lg-3">100% Verified Homes</h5>
                <p className="text-muted text-center small">
                  Every organization undergoes strict verification including document checks and physical inspection.
                </p>
              </div>
            </div>
            
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="card border-0 bg-white shadow-sm h-100 p-3 p-lg-4">
                <div className="text-center mb-3 mb-lg-4">
                  <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-hand-holding-usd fa-lg text-white"></i>
                  </div>
                </div>
                <h5 className="text-center mb-2 mb-lg-3">Multiple Donation Options</h5>
                <p className="text-muted text-center small">
                  Choose from monetary donations, food supplies, or volunteer services based on your preference.
                </p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card border-0 bg-white shadow-sm h-100 p-3 p-lg-4">
                <div className="text-center mb-3 mb-lg-4">
                  <div className="bg-info rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-chart-line fa-lg text-white"></i>
                  </div>
                </div>
                <h5 className="text-center mb-2 mb-lg-3">Track Your Impact</h5>
                <p className="text-muted text-center small">
                  Receive regular updates on how your contribution is making a difference in real lives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Full width */}
      <section className="py-4 py-lg-5" style={{ width: '100vw' }}>
        <div className="container-fluid px-4 px-lg-5">
          <div className="text-center mb-4 mb-lg-5">
            <h2 className="fw-bold mb-2 mb-lg-3">Simple & Transparent Process</h2>
            <p className="text-muted">Three easy steps to make a difference</p>
          </div>
          
          <div className="row g-3 g-lg-4">
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="text-center">
                <div className="position-relative mb-3 mb-lg-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold" 
                       style={{ width: '40px', height: '40px' }}>
                    1
                  </div>
                </div>
                <h5 className="mb-2 mb-lg-3">Sign Up & Browse</h5>
                <p className="text-muted small">
                  Create your account and browse verified care homes near you.
                </p>
              </div>
            </div>
            
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="text-center">
                <div className="position-relative mb-3 mb-lg-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold" 
                       style={{ width: '40px', height: '40px' }}>
                    2
                  </div>
                </div>
                <h5 className="mb-2 mb-lg-3">Choose & Donate</h5>
                <p className="text-muted small">
                  Select donation type (Money/Food/Service) and complete your contribution.
                </p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="text-center">
                <div className="position-relative mb-3 mb-lg-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold" 
                       style={{ width: '40px', height: '40px' }}>
                    3
                  </div>
                </div>
                <h5 className="mb-2 mb-lg-3">Track Impact</h5>
                <p className="text-muted small">
                  Monitor the status and see photos of how your help made a difference.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Full width */}
      <section className="py-4 py-lg-5" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        width: '100vw'
      }}>
        <div className="container-fluid px-4 px-lg-5 text-center text-white">
          <h2 className="fw-bold mb-2 mb-lg-3">Ready to Create Change?</h2>
          <p className="lead mb-3 mb-lg-4" style={{ opacity: 0.9, fontSize: '1.1rem' }}>
            Join thousands who are making a real difference in the lives of elderly and children
          </p>
          <Link to="/register/donor" className="btn btn-light btn-lg px-4 px-lg-5 py-2 py-lg-3 rounded-pill shadow fw-bold">
            Start Your Journey Today
          </Link>
        </div>
      </section>

      {/* Footer - Full width */}
      <footer className="bg-dark text-white py-4 py-lg-5" style={{ width: '100vw' }}>
        <div className="container-fluid px-4 px-lg-5">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="d-flex align-items-center mb-3">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3208/3208720.png" 
                  alt="Logo" 
                  width="40" 
                  height="40" 
                  className="me-2"
                />
                <span className="fs-4 fw-bold text-white">CareConnect</span>
              </div>
              <p className="text-light mb-0 small" style={{ opacity: 0.8 }}>
                Bridging compassion with need through verified connections between donors and care homes.
              </p>
            </div>
            
            <div className="col-lg-2 col-md-4 mb-4">
              <h5 className="mb-3">Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/" className="text-light text-decoration-none small" style={{ opacity: 0.8 }}>
                    Home
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/about" className="text-light text-decoration-none small" style={{ opacity: 0.8 }}>
                    About Us
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/contact" className="text-light text-decoration-none small" style={{ opacity: 0.8 }}>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="col-lg-3 col-md-4 mb-4">
              <h5 className="mb-3">Join</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/register/donor" className="text-light text-decoration-none small" style={{ opacity: 0.8 }}>
                    Become a Donor
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/register/organization" className="text-light text-decoration-none small" style={{ opacity: 0.8 }}>
                    Register Care Home
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="col-lg-3 col-md-4 mb-4">
              <h5 className="mb-3">Contact Info</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="fas fa-envelope me-2 small"></i>
                  <span className="small" style={{ opacity: 0.8 }}>support@careconnect.org</span>
                </li>
                <li className="mb-2">
                  <i className="fas fa-phone me-2 small"></i>
                  <span className="small" style={{ opacity: 0.8 }}>+91 1800-123-4567</span>
                </li>
              </ul>
            </div>
          </div>
          
          <hr className="my-3 my-lg-4" style={{ opacity: 0.2 }} />
          
          <div className="row">
            <div className="col-md-6 mb-2 mb-md-0">
              <p className="mb-0 small" style={{ opacity: 0.8 }}>
                © 2024 CareConnect. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <Link to="/privacy" className="text-light text-decoration-none me-3 small" style={{ opacity: 0.8 }}>
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-light text-decoration-none small" style={{ opacity: 0.8 }}>
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Global CSS Fix */}
      <style>{`
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          width: 100%;
          overflow-x: hidden;
        }
        
        .container-fluid {
          padding-right: 0 !important;
          padding-left: 0 !important;
        }
        
        .px-4 {
          padding-right: 1.5rem !important;
          padding-left: 1.5rem !important;
        }
        
        .px-lg-5 {
          padding-right: 3rem !important;
          padding-left: 3rem !important;
        }
        
        /* Force full width */
        header, section, footer {
          min-width: 100vw !important;
          max-width: 100vw !important;
        }
        
        /* Remove any max-width constraints */
        .container, .container-fluid {
          max-width: 100% !important;
        }
        
        /* Fix horizontal scroll */
        .row {
          margin-right: 0 !important;
          margin-left: 0 !important;
        }
        
        .col, .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, 
        .col-7, .col-8, .col-9, .col-10, .col-11, .col-12,
        .col-sm, .col-md, .col-lg, .col-xl {
          padding-right: 0 !important;
          padding-left: 0 !important;
        }
      `}</style>
    </div>
  );
};
export default Home;