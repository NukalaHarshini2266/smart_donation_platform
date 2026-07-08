import React, { useEffect, useState } from "react";
import api from "../../api/api";

function MyDonations({ user }) {

  const [donations, setDonations] = useState([]);
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchDonations();
    }
  }, [user]);

  const fetchDonations = async () => {
    try {
      const res = await api.get(`/donation/by-donor/${user.id}`);
      setDonations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // FILTER LOGIC
  const filteredDonations = donations.filter(d => {
    if (filterType !== "ALL" && d.type !== filterType) return false;
    if (filterStatus !== "ALL" && d.status !== filterStatus) return false;
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING": return "badge bg-secondary";
      case "ACCEPTED": return "badge bg-primary";
      case "COMPLETED": return "badge bg-success";
      case "REJECTED": return "badge bg-danger";
      default: return "badge bg-dark";
    }
  };

  return (
    <div className="p-3" style={{ 
      background: 'linear-gradient(135deg, #e0f2fe 0%, #f1f5f9 100%)',
      minHeight: '100vh'
    }}>

      <h3 className="mb-3 text-center fs-1 fw-bold">My Donations</h3>

      {/* FILTER DROPDOWNS */}
      <div className="mb-3 d-flex gap-2 align-items-center">
        <select 
          className="form-select form-select-sm w-auto"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ width: '130px' }}
        >
          <option value="ALL">All Types</option>
          <option value="MONEY">Money</option>
          <option value="FOOD">Food</option>
          <option value="SERVICE">Service</option>
        </select>

        <select 
          className="form-select form-select-sm w-auto"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ width: '130px' }}
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <button 
          className="btn btn-sm btn-secondary"
          onClick={() => {
            setFilterType("ALL");
            setFilterStatus("ALL");
          }}
        >
          Reset
        </button>
      </div>

      {/* TABLE */}
      <div className="table-responsive rounded-5 overflow-hidden">
        <table className="table table-bordered table-hover shadow">

          <thead className="text-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <tr>
              <th>Type</th>
              <th>Amount / Qty</th>
              <th>Organization</th>
              <th>Status</th>
              <th>Date</th>
              <th>Details</th>
            </tr>
          </thead>

          <tbody>
            {filteredDonations.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No Donations Found</td>
              </tr>
            ) : (
              filteredDonations.map(d => (
                <tr key={d.id} className="align-middle text-center">
                  <td>
                    <span className="badge" style={{ 
                      backgroundColor: d.type === "MONEY" ? '#10b981' : d.type === "FOOD" ? '#f59e0b' : '#8b5cf6'
                    }}>{d.type}</span>
                  </td>
                  <td>
                    {d.type === "MONEY"
                      ? `₹${d.amount}`
                      : `${d.quantity || "-"} ${d.unit || ""}`
                    }
                  </td>
                  <td>{d.organizationName || "-"}</td>
                  <td>
                    <span className={getStatusBadge(d.status)}>
                      {d.status}
                    </span>
                  </td>
                  <td>
                    {d.createdAt
                      ? new Date(d.createdAt).toLocaleDateString()
                      : "-"
                    }
                  </td>
                  <td>
                    <button
                      className="btn btn-sm"
                      onClick={() => setSelectedDonation(d)}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none'
                      }}
                    >
                      View more
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      {/* MODAL */}
      {selectedDonation && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <h5 className="modal-title text-white">Donation Details</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedDonation(null)}
                ></button>
              </div>

              <div className="modal-body">
                <p><b>Type:</b> {selectedDonation.type}</p>
                <p><b>Amount / Quantity:</b> {
                  selectedDonation.type === "MONEY"
                    ? `₹${selectedDonation.amount}`
                    : `${selectedDonation.quantity} ${selectedDonation.unit}`
                }</p>
                <p><b>Organization:</b> {selectedDonation.organizationName}</p>
                <p><b>Status:</b> <span className={getStatusBadge(selectedDonation.status)}>{selectedDonation.status}</span></p>
                <hr />
                <p><b>📞 Phone:</b> {selectedDonation.donorPhone || "-"}</p>
                <p><b>📍 Address:</b> {selectedDonation.donorAddress || "-"}</p>
                {selectedDonation.type === "FOOD" && (
                  <p><b>⏰ Pickup Time:</b> {selectedDonation.preferredPickupTime || "-"}</p>
                )}
                {selectedDonation.type === "SERVICE" && (
                  <>
                    <p><b>📅 Service Date:</b> {selectedDonation.serviceDate || "-"}</p>
                    <p><b>⏰ Service Time:</b> {selectedDonation.serviceTime || "-"}</p>
                  </>
                )}
                {selectedDonation.type === "MONEY" && (
                  <p><b>💳 Payment Mode:</b> {selectedDonation.paymentMode || "-"}</p>
                )}
                {selectedDonation.status === "REJECTED" && (
                  <p className="text-danger">
                    <b>❌ Rejection Reason:</b> {selectedDonation.rejectionReason}
                  </p>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedDonation(null)}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* BACKDROP */}
      {selectedDonation && (
        <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
      )}

    </div>
  );
}

export default MyDonations;