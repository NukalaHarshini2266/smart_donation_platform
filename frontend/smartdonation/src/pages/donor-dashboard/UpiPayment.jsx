import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/api";

function UpiPayment() {

  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    donorId,
    organizationId,
    needId,
    amount,
    phone,
    address,
    orgMobile,
    description,
    from
    } = state || {};

  const handlePaymentDone = () => {

    const data = {
        type: "MONEY",
        amount: parseFloat(amount),
        paymentMode: "UPI",
        donorPhone: phone,
        donorAddress: address,
        description
    };

    // CHECK SOURCE
    if (from === "NEED") {

        api.post(
        `/donation/need-donation?donorId=${donorId}&needId=${needId}`,
        data
        )
        .then(() => {
        alert("Payment Successful & Donation Completed!");
        navigate("/donor");
        });

    } else {

        api.post(
        `/donation/manual?donorId=${donorId}&organizationId=${organizationId}`,
        data
        )
        .then(() => {
        alert("Payment Successful & Donation Completed!");
        navigate("/donor");
        });

    }
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #e0f2fe 0%, #f1f5f9 100%)',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            
            {/* Header */}
            <div className="text-center mb-4">
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💳</div>
              <h3 style={{ 
                color: '#0f172a',
                fontWeight: '700',
                letterSpacing: '-0.5px'
              }}>UPI Payment</h3>
              <p style={{ color: '#64748b' }}>Complete your payment using UPI</p>
            </div>

            {/* Payment Card */}
            <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              
              {/* Gradient Header */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '20px',
                textAlign: 'center'
              }}>
                <h5 style={{ color: 'white', marginBottom: '5px', fontWeight: '600' }}>Send Money To:</h5>
                <h4 style={{ color: 'white', marginBottom: '0', fontWeight: '700' }}>{orgMobile}</h4>
              </div>

              {/* Payment Details */}
              <div className="p-4">
                <div style={{ 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '12px', 
                  padding: '15px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: '#64748b', fontWeight: '500' }}>💰 Amount:</span>
                    <span style={{ color: '#0f172a', fontWeight: '700', fontSize: '1.2rem' }}>₹{amount}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: '#64748b', fontWeight: '500' }}>📞 Your Phone:</span>
                    <span style={{ color: '#0f172a', fontWeight: '500' }}>{phone}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: '#64748b', fontWeight: '500' }}>📍 Address:</span>
                    <span style={{ color: '#0f172a', fontWeight: '500' }}>{address}</span>
                  </div>
                  {description && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b', fontWeight: '500' }}>📝 Description:</span>
                      <span style={{ color: '#0f172a', fontWeight: '500' }}>{description}</span>
                    </div>
                  )}
                </div>

                {/* UPI Instructions */}
                <div style={{
                  backgroundColor: '#e0f2fe',
                  borderRadius: '12px',
                  padding: '12px',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  <small style={{ color: '#475569' }}>
                    📱 Open your UPI app (Google Pay, PhonePe, Paytm) and send payment to the above number
                  </small>
                </div>

                {/* Buttons */}
                <button
                  className="btn w-100 py-2 fw-semibold"
                  onClick={handlePaymentDone}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '10px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  ✅ I Have Paid
                </button>

                <button
                  className="btn w-100 py-2"
                  onClick={() => navigate(-1)}
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e2e8f0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default UpiPayment;