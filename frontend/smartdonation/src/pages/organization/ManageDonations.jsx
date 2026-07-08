import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { FaCheck, FaTimes, FaCheckCircle, FaFilter, FaMoneyBill, FaUtensils, FaHandsHelping, FaUser, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaInfoCircle, FaRupeeSign } from "react-icons/fa";

export default function ManageDonations({ organizationId }) {

  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [rejectReason, setRejectReason] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const fetchDonations = () => {
    api.get(`/donation/by-organization/${organizationId}`)
      .then(res => setDonations(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchDonations();
  }, [organizationId]);

  const filteredDonations = donations.filter(d => {
    if (filter === "ALL") return true;
    return d.status === filter;
  });

  const acceptDonation = (id) => {
    if (status === "UNDER_REVIEW") {
      const confirmAccept = window.confirm(
        "⚠️ This donation is flagged as suspicious.\nAre you sure you want to ACCEPT it?"
      );
      if (!confirmAccept) return;
    }

    api.put(`/donation/${id}/accept`)
      .then(() => {
        alert("Accepted");
        fetchDonations();
      });
  };

  const rejectDonation = () => {
    api.put(`/donation/${selectedId}/reject?reason=${rejectReason}`)
      .then(() => {
        setSelectedId(null);
        setRejectReason("");
        fetchDonations();
      });
  };

  const completeDonation = (id) => {
    api.put(`/donation/${id}/complete`)
      .then(() => {
        fetchDonations();
      });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "PENDING": return { bg: "#f6c23e", text: "Pending" };
      //case "UNDER_REVIEW": return { bg: "#f39c12", text: "Under Review" }; // orange
      case "ACCEPTED": return { bg: "#4e73df", text: "Accepted" };
      case "COMPLETED": return { bg: "#1cc88a", text: "Completed" };
      case "REJECTED": return { bg: "#e74a3b", text: "Rejected" };
      default: return { bg: "#858796", text: status };
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case "MONEY": return <FaMoneyBill style={{ color: '#1cc88a' }} />;
      case "FOOD": return <FaUtensils style={{ color: '#f6c23e' }} />;
      case "SERVICE": return <FaHandsHelping style={{ color: '#4e73df' }} />;
      default: return null;
    }
  };

  return (
    <div>
      <h3 className="mb-4" style={{ fontWeight: '600', color: '#1e293b' }}>📋 Manage Donations</h3>

      {/* FILTER BUTTONS */}
      <div className="mb-4 d-flex gap-2 flex-wrap">
        {["ALL", "PENDING","ACCEPTED", "REJECTED", "COMPLETED"].map(f => (
          <button
            key={f}
            className={`btn ${filter === f ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setFilter(f)}
            style={{ borderRadius: '10px', padding: '8px 20px', fontWeight: '500' }}
          >
            <FaFilter className="me-1" /> {f}
          </button>
        ))}
      </div>

      {/* DONATION CARDS */}
      {filteredDonations.map(d => (
        <div key={d.id} className="card mb-4 shadow-sm border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
          <div className="row g-0">
            {/* LEFT COLUMN - Donor Info */}
            <div className="col-md-7 p-4" style={{ background: '#f8f9fc' }}>
              <div className="d-flex align-items-center mb-3">
                <div style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px',
                  color: 'white'
                }}>
                  <FaUser size={20} />
                </div>
                <div>
                  <h5 className="mb-0" style={{ fontWeight: '700', color: '#1e293b' }}>{d.donorName}</h5>
                  <small className="text-muted">Donor</small>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <p className="mb-2"><FaPhone className="me-2" style={{ color: '#667eea' }} /> <b>Phone:</b> {d.donorPhone}</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-2"><FaMapMarkerAlt className="me-2" style={{ color: '#667eea' }} /> <b>Address:</b> {d.donorAddress}</p>
                </div>
              </div>

              <hr style={{ borderColor: '#e2e8f0' }} />

              <div className="row">
                <div className="col-md-12">
                  <div className="d-flex align-items-center mb-2">
                    {getTypeIcon(d.type)}
                    <b className="ms-2">Donation Type:</b> 
                    <span className="ms-2 badge" style={{ backgroundColor: '#e2e8f0', color: '#2c3e50', padding: '5px 10px' }}>{d.type}</span>
                  </div>
                </div>
              </div>

              {d.type === "MONEY" && (
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-2"><FaRupeeSign className="me-2" style={{ color: '#1cc88a' }} /> <b>Amount:</b> <span style={{ fontSize: '18px', fontWeight: '700', color: '#1cc88a' }}>₹{parseInt(d.amount).toLocaleString()}</span></p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2"><b>Payment Mode:</b> {d.paymentMode}</p>
                  </div>
                </div>
              )}

              {d.type === "FOOD" && (
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-2"><b>Quantity:</b> {d.quantity} {d.unit}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2"><FaClock className="me-2" style={{ color: '#667eea' }} /> <b>Pickup:</b> {d.preferredPickupTime}</p>
                  </div>
                </div>
              )}

              {d.type === "SERVICE" && (
                <div className="row">
                  <div className="col-md-4">
                    <p className="mb-2"><b>Quantity:</b> {d.quantity} {d.unit}</p>
                  </div>
                  <div className="col-md-4">
                    <p className="mb-2"><FaCalendarAlt className="me-2" style={{ color: '#667eea' }} /> <b>Date:</b> {d.serviceDate}</p>
                  </div>
                  <div className="col-md-4">
                    <p className="mb-2"><FaClock className="me-2" style={{ color: '#667eea' }} /> <b>Time:</b> {d.serviceTime}</p>
                  </div>
                </div>
              )}

              {d.description && (
                <div className="row mt-2">
                  <div className="col-md-12">
                    <p className="mb-0"><FaInfoCircle className="me-2" style={{ color: '#667eea' }} /> <b>Description:</b> {d.description}</p>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN - Status & Actions */}
            <div className="col-md-5 p-4 d-flex flex-column justify-content-between">
              <div>
                <div className="mb-3">
                  <b>Status:</b>
                  <span className="ms-2 badge" style={{ 
                    backgroundColor: getStatusBadge(d.status).bg,
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px'
                  }}>
                    {getStatusBadge(d.status).text}
                  </span>
                </div>

                <p className="mb-3"><b>Donated At:</b> {new Date(d.createdAt).toLocaleString()}</p>

                {d.status === "UNDER_REVIEW" && (
                  <div className="alert alert-warning mt-2" style={{ borderRadius: '10px' }}>
                    ⚠️ <b>Fraud Alert:</b><br/>
                    {d.rejectionReason || "Suspicious activity detected. Please review carefully."}
                  </div>
                )}
                {d.status === "REJECTED" && (
                  <div className="alert alert-danger" style={{ borderRadius: '10px', padding: '10px', marginTop: '10px' }}>
                    <b>Rejection Reason:</b><br />
                    {d.rejectionReason}
                  </div>
                )}
              </div>

              {/* ACTIONS - Bottom aligned */}
              <div className="mt-auto">
                {(d.status === "PENDING" || d.status === "UNDER_REVIEW")  && (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success flex-grow-1"
                      onClick={() => acceptDonation(d.id)}
                      style={{ borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <FaCheck /> Accept
                    </button>
                    <button
                      className="btn btn-danger flex-grow-1"
                      onClick={() => setSelectedId(d.id)}
                      style={{ borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <FaTimes /> Reject
                    </button>
                  </div>
                )}

                {d.status === "ACCEPTED" && (
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => completeDonation(d.id)}
                    style={{ borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <FaCheckCircle /> Mark Completed
                  </button>
                )}

                {/* REJECT INPUT */}
                {selectedId === d.id && (
                  <div className="mt-3 p-3" style={{ background: '#f8f9fc', borderRadius: '12px' }}>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Enter rejection reason"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      style={{ borderRadius: '10px' }}
                    />
                    <button
                      className="btn btn-danger w-100"
                      onClick={rejectDonation}
                      style={{ borderRadius: '10px' }}
                    >
                      Submit Rejection
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {filteredDonations.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No donations found for this filter.</p>
        </div>
      )}
    </div>
  );
}