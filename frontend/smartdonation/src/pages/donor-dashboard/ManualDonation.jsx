import React, { useEffect, useState } from "react";
import api from "./../../api/api";
import { useNavigate } from "react-router-dom";

function ManualDonation({ user }) {

  
  const navigate = useNavigate();
  //const donorId = user?.id;
  const finalUser = user || JSON.parse(localStorage.getItem("user"));
  const donorId = finalUser?.id;

  const [organizations, setOrganizations] = useState([]);
  const [organizationId, setOrganizationId] = useState("");

  const [type, setType] = useState("MONEY");

  const [description,setDescription]=useState("");
  const [orgMobile, setOrgMobile] = useState("");

  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pickupTime, setPickupTime] = useState("");

  const [paymentMode, setPaymentMode] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [serviceTime, setServiceTime] = useState("");

  useEffect(() => {
    api.get("/organization/orgnames")
      .then(res => setOrganizations(res.data));
  }, []);

  const donate = (e) => {
    e.preventDefault();

    if (!organizationId) return alert("Select organization");

    // 👉 UPI FLOW
    if (type === "MONEY" && paymentMode === "UPI") {

      const paymentData = {
        donorId,
        organizationId,
        amount,
        phone,
        address,
        orgMobile,
        description
      };

      // 🔥 redirect instead of API call
      navigate("/upi-payment", { state: paymentData });
      return;
    }

    // NORMAL FLOW (CASH / FOOD / SERVICE)
    const data = {
      type,
      description,
      donorPhone: phone,
      donorAddress: address,
      preferredPickupTime: pickupTime,
      paymentMode,
      serviceDate,
      serviceTime
    };

    if (type === "MONEY") data.amount = parseFloat(amount);
    else if (type === "FOOD") {
      data.quantity = parseFloat(quantity);
      data.unit = "kg";
    } else if (type === "SERVICE") {
      data.quantity = parseFloat(quantity);
      data.unit = "volunteers";
    }

    api.post(`/donation/manual?donorId=${donorId}&organizationId=${organizationId}`, data)
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

        navigate("/donor-dashboard");
      })
  };

  return (
    <div className="container py-4" style={{ 
      background: 'linear-gradient(135deg, #e0f2fe 0%, #f1f5f9 100%)',
      minHeight: '100vh',
      borderRadius: '0'
    }}>
      {/* Header Section */}
      <div className="text-center mb-4">
        <h3 className="mb-2" style={{ 
          color: '#0f172a',
          fontWeight: '700',
          letterSpacing: '-0.5px',
          fontSize: '2.5rem'
        }}>Manual Donation</h3>
        <p style={{ 
          color: '#64748b',
          fontSize: '1.1rem'
        }}>Support organizations directly by choosing what to donate</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-11">
          <form onSubmit={donate} className="card border-0 shadow-lg" style={{ 
            borderRadius: '24px',
            overflow: 'hidden'
          }}>
            {/* Form Header with Gradient */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '20px 24px',
              color: 'white'
            }}>
              <h5 className="mb-0 text-center" style={{ 
                fontWeight: '600', 
                letterSpacing: '-0.3px',
                fontSize: '1.5rem'
              }}>
                📝 Donation Details
              </h5>
              <small className="d-block text-center" style={{ 
                opacity: 0.9,
                fontSize: '0.95rem'
              }}>Fill in the information below</small>
            </div>

            {/* Form Body */}
            <div className="p-4">
              <select
                className="form-control mb-3"
                value={organizationId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setOrganizationId(selectedId);

                  const selectedOrg = organizations.find(o => o.id == selectedId);
                  setOrgMobile(selectedOrg?.mobile || "");
                }}
                style={{
                  borderRadius: '12px',
                  padding: '12px 16px',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  fontSize: '1.1rem'
                }}
              >
                <option value="">Select Organization</option>

                {organizations.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>

              <select
                className="form-control mb-3"
                value={type}
                onChange={(e)=>setType(e.target.value)}
                style={{
                  borderRadius: '12px',
                  padding: '12px 16px',
                  border: '1px solid #e2e8f0',
                  fontSize: '1rem'
                }}
              >
                <option value="MONEY">💰 MONEY</option>
                <option value="FOOD">🍕 FOOD</option>
                <option value="SERVICE">🤝 SERVICE</option>
              </select>

              {type === "MONEY" && (
                <>
                  <input 
                    className="form-control mb-3" 
                    placeholder="Amount"
                    value={amount}
                    onChange={(e)=>setAmount(e.target.value)}
                    style={{
                      borderRadius: '12px',
                      padding: '12px 16px',
                      border: '1px solid #e2e8f0',
                      fontSize: '1.1rem'
                    }}
                  />

                  <select
                    className="form-control mb-3"
                    value={paymentMode}
                    onChange={(e)=>setPaymentMode(e.target.value)}
                    style={{
                      borderRadius: '12px',
                      padding: '12px 16px',
                      border: '1px solid #e2e8f0',
                      fontSize: '1.1rem'
                    }}
                  >
                    <option value="">Payment Mode</option>
                    <option value="UPI">UPI</option>
                    <option value="CASH">Cash</option>
                  </select>
                </>
              )}

              {(type === "FOOD" ||  (type === "MONEY" && paymentMode === "CASH")) && (
                <>
                  {type === "FOOD" && (
                    <input 
                      className="form-control mb-3"
                      placeholder="Quantity"
                      value={quantity}
                      onChange={(e)=>setQuantity(e.target.value)}
                      style={{
                        borderRadius: '12px',
                        padding: '12px 16px',
                        border: '1px solid #e2e8f0',
                        fontSize: '1.1rem'
                      }}
                    />
                  )}

                  <input 
                    type="datetime-local"
                    className="form-control mb-3"
                    placeholder="Pickup Time"
                    value={pickupTime}
                    onChange={(e)=>setPickupTime(e.target.value)}
                    style={{
                      borderRadius: '12px',
                      padding: '12px 16px',
                      border: '1px solid #e2e8f0',
                      fontSize: '1.1rem'
                    }}
                  />
                </>
              )}

              {type === "SERVICE" && (
                <>
                  <input 
                    className="form-control mb-3"
                    placeholder="Volunteers"
                    value={quantity}
                    onChange={(e)=>setQuantity(e.target.value)}
                    style={{
                      borderRadius: '12px',
                      padding: '12px 16px',
                      border: '1px solid #e2e8f0',
                      fontSize: '1.1rem'
                    }}
                  />
                  <input 
                    type="date" 
                    className="form-control mb-3"
                    value={serviceDate}
                    onChange={(e)=>setServiceDate(e.target.value)}
                    style={{
                      borderRadius: '12px',
                      padding: '12px 16px',
                      border: '1px solid #e2e8f0',
                      fontSize: '1.1rem'
                    }}
                  />
                  <input 
                    type="time" 
                    className="form-control mb-3"
                    value={serviceTime}
                    onChange={(e)=>setServiceTime(e.target.value)}
                    style={{
                      borderRadius: '12px',
                      padding: '12px 16px',
                      border: '1px solid #e2e8f0',
                      fontSize: '1.1rem'
                    }}
                  />
                </>
              )}
              
              <textarea
                className="form-control mb-3"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                style={{
                  borderRadius: '12px',
                  padding: '12px 16px',
                  border: '1px solid #e2e8f0',
                  resize: 'vertical',
                  fontSize: '1.1rem'
                }}
              />

              <input 
                className="form-control mb-3" 
                placeholder="Phone"
                value={phone}
                onChange={(e)=>setPhone(e.target.value)}
                style={{
                  borderRadius: '12px',
                  padding: '12px 16px',
                  border: '1px solid #e2e8f0',
                  fontSize: '1.1rem'
                }}
              />

              <input 
                className="form-control mb-4" 
                placeholder="Address"
                value={address}
                onChange={(e)=>setAddress(e.target.value)}
                style={{
                  borderRadius: '12px',
                  padding: '12px 16px',
                  border: '1px solid #e2e8f0',
                  fontSize: '1.1rem'
                }}
              />

              <button 
                className="btn w-100 py-3 fw-semibold"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  fontSize: '1.1rem',
                  fontWeight: '800'
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
                💝 Donate Now
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Custom focus styles */}
      <style>{`
        .form-control:focus {
          border-color: #a855f7 !important;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1) !important;
          outline: none;
        }
        
        select.form-control:focus {
          border-color: #a855f7 !important;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1) !important;
        }
        
        textarea.form-control:focus {
          border-color: #a855f7 !important;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1) !important;
        }
      `}</style>
    </div>
  );
}

export default ManualDonation;