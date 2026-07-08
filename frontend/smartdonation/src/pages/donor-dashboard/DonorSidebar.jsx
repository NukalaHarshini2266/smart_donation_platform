import React from "react";

function DonorSidebar({ setActivePage, onClose }) {

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
        zIndex: 1100
      }}
    >

      {/* ❌ CLOSE BUTTON */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: "24px"
        }}
      >
        ❌
      </button>

      <h4 className="text-center mb-4">Donor Panel</h4>

      <button className="btn btn-outline-light w-100 mb-3"
        onClick={() => setActivePage("needs")}
      >
        View Needs
      </button>

      <button className="btn btn-outline-light w-100 mb-3"
        onClick={() => setActivePage("manual")}
      >
        Manual Donation
      </button>

      <button className="btn btn-outline-light w-100 mb-3"
        onClick={() => setActivePage("mydonations")}
      >
        My Donations
      </button>

      <button className="btn btn-outline-light w-100 mb-3"
        onClick={() => setActivePage("forgotpassword")}
      >
        Reset Password
      </button>

      <button className="btn btn-danger w-100 mt-3"
        onClick={handleLogout}
      >
        Logout
      </button>

    </div>
  );
}

export default DonorSidebar;