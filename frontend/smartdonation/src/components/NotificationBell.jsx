// import React, { useEffect, useState } from "react";
// import api from "../api/api";

// function NotificationBell({ user }) {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     if (!user?.id) return;

//     fetchNotifications();
//   }, [user]);

//   const fetchNotifications = async () => {
//     try {
//       const res = await api.get(`/notifications/${user.id}`);
//       setNotifications(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const markAsRead = async (id) => {
//     try {
//       await api.delete(`/notifications/${id}`);
//       setNotifications((prev) => prev.filter(n => n.id !== id));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div>
        
//         {/* Bell Button */}
//         <div className="dropdown">
//         <button 
//             className="btn btn-light position-relative dropdown-toggle"
//             data-bs-toggle="dropdown"
//         >
//             🔔

//             {notifications.length > 0 && (
//             <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
//                 {notifications.length}
//             </span>
//             )}
//         </button>

//         {/* Dropdown */}
//         <ul className="dropdown-menu dropdown-menu-end shadow" style={{ width: "320px" }}>
//             {notifications.length === 0 ? (
//             <li className="p-2 text-center">No notifications</li>
//             ) : (
//             notifications.map(n => (
//                 <li key={n.id} className="border-bottom p-2">
//                 <small>{n.message}</small>
//                 <br />
//                 <button 
//                     className="btn btn-sm btn-primary mt-1"
//                     onClick={() => markAsRead(n.id)}
//                 >
//                     Mark as read
//                 </button>
//                 </li>
//             ))
//             )}
//         </ul>
//         </div>

//     </div>
//     );
// }

// export default NotificationBell;


import React, { useEffect, useState } from "react";
import api from "../api/api";
import { FaBell, FaCheckCircle } from "react-icons/fa";

function NotificationBell({ user }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get(`/notifications/${user.id}`);
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* Bell Button */}
      <div className="dropdown">
        <button 
          className="btn position-relative dropdown-toggle"
          data-bs-toggle="dropdown"
          style={{
            background: "transparent",
            border: "none",
            fontSize: "20px",
            padding: "8px",
            borderRadius: "10px",
            transition: "all 0.2s",
            color: "#4a5568"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f1f5f9";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <FaBell size={20} />

          {notifications.length > 0 && (
            <span 
              className="position-absolute top-0 start-100 translate-middle"
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                fontSize: "10px",
                fontWeight: "bold",
                padding: "2px 6px",
                borderRadius: "20px",
                border: "2px solid white"
              }}
            >
              {notifications.length}
            </span>
          )}
        </button>

        {/* Dropdown */}
        <ul 
          className="dropdown-menu dropdown-menu-end shadow"
          style={{ 
            width: "350px",
            maxHeight: "400px",
            overflowY: "auto",
            borderRadius: "12px",
            padding: "0",
            border: "none",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
          }}
        >
          {/* Header */}
          <li style={{ 
            padding: "12px 15px",
            borderBottom: "1px solid #e2e8f0",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: "12px 12px 0 0"
          }}>
            <b>🔔 Notifications</b>
            <span className="ms-2 badge" style={{ background: "rgba(255,255,255,0.2)" }}>
              {notifications.length} new
            </span>
          </li>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <li className="text-center py-5" style={{ color: "#64748b" }}>
              <FaBell size={30} style={{ opacity: 0.3, marginBottom: "10px" }} />
              <p className="mb-0">No notifications</p>
            </li>
          ) : (
            notifications.map(n => (
              <li key={n.id} style={{ 
                borderBottom: "1px solid #e2e8f0",
                padding: "12px 15px",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#f8f9fc"}
              onMouseLeave={(e) => e.currentTarget.style.background = "white"}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div style={{ flex: 1 }}>
                    <small style={{ color: "#1e293b", fontSize: "13.5px" }}>{n.message}</small>
                  </div>
                  <button 
                    className="btn btn-sm ms-2"
                    onClick={() => markAsRead(n.id)}
                    style={{
                      background: "#e8f0fe",
                      color: "#667eea",
                      border: "none",
                      borderRadius: "8px",
                      padding: "4px 10px",
                      fontSize: "11px",
                      fontWeight: "500",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#667eea";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#e8f0fe";
                      e.currentTarget.style.color = "#667eea";
                    }}
                  >
                    <FaCheckCircle className="me-1" size={11} /> Mark read
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default NotificationBell;