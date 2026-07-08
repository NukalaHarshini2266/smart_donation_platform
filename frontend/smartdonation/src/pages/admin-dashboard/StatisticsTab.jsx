import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaBuilding, FaCheckCircle, FaClock, FaDonate, FaMoneyBill, FaUtensils, FaHandsHelping } from 'react-icons/fa';

export default function StatisticsTab({ stats, donationStats }) {
  const organizationCards = [
    { title: 'Total Organizations', value: stats.total || 0, icon: <FaBuilding size={32} />, color: '#4e73df', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { title: 'Approved', value: stats.approved || 0, icon: <FaCheckCircle size={32} />, color: '#1cc88a', bg: 'linear-gradient(135deg, #1cc88a 0%, #13855c 100%)' },
    { title: 'Pending', value: stats.pending || 0, icon: <FaClock size={32} />, color: '#f6c23e', bg: 'linear-gradient(135deg, #f6c23e 0%, #dda20a 100%)' }
  ];

  const donationCards = [
    { title: 'Total Donations', value: donationStats.total || 0, icon: <FaDonate size={32} />, color: '#36b9cc', bg: 'linear-gradient(135deg, #36b9cc 0%, #258391 100%)' },
    { title: 'Money', value: donationStats.money || 0, icon: <FaMoneyBill size={32} />, color: '#1cc88a', bg: 'linear-gradient(135deg, #1cc88a 0%, #13855c 100%)' },
    { title: 'Food', value: donationStats.food || 0, icon: <FaUtensils size={32} />, color: '#f6c23e', bg: 'linear-gradient(135deg, #f6c23e 0%, #dda20a 100%)' },
    { title: 'Service', value: donationStats.service || 0, icon: <FaHandsHelping size={32} />, color: '#e74a3b', bg: 'linear-gradient(135deg, #e74a3b 0%, #be2617 100%)' }
  ];

  return (
    <div>
      <h4 className="mb-4" style={{ fontWeight: '600', color: '#1e293b' }}>📊 Dashboard Statistics</h4>
      
      {/* Organization Statistics */}
      <Row className="mb-4 g-4">
        {organizationCards.map((card, idx) => (
          <Col md={4} key={idx}>
            <Card 
              className="border-0 shadow-sm h-100" 
              style={{ 
                borderRadius: '20px', 
                overflow: 'hidden', 
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
              }}
            >
              <Card.Body style={{ padding: '25px' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-2" style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', letterSpacing: '0.5px' }}>
                      {card.title}
                    </h6>
                    <h2 className="mb-0" style={{ fontWeight: '800', color: '#1e293b', fontSize: '2.2rem' }}>
                      {card.value}
                    </h2>
                  </div>
                  <div style={{ 
                    background: card.bg, 
                    padding: '15px', 
                    borderRadius: '16px', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {card.icon}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Donation Statistics */}
      <Row className="g-4">
        {donationCards.map((card, idx) => (
          <Col md={3} key={idx}>
            <Card 
              className="border-0 shadow-sm h-100" 
              style={{ 
                borderRadius: '20px', 
                overflow: 'hidden', 
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
              }}
            >
              <Card.Body style={{ padding: '25px' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-2" style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', letterSpacing: '0.5px' }}>
                      {card.title}
                    </h6>
                    <h2 className="mb-0" style={{ fontWeight: '800', color: '#1e293b', fontSize: '2rem' }}>
                      {card.value}
                    </h2>
                  </div>
                  <div style={{ 
                    background: card.bg, 
                    padding: '15px', 
                    borderRadius: '16px', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {card.icon}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}