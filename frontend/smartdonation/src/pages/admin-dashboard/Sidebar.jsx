import React from 'react';
import { Badge } from 'react-bootstrap';

export default function Sidebar({ activeTab, setActiveTab, user, onClose }) {
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

      <h4 className="text-center mb-4">Admin Panel</h4>

      <button
        className="btn btn-outline-light w-100 mb-3"
        style={{ backgroundColor: activeTab === 'statistics' ? '#1abc9c' : 'transparent' }}
        onClick={() => {
          setActiveTab('statistics');
          onClose();
        }}
      >
        Statistics
      </button>

      <button
        className="btn btn-outline-light w-100 mb-3"
        style={{ backgroundColor: activeTab === 'organizations' ? '#1abc9c' : 'transparent' }}
        onClick={() => {
          setActiveTab('organizations');
          onClose();
        }}
      >
        Organizations
      </button>

      <button
        className="btn btn-outline-light w-100 mb-3"
        style={{ backgroundColor: activeTab === 'organizationRequests' ? '#1abc9c' : 'transparent' }}
        onClick={() => {
          setActiveTab('organizationRequests');
          onClose();
        }}
      >
        Organization Requests
      </button>

      <button
        className="btn btn-outline-light w-100 mb-3"
        style={{ backgroundColor: activeTab === 'donations' ? '#1abc9c' : 'transparent' }}
        onClick={() => {
          setActiveTab('donations');
          onClose();
        }}
      >
        Donations
      </button>

      <button
        className="btn btn-outline-light w-100 mb-3"
        style={{ backgroundColor: activeTab === 'addMembers' ? '#1abc9c' : 'transparent' }}
        onClick={() => {
          setActiveTab('addMembers');
          onClose();
        }}
      >
        Add Members
      </button>
      <button
        className="btn btn-outline-light w-100 mb-3"
        style={{ backgroundColor: activeTab === 'users' ? '#1abc9c' : 'transparent' }}
        onClick={() => {
          setActiveTab('users');
          onClose();
        }}
      >
        View Users
      </button>

      <button
        className="btn btn-outline-light w-100 mb-3"
        style={{ backgroundColor: activeTab === 'forgotpassword' ? '#1abc9c' : 'transparent' }}
        onClick={() => {
          setActiveTab('forgotpassword');
          onClose();
        }}
      >
        Reset Password
      </button>

      <button
        className="btn btn-danger w-100 mt-3"
        onClick={handleLogout}
      >
        Logout
      </button>

      <hr className="my-4" style={{ backgroundColor: '#ffffff40' }} />

      <div className="small text-center">
        Logged in as: <b>{user?.name || 'Admin'}</b>
        <Badge bg="info" className="ms-2">{user?.role || 'ADMIN'}</Badge>
      </div>
    </div>
  );
}