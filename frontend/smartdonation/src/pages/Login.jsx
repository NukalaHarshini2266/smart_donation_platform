import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import api from '../api/api';

function Login({ setUser }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      

      const response = await api.post('/user/login', formData);

      const token = response.data.token;

      // ✅ STEP 1: SAVE TOKEN FIRST
      localStorage.setItem('token', token);

      // ✅ STEP 2: NOW CALL API (token will be attached)
      const userRes = await api.get(`/user/${response.data.userId}`);

      // ✅ STEP 3: USE userRes (NOT response)
      const user = {
        id: userRes.data.id,
        name: userRes.data.name,
        role: userRes.data.role,
        theme:userRes.data.theme,
      };

      localStorage.setItem("role", user.role);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('theme', user.theme || "light");
      document.body.className = user.theme || "light";

      setUser(user);

      // ✅ Navigation based on role
      switch(user.role) {
        case 'ADMIN':
          navigate('/admin');
          break;
        case 'DONOR':
          navigate('/donor');
          break;
        case 'ORGANIZATION':
          navigate('/organization');
          break;
        case 'ORG_STAFF':
          navigate('/organization');
          break;
        default:
          navigate('/login');
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid px-0">
      <div className="row min-vh-100">
        {/* Left side - Image/Illustration */}
        <div className="col-lg-6 d-none d-lg-block p-0">
          <div 
            className="h-100 w-100"
            style={{
              background: 'linear-gradient(rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8)), url(https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div className="text-white text-center px-5">
              {/* Logo LEFT of name on image side */}
              <div className="d-flex align-items-center justify-content-center mb-4">
                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <span className="text-primary fw-bold fs-4">CC</span>
                </div>
                <h1 className="display-4 fw-bold mb-0">CareConnect</h1>
              </div>
              <p className="lead mb-0">
                Continue your journey of making a difference in the lives of elderly and children
              </p>
            </div>
          </div>
        </div>
        
        {/* Right side - Login Form */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center p-2 p-lg-3">
          <div className="w-100" style={{ maxWidth: '450px' }}>
            {/* Logo LEFT of name */}
            <div className="text-center mb-4">
              {/* Flex container with logo left, name right */}
              <div className="d-flex align-items-center justify-content-center mb-3">
                {/* Logo - LEFT side */}
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <span className="text-white fw-bold fs-4">CC</span>
                </div>
                {/* Name - RIGHT side of logo */}
                <h2 className="fw-bold text-dark mb-0">CareConnect</h2>
              </div>
              <p className="text-muted mb-0">Sign in to your account</p>
            </div>
            
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-2 p-lg-3">
                {error && (
                  <Alert variant="danger" className="text-center">
                    {error}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mt-0 mb-3">
                    <Form.Label className="fw-medium">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email address"
                      className="py-3"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium">Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter your password"
                      className="py-3"
                    />
                  </Form.Group>
                  
                  <div className="d-grid mb-4">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={loading}
                      size="lg"
                      className="py-3 fw-bold"
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Logging in...
                        </>
                      ) : 'Sign In'}
                    </Button>
                  </div>
                  
                  <div className="text-center mb-4">
                    <Link to="/forgot-password" className="text-decoration-none text-primary fw-medium">
                      Forgot your password?
                    </Link>
                  </div>
                  
                </Form>
                
                <div className="text-center pt-4 border-top">
                  <p className="text-muted mb-2">Don't have an account?</p>
                  <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                    <Link to="/register/donor" className="text-decoration-none">
                      <Button variant="outline-primary" className="rounded-pill w-100">
                        Register as Donor
                      </Button>
                    </Link>
                    <Link to="/register/organization" className="text-decoration-none">
                      <Button variant="outline-success" className="rounded-pill w-100">
                        Register Care Home
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;