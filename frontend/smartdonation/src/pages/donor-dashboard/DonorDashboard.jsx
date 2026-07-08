
import React, { useState } from "react";
import DonorSidebar from "./DonorSidebar";
import ViewNeeds from "./ViewNeeds";
import ManualDonation from "./ManualDonation";
import MyDonations from "./MyDonations";
import ForgotPassword from "../ForgotPassword";
import NotificationBell from "../../components/NotificationBell";
import ProfileMenu from "../../components/Profile/ProfileMenu";
import ThemeToggle from "../../components/ThemeToggle";

function DonorDashboard({ user }) {
  const [activePage, setActivePage] = useState("needs");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    if (activePage === "needs") return <ViewNeeds user={user} />;
    if (activePage === "manual") return <ManualDonation user={user} />;
    if (activePage === "mydonations") return <MyDonations user={user} />;
    if (activePage === "forgotpassword") return <ForgotPassword />;
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* TOP BAR - Glass morphism effect */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: "70px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        {/* Left Section - Menu Button & Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Menu Button - Modern style */}
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              visibility: sidebarOpen ? "hidden" : "visible",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: "12px",
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 2px 8px rgba(102, 126, 234, 0.25)",
              color: "white",
              fontSize: "20px",
              fontWeight: "500"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(102, 126, 234, 0.25)";
            }}
          >
            ☰
          </button>

          {/* Brand Logo/Text */}
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              fontSize: "20px",
              fontWeight: "700",
              letterSpacing: "-0.5px"
            }}
          >
            Donor Portal
          </div>
        </div>

        {/* Right Section - Notifications & Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* <div><ThemeToggle /></div> */}
          <div
            style={{
              transition: "transform 0.2s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <NotificationBell user={user} />
          </div>
          <div
            style={{
              transition: "transform 0.2s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <ProfileMenu
              user={user}
              onUpdate={(updated) =>
                localStorage.setItem("user", JSON.stringify(updated))
              }
            />
          </div>
        </div>
      </div>

      {/* SIDEBAR - With smooth animation */}
      {sidebarOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 1050,
            animation: "slideIn 0.1s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
          <DonorSidebar
            setActivePage={setActivePage}
            onClose={() => setSidebarOpen(false)}
          />
          {/* Overlay */}
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              //backdropFilter: "blur(1px)",
              zIndex: -1,
              animation: "fadeIn 0.1s ease"
            }}
          />
        </div>
      )}

      {/* MAIN CONTENT */}
      <div
        style={{
          marginTop: "70px",
          padding: "28px 32px",
          maxWidth: "1400px",
          marginLeft: "auto",
          marginRight: "auto",
          animation: "fadeInUp 0.4s ease",
          background: 'linear-gradient(135deg, #e0f2fe 0%, #f1f5f9 100%)',
          minHeight: '100vh' ,
  
        }}
      >
        {renderPage()}
      </div>

      {/* Global Animations */}
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(-100%);
            }
            to {
              transform: translateX(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          /* Smooth scrolling */
          html {
            scroll-behavior: smooth;
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%);
          }
          
          /* Selection style */
          ::selection {
            background: rgba(102, 126, 234, 0.2);
            color: #4a5568;
          }
        `}
      </style>
    </div>
  );
}

export default DonorDashboard;