// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function ProfileMenu({ user }) {
//   const [open, setOpen] = useState(false);
//   const navigate = useNavigate();

//   console.log(user);

//   return (
//     <div style={{ position: "relative" }}>

//       {/* Avatar */}
//       <div
//         onClick={() => setOpen(!open)}
//         style={{
//           width: 40,
//           height: 40,
//           borderRadius: "50%",
//           background: "#f1f3f5",   // light background
//           color: "#333",           // dark letter
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           cursor: "pointer",
//           fontWeight: "bold",
//           fontSize: "16px",
//           border: "1px solid #ddd"
//         }}
//       >
//         {user?.name?.[0]?.toUpperCase() || "U"}
//       </div>

//       {/* Dropdown */}
//       {open && (
//         <div
//           style={{
//             position: "absolute",
//             right: 0,
//             top: 50,
//             width: 220,
//             background: "white",
//             border: "1px solid #ddd",
//             borderRadius: 8,
//             padding: 10,
//             zIndex: 1000
//           }}
//         >
//           <p className="mb-1"><b>{user.name}</b></p>
//           <p className="mb-1 text-muted">{user.role}</p>

//           <button
//             className="btn btn-primary btn-sm w-100"
//             onClick={() => {
//               setOpen(false);
//               navigate(`/profile/${user.id}`);
//             }}
//           >
//             Edit Profile
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";

export default function ProfileMenu({ user }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={{ position: "relative" }}>

      {/* Avatar */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "18px",
          transition: "transform 0.2s, box-shadow 0.2s",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
        }}
      >
        {user?.name?.[0]?.toUpperCase() || <FaUser size={20} />}
      </div>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
          />
          
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 50,
              width: 260,
              background: "white",
              borderRadius: 12,
              padding: 0,
              zIndex: 1000,
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              overflow: "hidden"
            }}
          >
            {/* Header */}
            <div style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "15px 20px",
              color: "white"
            }}>
              <div style={{
                width: 45,
                height: 45,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
                fontSize: 20,
                fontWeight: "bold"
              }}>
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <p className="mb-0" style={{ fontWeight: "600", fontSize: "16px" }}>{user?.name}</p>
              <p className="mb-0" style={{ fontSize: "12px", opacity: 0.8 }}>{user?.role}</p>
            </div>

            {/* Menu Items */}
            <div style={{ padding: "10px" }}>
              <button
                className="btn w-100 text-start"
                style={{
                  borderRadius: 8,
                  padding: "10px 15px",
                  transition: "background 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  border: "none",
                  background: "white"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f8f9fa"}
                onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                onClick={() => {
                  setOpen(false);
                  navigate(`/profile/${user.id}`);
                }}
              >
                <FaUserCircle size={18} style={{ color: "#667eea" }} />
                <span>Edit Profile</span>
              </button>

              <hr style={{ margin: "8px 0" }} />

              <button
                className="btn w-100 text-start"
                style={{
                  borderRadius: 8,
                  padding: "10px 15px",
                  transition: "background 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  border: "none",
                  background: "white",
                  color: "#dc3545"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#fff5f5"}
                onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location.href = "/login";
                }}
              >
                <FaSignOutAlt size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}