import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import api from '../api/api';

function RegisterDonor() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      await api.post('/user/donor', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile,
        role: 'DONOR',
        status: 'ACTIVE'
      });
      
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid px-0">
      <div className="row min-vh-100 m-0">
        {/* Left side - Image/Info */}
        <div className="col-lg-6 d-none d-lg-block p-0">
          <div className="h-100 w-100 d-flex align-items-center justify-content-center"
               style={{ 
                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
               }}>
            <div className="text-white text-center px-5">
              <div className="d-flex align-items-center justify-content-center mb-4">
                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <span className="text-primary fw-bold fs-4">CC</span>
                </div>
                <h1 className="display-5 fw-bold mb-0">CareConnect</h1>
              </div>
              <h2 className="fw-bold mb-3">Become a Donor</h2>
              <p className="lead mb-4 opacity-90">
                Join thousands of compassionate donors making a real difference
              </p>
              <div className="text-start">
                <p className="mb-2">
                  <i className="fas fa-check-circle me-2"></i>
                  Support verified care homes
                </p>
                <p className="mb-2">
                  <i className="fas fa-check-circle me-2"></i>
                  Choose donation type (Money/Food/Service)
                </p>
                <p className="mb-0">
                  <i className="fas fa-check-circle me-2"></i>
                  Track your impact in real-time
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Registration Form */}
        <div className="col-12 col-lg-6 p-0">
          <div className="h-100 d-flex align-items-center justify-content-center p-3 p-sm-4 p-md-4 p-lg-5">
            <div className="w-100" style={{ maxWidth: '100%', width: '500px' }}>
              {/* Header */}
              <div className="text-center mb-4">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                       style={{ width: '50px', height: '50px' }}>
                    <span className="text-white fw-bold">CC</span>
                  </div>
                  <h2 className="fw-bold text-dark mb-0">Donor Registration</h2>
                </div>
                <p className="text-muted mb-0">Create your donor account in minutes</p>
              </div>
              
              {/* Registration Card */}
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-3 p-sm-4 p-md-4">
                  {message && (
                    <Alert variant={message.includes('successful') ? 'success' : 'danger'} 
                           className="text-center mb-3 py-2">
                      {message}
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-medium">
                            <i className="fas fa-user me-2"></i>
                            Full Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                            className="py-2"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-medium">
                            <i className="fas fa-envelope me-2"></i>
                            Email Address
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter email"
                            className="py-2"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-medium">
                            <i className="fas fa-phone me-2"></i>
                            Mobile Number
                          </Form.Label>
                          <Form.Control
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                            placeholder="Enter mobile number"
                            className="py-2"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-medium">
                            <i className="fas fa-lock me-2"></i>
                            Password
                          </Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="At least 6 characters"
                            className="py-2"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-medium">
                            <i className="fas fa-lock me-2"></i>
                            Confirm Password
                          </Form.Label>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirm your password"
                            className="py-2"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <div className="d-grid mt-4 mb-3">
                      <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={loading}
                        className="py-2 py-sm-3 fw-bold"
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Creating Account...
                          </>
                        ) : 'Create Donor Account'}
                      </Button>
                    </div>
                  </Form>
                  
                  <div className="text-center mt-4 pt-3 border-top">
                    <p className="text-muted mb-2">Already have an account?</p>
                    <div className="d-grid">
                      <Link to="/login" className="text-decoration-none">
                        <Button variant="outline-secondary" className="w-100 py-2">
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Sign In to Your Account
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card.Body>
              </Card>
              
              {/* Back to Home */}
              <div className="text-center mt-3">
                <Link to="/" className="text-decoration-none text-dark">
                  ← Back to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterDonor;