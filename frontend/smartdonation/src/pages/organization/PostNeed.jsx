import React, { useState } from "react";
import axios from "axios";
import api from "../../api/api"
import { Card, Form, Button, Alert } from "react-bootstrap";
import { FaUpload, FaTags, FaMapMarkerAlt, FaClock, FaAlignLeft, FaBoxes, FaCalendarAlt } from "react-icons/fa";

export default function PostNeed({ organizationId }) {

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "FOOD",
    requiredQuantity: "",
    unit: "",
    location: "",
    urgency: "MEDIUM",
    deadline: ""
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!organizationId) {
      setError("Organization not found.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      data.append("organizationId", organizationId);

      if (selectedFile) {
        data.append("image", selectedFile);
      }

      await api.post("/needs/create", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setSuccess("Need posted successfully!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "FOOD",
        requiredQuantity: "",
        unit: "",
        location: "",
        urgency: "MEDIUM",
        deadline: ""
      });

      setSelectedFile(null);
      setPreview(null);

      // Auto clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to post need.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Get urgency color
  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'HIGH': return '#dc3545';
      case 'MEDIUM': return '#f6c23e';
      case 'LOW': return '#1cc88a';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      padding: '10px',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #f1f5f9 100%)'
    }}>
      <div className="d-flex justify-content-center"

      >
        <Card
          className="border-0 shadow-lg"
          style={{
            width: "100%",
            maxWidth: "1000px",
            borderRadius: "20px",
            overflow: "hidden"
          }}
        >
          {/* Header with gradient */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px 30px',
            color: 'white'
          }}>
            <h3 className="mb-0" style={{ fontWeight: '700' }}>
              📢 Post New Need
            </h3>
            <p className="mb-0 mt-2 opacity-75">Share your organization's requirements with donors</p>
          </div>

          <Card.Body style={{ padding: '30px' }}>
            {success && (
              <Alert variant="success" style={{ borderRadius: '12px' }}>
                ✅ {success}
              </Alert>
            )}
            {error && (
              <Alert variant="danger" style={{ borderRadius: '12px' }}>
                ❌ {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <div className="row">

                {/* LEFT COLUMN */}
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: '600', color: '#2c3e50' }}>
                      <FaTags className="me-2" /> Title
                    </Form.Label>
                    <Form.Control
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter need title"
                      style={{ borderRadius: '10px', padding: '10px' }}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: '600', color: '#2c3e50' }}>
                      Category
                    </Form.Label>
                    <Form.Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      style={{ borderRadius: '10px', padding: '10px' }}
                    >
                      <option value="FOOD">🍔 Food</option>
                      <option value="MONEY">💰 Money</option>
                      <option value="SERVICE">🤝 Service</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: '600', color: '#2c3e50' }}>
                      <FaBoxes className="me-2" /> Required Quantity
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="requiredQuantity"
                      value={formData.requiredQuantity}
                      onChange={handleChange}
                      placeholder="Enter quantity"
                      style={{ borderRadius: '10px', padding: '10px' }}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: '600', color: '#2c3e50' }}>
                      Unit
                    </Form.Label>
                    <Form.Control
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      placeholder="kg / bags / INR / hours"
                      style={{ borderRadius: '10px', padding: '10px' }}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: '600', color: '#2c3e50' }}>
                      <FaUpload className="me-2" /> Upload Image
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ borderRadius: '10px', padding: '8px' }}
                    />
                    <small className="text-muted">Optional: Upload an image for your need</small>
                  </Form.Group>

                  {preview && (
                    <div className="mb-3 text-center">
                      <img
                        src={preview}
                        alt="Preview"
                        style={{
                          width: "100%",
                          maxHeight: "200px",
                          objectFit: "cover",
                          borderRadius: "12px",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN */}
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: '600', color: '#2c3e50' }}>
                      <FaMapMarkerAlt className="me-2" /> Location
                    </Form.Label>
                    <Form.Control
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter location"
                      style={{ borderRadius: '10px', padding: '10px' }}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: '600', color: '#2c3e50' }}>
                      Urgency
                    </Form.Label>
                    <Form.Select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleChange}
                      style={{ 
                        borderRadius: '10px', 
                        padding: '10px',
                        borderLeft: `4px solid ${getUrgencyColor(formData.urgency)}`
                      }}
                    >
                      <option value="LOW">🟢 Low</option>
                      <option value="MEDIUM">🟡 Medium</option>
                      <option value="HIGH">🔴 High</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: '600', color: '#2c3e50' }}>
                      <FaCalendarAlt className="me-2" /> Deadline
                    </Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      style={{ borderRadius: '10px', padding: '10px' }}
                      required
                    />
                  </Form.Group>
                </div>
              </div>

              {/* FULL WIDTH DESCRIPTION */}
              <Form.Group className="mb-4">
                <Form.Label style={{ fontWeight: '600', color: '#2c3e50' }}>
                  <FaAlignLeft className="me-2" /> Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the need in detail..."
                  style={{ borderRadius: '12px', padding: '12px' }}
                  required
                />
              </Form.Group>

              {/* BUTTON SECTION */}
              <div className="text-center mt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 40px',
                    fontSize: '18px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    minWidth: '200px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(102,126,234,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Posting...
                    </>
                  ) : (
                    "📢 Post Need"
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}