
import React from "react";
import { Badge } from "react-bootstrap";

export default function SidebarOrg({ activeTab, setActiveTab, onClose }) {
  const role = localStorage.getItem("role");
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "250px",
        height: "100vh",
        background: "#001f3f",
        color: "white",
        padding: "20px",
        paddingTop: "60px",
        zIndex: 1100,
        overflowY: "auto"
      }}
    >
      {/* CLOSE BUTTON */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: "24px",
          cursor: "pointer"
        }}
      >
        ❌
      </button>

      <h4 className="text-center mb-4">Organization Panel</h4>

      <button
        className="btn btn-outline-light w-100 mb-3"
        style={{ 
          // backgroundColor: activeTab === "dashboard" ? '#ffffff' : 'transparent',
          textAlign: "left",
          fontWeight: activeTab === "dashboard" ? "600" : "400"
        }}
        onClick={() => setActiveTab("dashboard")}
      >
        Dashboard
      </button>

      {role === "ORGANIZATION" && (
        <>
          <button
            className="btn btn-outline-light w-100 mb-3"
            style={{ 
              textAlign: "left",
              fontWeight: activeTab === "addStaff" ? "600" : "400"
            }}
            onClick={() => setActiveTab("addStaff")}
          >
            Add Staff
          </button>

          <button
            className="btn btn-outline-light w-100 mb-3"
            style={{ 
              textAlign: "left",
              fontWeight: activeTab === "viewStaff" ? "600" : "400"
            }}
            onClick={() => setActiveTab("viewStaff")}
          >
            View Staff
          </button>
        </>
      )}

      <button
        className="btn btn-outline-light w-100 mb-3"
        style={{ 
          textAlign: "left",
          fontWeight: activeTab === "postNeed" ? "600" : "400"
        }}
        onClick={() => setActiveTab("postNeed")}
      >
        Post Need
      </button>

      <button
        className="btn btn-outline-light w-100 mb-3"
        style={{ 
          textAlign: "left",
          fontWeight: activeTab === "viewNeeds" ? "600" : "400"
        }}
        onClick={() => setActiveTab("viewNeeds")}
      >
        View Needs
      </button>

      <button
        className="btn btn-outline-light w-100 mb-3"
        style={{ 
          textAlign: "left",
          fontWeight: activeTab === "donations" ? "600" : "400"
        }}
        onClick={() => setActiveTab("donations")}
      >
        Manage Donations
      </button>

      <button
        className="btn btn-outline-light w-100 mb-3"
        style={{ 
          textAlign: "left",
          fontWeight: activeTab === "forgotpassword" ? "600" : "400"
        }}
        onClick={() => setActiveTab("forgotpassword")}
      >
        Reset Password
      </button>

      <button
        className="btn btn-danger w-100 mt-3"
        onClick={handleLogout}
      >
        Logout
      </button>

    </div>
  );
}