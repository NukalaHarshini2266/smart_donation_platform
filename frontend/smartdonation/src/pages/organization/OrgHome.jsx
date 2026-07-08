import React, { useEffect, useState } from "react";
import { Card, Row, Col, Table, Badge, Button } from "react-bootstrap";
import api from "../../api/api";
import axios from "axios";

export default function OrgHome({ org }) {

  const [stats, setStats] = useState({
    total: 0,
    money: 0,
    food: 0,
    service: 0
  });

  useEffect(() => {
    api
      .get(`/organization/${org.id}/statistics`)
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, [org.id]);

  const head = org.head;

  return (
    <>
      <h3 className="mb-4" style={{ fontWeight: '600', color: '#1e293b' }}>Organization Dashboard</h3>

      {/* Statistics Cards - Responsive & Improved */}
      <Row className="mb-4 g-3">
        <Col xs={12} sm={6} md={3}>
          <Card className="text-center p-3 shadow-sm border-0" style={{ borderRadius: '15px', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <h6 className="text-muted">Total Donations</h6>
            <h4 className="mb-0" style={{ fontWeight: '700', color: '#4e73df' }}>{stats.total}</h4>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={3}>
          <Card className="text-center p-3 shadow-sm border-0" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #1cc88a 0%, #13855c 100%)', color: 'white', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <h6>Money</h6>
            <h4 className="mb-0" style={{ fontWeight: '700' }}>{stats.money}</h4>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={3}>
          <Card className="text-center p-3 shadow-sm border-0" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #f6c23e 0%, #dda20a 100%)', color: 'white', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <h6>Food</h6>
            <h4 className="mb-0" style={{ fontWeight: '700' }}>{stats.food}</h4>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={3}>
          <Card className="text-center p-3 shadow-sm border-0" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #36b9cc 0%, #258391 100%)', color: 'white', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <h6>Service</h6>
            <h4 className="mb-0" style={{ fontWeight: '700' }}>{stats.service}</h4>
          </Card>
        </Col>
      </Row>

      {/* Organization Details */}
      <Card className="p-4 mb-4 shadow-sm border-0" style={{ borderRadius: '15px' }}>
        <h5 className="mb-3" style={{ fontWeight: '600', color: '#1e293b' }}>Organization Details</h5>
        <Row>
          <Col md={6}><p><b>Name:</b> {org.name}</p></Col>
          <Col md={6}><p><b>Type:</b> {org.type}</p></Col>
          <Col md={12}><p><b>Address:</b> {org.address}</p></Col>
          <Col md={12}><p><b>Status:</b> <Badge bg="success" style={{ padding: '5px 12px' }}>{org.status}</Badge></p></Col>
        </Row>
      </Card>

      {/* Head */}
      <Card className="p-4 mb-4 shadow-sm border-0" style={{ borderRadius: '15px' }}>
        <h5 className="mb-3" style={{ fontWeight: '600', color: '#1e293b' }}>Organization Head</h5>
        {head ? (
          <Row>
            <Col md={4}><p><b>Name:</b> {head.name}</p></Col>
            <Col md={4}><p><b>Email:</b> {head.email}</p></Col>
            <Col md={4}><p><b>Mobile:</b> {head.mobile}</p></Col>
          </Row>
        ) : (
          <p className="text-muted">No head assigned.</p>
        )}
      </Card>

      {/* Documents */}
      <Card className="mt-4 p-4 shadow-sm border-0" style={{ borderRadius: '15px' }}>
        <h5 className="mb-3" style={{ fontWeight: '600', color: '#1e293b' }}>Organization Documents</h5>
        <div style={{ overflowX: 'auto' }}>
          <Table bordered hover responsive className="align-middle">
            <thead style={{ backgroundColor: '#f8f9fc' }}>
              <tr>
                <th>File Name</th>
                <th>Description</th>
                <th style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {org.documents?.map(doc => (
                <tr key={doc.id}>
                  <td>{doc.fileName}</td>
                  <td>{doc.description}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => window.open(`http://localhost:8080${doc.filePath}`, "_blank")}
                        style={{ borderRadius: '8px' }}
                      >
                        View
                      </Button>
                      <a href={`http://localhost:8080/api/organization/download/${doc.fileName}`}>
                        <Button size="sm" variant="success" style={{ borderRadius: '8px' }}>
                          Download
                        </Button>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    </>
  );
}