import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import api from '../api/api';

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP, 3: Reset Password
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRequestOTP = async () => {
    if (!formData.email) {
      setMessage('Please enter your email address');
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/user/forgot-password/request', { email: formData.email });
      setMessage('OTP sent to your email!');
      setStep(2);
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || 'Failed to send OTP'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      setMessage('Please enter the OTP');
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/user/forgot-password/verify', {
        email: formData.email,
        otp: formData.otp
      });
      setMessage('OTP verified successfully!');
      setStep(3);
    } catch (error) {
      setMessage('Error: ' + (error.response?.data || 'Invalid OTP'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/user/forgot-password/reset', {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword
      });
      setMessage('Password reset successfully! You can now login with your new password.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || 'Failed to reset password'));
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your registered email"
              />
            </Form.Group>
            <div className="d-grid">
              <Button 
                variant="primary" 
                onClick={handleRequestOTP}
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </div>
          </>
        );
      
      case 2:
        return (
          <>
            <Alert variant="info">
              OTP sent to: <strong>{formData.email}</strong>
            </Alert>
            <Form.Group className="mb-3">
              <Form.Label>Enter OTP (6-digit)</Form.Label>
              <Form.Control
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter OTP"
                maxLength="6"
              />
            </Form.Group>
            <div className="d-grid">
              <Button 
                variant="warning" 
                onClick={handleVerifyOTP}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </div>
            <div className="text-center mt-2">
              <Button 
                variant="link" 
                onClick={() => setStep(1)}
              >
                Change Email
              </Button>
            </div>
          </>
        );
      
      case 3:
        return (
          <>
            <Alert variant="success">
              OTP verified! Now set your new password.
            </Alert>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
              />
            </Form.Group>
            <div className="d-grid">
              <Button 
                variant="success" 
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 w-100 bg-light" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="container px-3">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <Card className="shadow">
              <Card.Body className="p-4">
                <Card.Title className="text-center mb-4">
                  <h3>Forgot Password</h3>
                  <div className="small text-muted">
                    Step {step} of 3
                  </div>
                </Card.Title>
                
                {message && (
                  <Alert variant={
                    message.includes('successfully') ? 'success' : 
                    message.includes('Error') ? 'danger' : 'info'
                  }>
                    {message}
                  </Alert>
                )}
                
                {renderStep()}
                
                <hr />
                
                <div className="text-center">
                  <Button 
                    variant="link" 
                    onClick={() => window.location.href = '/login'}
                    className="text-decoration-none"
                  >
                    ← Back to Login
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;