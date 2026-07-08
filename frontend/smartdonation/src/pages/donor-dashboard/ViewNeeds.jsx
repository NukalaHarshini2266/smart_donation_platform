import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./../../api/api";

function ViewNeeds({ user }) {
  const navigate = useNavigate();

  const [needs, setNeeds] = useState([]);
  const [openOrg, setOpenOrg] = useState(null);
  const [selectedNeed, setSelectedNeed] = useState(null);

  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pickupTime, setPickupTime] = useState("");

  const [paymentMode, setPaymentMode] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [serviceTime, setServiceTime] = useState("");

  const [description, setDescription] = useState("");

  const donorId = user?.id;

  const fetchNeeds = () => {
    api.get("/needs/all-open")
      .then(res => setNeeds(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchNeeds();
  }, []);

  const openDonateModal = (need) => {
    setSelectedNeed(need);

    setAmount("");
    setQuantity("");
    setPhone("");
    setAddress("");
    setPickupTime("");
    setPaymentMode("");
    setServiceDate("");
    setServiceTime("");
    setDescription("");
  };

  const submitDonation = () => {
    if (!phone || !address || !description) {
      alert("Please fill all required fields");
      return;
    }

    // UPI FLOW
    if (selectedNeed.category === "MONEY" && paymentMode === "UPI") {
      if (!amount) return alert("Enter amount");

      const paymentData = {
        donorId,
        needId: selectedNeed.needId,
        amount,
        phone,
        address,
        orgMobile: selectedNeed.organizationHeadPhone,
        description,
        from: "NEED"
      };

      navigate("/upi-payment", { state: paymentData });
      return;
    }

    // NORMAL FLOW
    const donationData = {
      type: selectedNeed.category,
      description,
      donorPhone: phone,
      donorAddress: address,
      preferredPickupTime: pickupTime,
      paymentMode,
      serviceDate,
      serviceTime
    };

    if (selectedNeed.category === "MONEY") {
      if (!amount) return alert("Enter amount");
      if (!paymentMode) return alert("Select payment mode");
      donationData.amount = parseFloat(amount);
    } else {
      if (!quantity) return alert("Enter quantity");
      donationData.quantity = parseFloat(quantity);
      donationData.unit = selectedNeed.unit;
    }

    api.post(
      `/donation/need-donation?donorId=${donorId}&needId=${selectedNeed.needId}`,
      donationData
    )
    .then((res) => {

      const status = res.data.status;

      if (status === "UNDER_REVIEW") {
        alert("⚠️ Donation is under review due to suspicious activity");
      } 
      else if (status === "PENDING") {
        alert("🕒 Donation submitted and waiting for approval");
      } 
      else if (status === "COMPLETED") {
        alert("✅ Donation completed successfully");
      }

      setSelectedNeed(null);
      fetchNeeds();
    })
    .catch(() => alert("❌ Error"));
  };

  // Helper function to get urgency badge color
  const getUrgencyColor = (urgency) => {
    switch(urgency?.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  };

  // Calculate progress percentage
  const getProgressPercentage = (required, collected) => {
    if (!required || required === 0) return 0;
    const percentage = (collected / required) * 100;
    return Math.min(percentage, 100);
  };

  return (
    <div className="view-needs-page" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f1f5f9 100%)',
  minHeight: '100vh' ,
   }}>
      {/* Hero Header */}
      <div className="mb-5" 
      // style={{ 
      //   // background: 'linear-gradient(135deg, #e0f2fe 0%, #f1f5f9 100%)',
      //   borderBottom: '1px solid rgba(0,0,0,0.05)'
      // }}
       >
        <div className="container">
          <div className="text-center py-4">
            <h1 className="display-5 fw-bold mb-3" style={{ color: '#0f172a', fontSize: '2.8rem' }}>
              🤝 Make a Difference Today
            </h1>
            <p className="lead mb-0" style={{ color: '#475569', fontSize: '1.3rem' }}>
              Browse urgent needs from verified organizations and donate with ease
            </p>
          </div>
        </div>
      </div>

      <div className="container-fluid pb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0" style={{ color: '#1e293b', fontSize: '2rem', fontWeight: '600' }}>Active Needs</h2>
          <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: '#e2e8f0', color: '#475569', fontSize: '1rem' }}>
            {needs.length} needs
          </span>
        </div>

        <div className="row g-4" >
          {needs.map((need, index) => {
            const progress = getProgressPercentage(need.requiredQuantity, need.collectedQuantity);
            const urgencyColor = getUrgencyColor(need.urgency);
            
            return (
              <div className="col-lg-4 col-md-6" key={need.needId}>
                <div className="card h-100 shadow-sm hover-card" style={{ 
                  borderRadius: '20px',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer'
                }}>
                  <div className="position-relative">
                    <img
                      src={`http://localhost:8080/uploads/needs/${need.imageUrl}`}
                      className="card-img-top"
                      alt={need.title}
                      style={{ 
                        height: "220px", 
                        objectFit: "cover",
                        borderTopLeftRadius: '20px',
                        borderTopRightRadius: '20px'
                      }}
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className={`badge bg-${urgencyColor} px-3 py-2 rounded-pill shadow-sm`} style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                        ⚡ {need.urgency} Urgency
                      </span>
                    </div>
                  </div>

                  <div className="card-body p-4">
                    <h5 className="card-title fw-bold mb-2" style={{ color: '#0f172a', fontSize: '1.6rem', lineHeight: '1.3' }}>
                      {need.title}
                    </h5>
                    <p className="card-text mb-3" style={{ color: '#475569', fontSize: '1.1rem', lineHeight: '1.6' }}>
                      {need.description?.length > 120 
                        ? `${need.description.substring(0, 120)}...` 
                        : need.description}
                    </p>

                    <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                      <span className="badge px-3 py-2 rounded-pill" style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '1rem', fontWeight: '500' }}>
                        📍 {need.location}
                      </span>
                      <span className="badge px-3 py-2 rounded-pill" style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '1rem', fontWeight: '500' }}>
                        🏷️ {need.category}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span style={{ color: '#475569', fontSize: '1rem', fontWeight: '500' }}>Progress</span>
                        <span style={{ color: '#475569', fontSize: '1rem', fontWeight: '500' }}>{Math.round(progress)}%</span>
                      </div>
                      <div className="progress" style={{ height: '10px', borderRadius: '10px' }}>
                        <div 
                          className="progress-bar" 
                          role="progressbar" 
                          style={{ 
                            width: `${progress}%`,
                            backgroundColor: '#10b981',
                            borderRadius: '10px',
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </div>
                      <div className="d-flex justify-content-between mt-2">
                        <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Collected: {need.collectedQuantity || 0} {need.unit}</span>
                        <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Required: {need.requiredQuantity} {need.unit}</span>
                      </div>
                    </div>

                    <p className="mb-3" style={{ color: '#64748b', fontSize: '1rem' }}>
                      📅 Deadline: {new Date(need.deadline).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>

                    <button
                      className="btn btn-link p-0 text-decoration-none mb-3"
                      onClick={() => setOpenOrg(openOrg === need.needId ? null : need.needId)}
                      style={{ color: '#3b82f6', fontSize: '1rem', fontWeight: '500' }}
                    >
                      {openOrg === need.needId ? '− Hide Organization Info' : '+ Read More'}
                    </button>

                    {openOrg === need.needId && (
                      <div className="mt-3 p-2 rounded-3 animate-fade-in" style={{ 
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        transition: 'all 0.2s ease'
                      }}>
                        <h6 className="fw-bold mb-2" style={{ color: '#0f172a', fontSize: '1.2rem' }}>{need.organizationName}</h6>
                        <p className="mb-1" style={{ color: '#475569', fontSize: '1rem' }}>
                          📍 {need.organizationAddress}
                        </p>
                        <p className="mb-1" style={{ color: '#475569', fontSize: '1rem' }}>
                          📞 {need.organizationHeadPhone}
                        </p>
                        <p className="mb-0" style={{ color: '#475569', fontSize: '1rem' }}>
                          ✉️ {need.organizationHeadEmail}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="card-footer border-0 p-4 pt-0">
                    <button
                      className="btn w-100 py-2 rounded-pill fw-semibold"
                      onClick={() => openDonateModal(need)}
                      style={{
                        //backgroundColor: '#10b981',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        transition: 'all 0.2s ease',
                        fontSize: '1rem',
                        fontWeight: '600',
                        padding: '12px'
                      }}
                    >
                      Donate Now →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {needs.length === 0 && (
          <div className="text-center py-5">
            <div className="display-1 mb-3">🌟</div>
            <h3 className="h4 mb-2" style={{ color: '#475569', fontSize: '1.8rem' }}>No active needs at the moment</h3>
            <p className="text-muted" style={{ fontSize: '1.1rem' }}>Check back later for donation opportunities</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedNeed && (
        <div className="modal show d-block" style={{ 
          background: "rgba(0,0,0,0.5)", 
          backdropFilter: "blur(4px)",
          zIndex: 1050
        }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow-lg" style={{ animation: 'slideUp 0.2s ease' }}>
              <div className="modal-header border-0 pb-0">
                <div>
                  <h5 className="modal-title fw-bold" style={{ color: '#0f172a', fontSize: '1.6rem' }}>
                    Make a Donation
                  </h5>
                  <p className="mb-0 mt-1" style={{ color: '#64748b', fontSize: '1rem' }}>
                    {selectedNeed.title} • {selectedNeed.category}
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSelectedNeed(null)}
                />
              </div>

              <div className="modal-body p-4">
                {/* MONEY */}
                {selectedNeed.category === "MONEY" && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '0.95rem' }}>Donation Amount *</label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      className="form-control rounded-3 py-2"
                      value={amount}
                      onChange={(e)=>setAmount(e.target.value)}
                      style={{ borderColor: '#e2e8f0', fontSize: '1rem' }}
                    />
                    
                    <label className="form-label fw-semibold mt-3" style={{ fontSize: '0.95rem' }}>Payment Mode *</label>
                    <select
                      className="form-select rounded-3 py-2"
                      value={paymentMode}
                      onChange={(e)=>setPaymentMode(e.target.value)}
                      style={{ borderColor: '#e2e8f0', fontSize: '1rem' }}
                    >
                      <option value="">Select Payment Mode</option>
                      <option>UPI</option>
                      <option>Cash</option>
                    </select>

                    <label className="form-label fw-semibold mt-3" style={{ fontSize: '0.95rem' }}>Description / Instructions *</label>
                    <textarea
                      className="form-control rounded-3"
                      rows="2"
                      placeholder="If cash, mention where to collect money / UPI details"
                      value={description}
                      onChange={(e)=>setDescription(e.target.value)}
                      style={{ borderColor: '#e2e8f0', fontSize: '1rem' }}
                    />
                  </div>
                )}

                {/* FOOD */}
                {selectedNeed.category === "FOOD" && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '0.95rem' }}>Quantity * ({selectedNeed.unit})</label>
                    <input
                      type="number"
                      placeholder={`Quantity (${selectedNeed.unit})`}
                      className="form-control rounded-3 py-2 mb-3"
                      value={quantity}
                      onChange={(e)=>setQuantity(e.target.value)}
                      style={{ borderColor: '#e2e8f0', fontSize: '1rem' }}
                    />

                    <label className="form-label fw-semibold" style={{ fontSize: '0.95rem' }}>Preferred Pickup Time</label>
                    <input
                      placeholder="e.g., Tomorrow 10 AM - 12 PM"
                      className="form-control rounded-3 py-2 mb-3"
                      value={pickupTime}
                      onChange={(e)=>setPickupTime(e.target.value)}
                      style={{ borderColor: '#e2e8f0', fontSize: '1rem' }}
                    />

                    <label className="form-label fw-semibold" style={{ fontSize: '0.95rem' }}>Pickup Location Details *</label>
                    <textarea
                      className="form-control rounded-3"
                      rows="2"
                      placeholder="Enter pickup location details"
                      value={description}
                      onChange={(e)=>setDescription(e.target.value)}
                      style={{ borderColor: '#e2e8f0', fontSize: '1rem' }}
                    />
                  </div>
                )}

                {/* SERVICE */}
                {selectedNeed.category === "SERVICE" && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '0.95rem' }}>Volunteers / Hours *</label>
                    <input
                      type="number"
                      placeholder="Number of volunteers / hours"
                      className="form-control rounded-3 py-2 mb-3"
                      value={quantity}
                      onChange={(e)=>setQuantity(e.target.value)}
                      style={{ borderColor: '#e2e8f0', fontSize: '1rem' }}
                    />

                    <div className="row g-3 mb-3">
                      <div className="col">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.95rem' }}>Service Date *</label>
                        <input type="date"
                          className="form-control rounded-3 py-2"
                          value={serviceDate}
                          onChange={(e)=>setServiceDate(e.target.value)}
                          style={{ borderColor: '#e2e8f0', fontSize: '1rem' }}
                        />
                      </div>
                      <div className="col">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.95rem' }}>Service Time *</label>
                        <input type="time"
                          className="form-control rounded-3 py-2"
                          value={serviceTime}
                          onChange={(e)=>setServiceTime(e.target.value)}
                          style={{ borderColor: '#e2e8f0', fontSize: '1rem' }}
                        />
                      </div>
                    </div>

                    <label className="form-label fw-semibold" style={{ fontSize: '0.95rem' }}>Service Description *</label>
                    <textarea
                      className="form-control rounded-3"
                      rows="2"
                      placeholder="Describe service contribution"
                      value={description}
                      onChange={(e)=>setDescription(e.target.value)}
                      style={{ borderColor: '#e2e8f0', fontSize: '1rem' }}
                    />
                  </div>
                )}

                {/* COMMON FIELDS */}
                <div className="border-top pt-3 mt-2">
                  <h6 className="fw-semibold mb-3" style={{ color: '#0f172a', fontSize: '1.05rem' }}>Your Contact Information</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.95rem' }}>Phone Number *</label>
                      <input
                        type="tel"
                        placeholder="Phone number"
                        className="form-control rounded-3 py-2"
                        value={phone}
                        onChange={(e)=>setPhone(e.target.value)}
                        style={{ borderColor: '#e2e8f0', fontSize: '1rem' }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.95rem' }}>Address *</label>
                      <input
                        placeholder="Your full address"
                        className="form-control rounded-3 py-2"
                        value={address}
                        onChange={(e)=>setAddress(e.target.value)}
                        style={{ borderColor: '#e2e8f0', fontSize: '1rem' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 pt-0 pb-4 px-4">
                <button 
                  className="btn px-4 py-2 rounded-pill" 
                  onClick={()=>setSelectedNeed(null)}
                  style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '0.95rem', fontWeight: '500' }}
                >
                  Cancel
                </button>
                <button 
                  className="btn px-4 py-2 rounded-pill text-white fw-semibold"
                  onClick={submitDonation}
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', transition: 'all 0.2s ease', fontSize: '0.95rem', fontWeight: '600' }}
                >
                  Submit Donation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        html, body {
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #e0f2fe 0%, #f1f5f9 100%);
        }
                
        .animate-fade-in {
          animation: slideUp 0.2s ease;
        }
        
        .hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -12px rgba(0, 0, 0, 0.1) !important;
        }
        
        .btn-close:focus {
          box-shadow: none;
        }
        
        input:focus, select:focus, textarea:focus {
          border-color: #10b981 !important;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
          outline: none;
        }

        /* Improved font rendering */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .card-title, .h5, h5, h6 {
          letter-spacing: -0.3px;
        }

        p, span, .text-muted, .badge {
          letter-spacing: -0.2px;
        }

        /* Better line heights for readability */
        .card-text, p, span, .badge, button, input, textarea, select {
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}

export default ViewNeeds;