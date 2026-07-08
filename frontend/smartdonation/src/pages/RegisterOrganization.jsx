import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Button, Alert, Row, Col, ProgressBar } from 'react-bootstrap';
import api from '../api/api';

function RegisterOrganization() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [orgData, setOrgData] = useState({
    // Step 1: Organization Details (EXACTLY what backend accepts)
    name: '',
    type: 'OLD AGE HOME',
    address: '',
    // capacity: '', // REMOVED - not in backend
    // establishedYear: '', // REMOVED - not in backend
    
    // Step 2: Primary User Details (EXACTLY what backend accepts)
    userName: '',
    userEmail: '',
    userPassword: '',
    confirmPassword: '',
    userMobile: '',
    
    // Step 3: Documents
    files: [],
    descriptions: ['']
  });

  const navigate = useNavigate();

  const organizationTypes = [
    'OLD AGE HOME',
    'ORPHANAGE'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrgData({
      ...orgData,
      [name]: value
    });
  };

  const handleFileChange = (e, index) => {
    const newFiles = [...orgData.files];
    const newDescriptions = [...orgData.descriptions];
    
    newFiles[index] = e.target.files[0];
    setOrgData({
      ...orgData,
      files: newFiles,
      descriptions: newDescriptions
    });
  };

  const handleDescriptionChange = (e, index) => {
    const newDescriptions = [...orgData.descriptions];
    newDescriptions[index] = e.target.value;
    setOrgData({
      ...orgData,
      descriptions: newDescriptions
    });
  };

  const addDocumentField = () => {
    setOrgData({
      ...orgData,
      files: [...orgData.files, null],
      descriptions: [...orgData.descriptions, '']
    });
  };

  const removeDocumentField = (index) => {
    const newFiles = [...orgData.files];
    const newDescriptions = [...orgData.descriptions];
    
    newFiles.splice(index, 1);
    newDescriptions.splice(index, 1);
    
    setOrgData({
      ...orgData,
      files: newFiles,
      descriptions: newDescriptions
    });
  };

  const validateStep1 = () => {
    if (!orgData.name.trim()) {
      setMessage('Organization name is required');
      return false;
    }
    if (!orgData.address.trim()) {
      setMessage('Organization address is required');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!orgData.userName.trim()) {
      setMessage('Contact person name is required');
      return false;
    }
    if (!orgData.userEmail.trim()) {
      setMessage('Email is required');
      return false;
    }
    if (!orgData.userPassword.trim()) {
      setMessage('Password is required');
      return false;
    }
    if (orgData.userPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      return false;
    }
    if (orgData.userPassword !== orgData.confirmPassword) {
      setMessage('Passwords do not match');
      return false;
    }
    if (!orgData.userMobile.trim()) {
      setMessage('Mobile number is required');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (orgData.files.length === 0) {
      setMessage('At least one document is required');
      return false;
    }
    
    for (let i = 0; i < orgData.files.length; i++) {
      if (!orgData.files[i]) {
        setMessage(`Please select file for document ${i + 1}`);
        return false;
      }
      if (!orgData.descriptions[i]?.trim()) {
        setMessage(`Please add description for document ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    setMessage('');
    
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep3()) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      const formData = new FormData();
      
      // ONLY fields that backend accepts (from your API)
      formData.append('name', orgData.name);
      formData.append('type', orgData.type);
      formData.append('address', orgData.address);
      
      // User details (from your API)
      formData.append('userName', orgData.userName);
      formData.append('userEmail', orgData.userEmail);
      formData.append('userPassword', orgData.userPassword);
      formData.append('userMobile', orgData.userMobile);
      
      // Files
      orgData.files.forEach((file, index) => {
        formData.append('files', file);
        formData.append('descriptions', orgData.descriptions[index]);
      });
      
      await api.post('/organization/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setMessage('Organization registered successfully! It is now pending for approval. You will receive an email once approved.');
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      setMessage('Registration failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = ['Organization Details', 'Contact Person', 'Documents'];

  return (
    <div className="container-fluid px-0">
      <div className="row min-vh-100 m-0">
        {/* Left side - Info */}
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
              <h2 className="fw-bold mb-3">Register Your Care Home</h2>
              <p className="lead mb-4 opacity-90">
                Connect with compassionate donors and get the support for your organization needs
              </p>
              <div className="text-start">
                <p className="mb-3">
                  <i className="fas fa-check-circle me-2"></i>
                  Reach thousands of verified donors
                </p>
                <p className="mb-3">
                  <i className="fas fa-check-circle me-2"></i>
                  Receive multiple donation types (Money, Food, Services)
                </p>
                <p className="mb-0">
                  <i className="fas fa-check-circle me-2"></i>
                  Transparent tracking and reporting
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Form */}
        <div className="col-12 col-lg-6 p-0">
          <div className="h-100 d-flex align-items-center justify-content-center p-3 p-sm-4 p-md-4 p-lg-5">
            <div className="w-100" style={{ maxWidth: '100%', width: '600px' }}>
              {/* Header */}
              <div className="text-center mb-4">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                       style={{ width: '50px', height: '50px' }}>
                    <span className="text-white fw-bold">CC</span>
                  </div>
                  <h2 className="fw-bold text-dark mb-0">Organization Registration</h2>
                </div>
                <p className="text-muted mb-0">Complete your registration in 3 simple steps</p>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  {[1, 2, 3].map((stepNum) => (
                    <div key={stepNum} className="text-center flex-fill">
                      <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${step >= stepNum ? 'bg-primary text-white' : 'bg-light text-muted'}`}
                           style={{ width: '40px', height: '40px' }}>
                        {stepNum}
                      </div>
                      <div className={`small ${step >= stepNum ? 'fw-bold text-primary' : 'text-muted'}`}>
                        {stepTitles[stepNum - 1]}
                      </div>
                    </div>
                  ))}
                </div>
                <ProgressBar now={(step/3) * 100} className="mt-2" style={{ height: '6px' }} />
              </div>
              
              {/* Registration Card */}
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-3 p-sm-4 p-md-4">
                  {message && (
                    <Alert variant={message.includes('successfully') ? 'success' : 'danger'} 
                           className="text-center mb-3 py-2">
                      {message}
                    </Alert>
                  )}
                  
                  <Form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
                    {/* Step 1: Organization Details */}
                    {step === 1 && (
                      <>
                        <h5 className="fw-bold mb-4">
                          <i className="fas fa-home me-2 text-primary"></i>
                          Organization Information
                        </h5>
                        
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-medium">
                            <i className="fas fa-building me-2"></i>
                            Organization Name *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={orgData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter care home name"
                            className="py-2"
                          />
                        </Form.Group>
                        
                        <Row>
                          <Col md={12}>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-medium">
                                <i className="fas fa-tag me-2"></i>
                                Organization Type *
                              </Form.Label>
                              <Form.Select
                                name="type"
                                value={orgData.type}
                                onChange={handleChange}
                                className="py-2"
                              >
                                {organizationTypes.map(type => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          {/* REMOVED Capacity field - not in backend API */}
                        </Row>
                        
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-medium">
                            <i className="fas fa-map-marker-alt me-2"></i>
                            Full Address *
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            name="address"
                            value={orgData.address}
                            onChange={handleChange}
                            required
                            placeholder="Enter complete address with city, state, and PIN code"
                            rows={3}
                            className="py-2"
                          />
                        </Form.Group>
                      </>
                    )}
                    
                    {/* Step 2: Contact Person */}
                    {step === 2 && (
                      <>
                        <h5 className="fw-bold mb-4">
                          <i className="fas fa-user me-2 text-primary"></i>
                          Contact Person Details
                        </h5>
                        
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-medium">
                            <i className="fas fa-user-circle me-2"></i>
                            Full Name *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="userName"
                            value={orgData.userName}
                            onChange={handleChange}
                            required
                            placeholder="Enter contact person's full name"
                            className="py-2"
                          />
                        </Form.Group>
                        
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-medium">
                                <i className="fas fa-envelope me-2"></i>
                                Email Address *
                              </Form.Label>
                              <Form.Control
                                type="email"
                                name="userEmail"
                                value={orgData.userEmail}
                                onChange={handleChange}
                                required
                                placeholder="Enter email address"
                                className="py-2"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-medium">
                                <i className="fas fa-phone me-2"></i>
                                Mobile Number *
                              </Form.Label>
                              <Form.Control
                                type="tel"
                                name="userMobile"
                                value={orgData.userMobile}
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
                                Password *
                              </Form.Label>
                              <Form.Control
                                type="password"
                                name="userPassword"
                                value={orgData.userPassword}
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
                                Confirm Password *
                              </Form.Label>
                              <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={orgData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Confirm your password"
                                className="py-2"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </>
                    )}
                    
                    {/* Step 3: Documents */}
                    {step === 3 && (
                      <>
                        <h5 className="fw-bold mb-4">
                          <i className="fas fa-file-upload me-2 text-primary"></i>
                          Upload Documents
                        </h5>
                        
                        <Alert variant="info" className="mb-4">
                          <h6 className="fw-bold mb-2">
                            <i className="fas fa-info-circle me-2"></i>
                            Required Documents
                          </h6>
                          <ul className="mb-0 small">
                            <li>Registration Certificate (Trust/Society/NGO)</li>
                            <li>PAN Card of Organization</li>
                            <li>12A/80G Certificate (if applicable)</li>
                            <li>Bank Account Details</li>
                            <li>Address Proof</li>
                          </ul>
                        </Alert>
                        
                        {orgData.files.map((file, index) => (
                          <Card key={index} className="mb-3 border-primary">
                            <Card.Body className="p-3">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="mb-0">
                                  <i className="fas fa-file me-2"></i>
                                  Document {index + 1}
                                </h6>
                                {index > 0 && (
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => removeDocumentField(index)}
                                  >
                                    <i className="fas fa-times me-1"></i>
                                    Remove
                                  </Button>
                                )}
                              </div>
                              
                              <Row>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label className="fw-medium small">Document File *</Form.Label>
                                    <Form.Control
                                      type="file"
                                      onChange={(e) => handleFileChange(e, index)}
                                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                      className="py-2"
                                    />
                                    {file && (
                                      <div className="text-success small mt-1">
                                        <i className="fas fa-check-circle me-1"></i>
                                        {file.name}
                                      </div>
                                    )}
                                  </Form.Group>
                                </Col>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label className="fw-medium small">Description *</Form.Label>
                                    <Form.Control
                                      type="text"
                                      value={orgData.descriptions[index] || ''}
                                      onChange={(e) => handleDescriptionChange(e, index)}
                                      placeholder="e.g., Registration Certificate"
                                      className="py-2"
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        ))}
                        
                        <div className="text-center mb-4">
                          <Button
                            variant="outline-primary"
                            onClick={addDocumentField}
                            className="rounded-pill"
                          >
                            <i className="fas fa-plus me-2"></i>
                            Add Another Document
                          </Button>
                        </div>
                      </>
                    )}
                    
                    {/* Navigation Buttons */}
                    <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                      <div>
                        {step > 1 && (
                          <Button
                            variant="outline-secondary"
                            onClick={handleBack}
                            disabled={loading}
                            className="px-4"
                          >
                            <i className="fas fa-arrow-left me-2"></i>
                            Back
                          </Button>
                        )}
                      </div>
                      
                      <div>
                        {step < 3 ? (
                          <Button
                            variant="primary"
                            onClick={handleNext}
                            className="px-4"
                          >
                            Next Step
                            <i className="fas fa-arrow-right ms-2"></i>
                          </Button>
                        ) : (
                          <Button
                            variant="success"
                            type="submit"
                            disabled={loading}
                            className="px-4"
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Submitting...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-check-circle me-2"></i>
                                Submit Registration
                              </>
                            )}
                          </Button>
                        )}
                      </div>
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

export default RegisterOrganization;