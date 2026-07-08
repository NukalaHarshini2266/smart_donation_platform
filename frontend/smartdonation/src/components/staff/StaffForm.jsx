
// import React, { useState } from "react";
// import { Card, Form, Button, Alert } from "react-bootstrap";
// import axios from "axios";

// function StaffForm({ organizationId, onStaffAdded }) {
//   const [staffForm, setStaffForm] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     password: ""
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const createStaff = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const payload = {
//       staff: {
//         ...staffForm,
//         role: "ORG_STAFF",
//         status: "ACTIVE"
//       },
//       organizationId
//     };

//     try {
//       const res = await axios.post(
//         "http://localhost:8080/api/user/staff",
//         payload
//       );

//       setMessage("Staff added successfully");

//       // ✅ Use the actual API response for the new staff
//       if (onStaffAdded) onStaffAdded(res.data);

//       setStaffForm({
//         name: "",
//         email: "",
//         mobile: "",
//         password: ""
//       });

//     } catch (err) {
//       console.error(err);
//       setMessage("Failed to add staff");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card className="mt-4 p-3">
//       <h5>Add Staff</h5>

//       {message && <Alert variant="info">{message}</Alert>}

//       <Form onSubmit={createStaff}>
//         <Form.Control
//           className="mb-2"
//           placeholder="Name"
//           value={staffForm.name}
//           onChange={(e) =>
//             setStaffForm({ ...staffForm, name: e.target.value })
//           }
//           required
//         />
//         <Form.Control
//           className="mb-2"
//           type="email"
//           placeholder="Email"
//           value={staffForm.email}
//           onChange={(e) =>
//             setStaffForm({ ...staffForm, email: e.target.value })
//           }
//           required
//         />
//         <Form.Control
//           className="mb-2"
//           placeholder="Mobile"
//           value={staffForm.mobile}
//           onChange={(e) =>
//             setStaffForm({ ...staffForm, mobile: e.target.value })
//           }
//           required
//         />
//         <Form.Control
//           className="mb-2"
//           type="password"
//           placeholder="Password"
//           value={staffForm.password}
//           onChange={(e) =>
//             setStaffForm({ ...staffForm, password: e.target.value })
//           }
//           required
//         />
//         <Button type="submit" disabled={loading}>
//           {loading ? "Adding..." : "Add Staff"}
//         </Button>
//       </Form>
//     </Card>
//   );
// }

// export default StaffForm;

import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { FaUserPlus, FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import axios from "axios";

function StaffForm({ organizationId, onStaffAdded }) {
  const [staffForm, setStaffForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const createStaff = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const payload = {
      staff: {
        ...staffForm,
        role: "ORG_STAFF",
        status: "ACTIVE"
      },
      organizationId
    };

    try {
      const res = await axios.post(
        "http://localhost:8080/api/user/staff",
        payload
      );

      setMessage("Staff added successfully");

      if (onStaffAdded) onStaffAdded(res.data);

      setStaffForm({
        name: "",
        email: "",
        mobile: "",
        password: ""
      });

      // Auto clear success message after 3 seconds
      setTimeout(() => setMessage(""), 3000);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add staff");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        padding: '15px 20px',
        color: 'white'
      }}>
        <h5 className="mb-0" style={{ fontWeight: '600' }}>
          <FaUserPlus className="me-2" /> Add Staff Member
        </h5>
      </div>
      
      <Card.Body style={{ padding: '25px' }}>
        {message && (
          <Alert variant="success" className="mb-3" style={{ borderRadius: '10px' }}>
            {message}
          </Alert>
        )}
        
        {error && (
          <Alert variant="danger" className="mb-3" style={{ borderRadius: '10px' }}>
            {error}
          </Alert>
        )}

        <Form onSubmit={createStaff}>
          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#667eea', zIndex: 2 }}>
              <FaUser />
            </div>
            <Form.Control
              style={{ paddingLeft: '40px', borderRadius: '10px', border: '1px solid #e2e8f0', height: '48px' }}
              placeholder="Full Name"
              value={staffForm.name}
              onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
              required
            />
          </div>

          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#667eea', zIndex: 2 }}>
              <FaEnvelope />
            </div>
            <Form.Control
              style={{ paddingLeft: '40px', borderRadius: '10px', border: '1px solid #e2e8f0', height: '48px' }}
              type="email"
              placeholder="Email Address"
              value={staffForm.email}
              onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
              required
            />
          </div>

          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#667eea', zIndex: 2 }}>
              <FaPhone />
            </div>
            <Form.Control
              style={{ paddingLeft: '40px', borderRadius: '10px', border: '1px solid #e2e8f0', height: '48px' }}
              placeholder="Mobile Number"
              value={staffForm.mobile}
              onChange={(e) => setStaffForm({ ...staffForm, mobile: e.target.value })}
              required
            />
          </div>

          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#667eea', zIndex: 2 }}>
              <FaLock />
            </div>
            <Form.Control
              style={{ paddingLeft: '40px', borderRadius: '10px', border: '1px solid #e2e8f0', height: '48px' }}
              type="password"
              placeholder="Password"
              value={staffForm.password}
              onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 30px',
              fontWeight: '600',
              width: '100%',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Adding Staff...
              </>
            ) : (
              <>
                <FaUserPlus className="me-2" /> Add Staff
              </>
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default StaffForm;