// import React from "react";
// import { Card, Table, Button } from "react-bootstrap";
// import axios from "axios";

// function StaffTable({ staffList, organizationId, onDelete }) {
//   const handleDelete = async (staffId) => {
//     try {
//       await axios.delete(
//         `http://localhost:8080/api/user/${organizationId}/staff/${staffId}`
//       );

//       if (onDelete) onDelete(staffId);

//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete staff");
//     }
//   };

//   if (!staffList || staffList.length === 0)
//     return <p className="mt-3">No staff members found.</p>;

//   return (
//     <Card className="mt-4 p-3">
//       <h5>Staff Members</h5>

//       <Table bordered>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Mobile</th>
//             <th>Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {staffList.map((staff) => (
//             <tr key={staff.id}>
//               <td>{staff.name}</td>
//               <td>{staff.email}</td>
//               <td>{staff.mobile}</td>
//               <td>
//                 <Button
//                   size="sm"
//                   variant="danger"
//                   onClick={() => handleDelete(staff.id)}
//                 >
//                   Delete
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </Card>
//   );
// }

// export default StaffTable;

import React, { useState } from "react";
import { Card, Table, Button, Alert ,Badge} from "react-bootstrap";
import { FaTrash, FaUsers, FaEnvelope, FaPhone, FaUser } from "react-icons/fa";
import axios from "axios";

function StaffTable({ staffList, organizationId, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const handleDelete = async (staffId, staffName) => {
    if (window.confirm(`Are you sure you want to delete ${staffName}?`)) {
      setDeletingId(staffId);
      setError("");
      
      try {
        await axios.delete(
          `http://localhost:8080/api/user/${organizationId}/staff/${staffId}`
        );

        if (onDelete) onDelete(staffId);
        
        // Auto clear after 2 seconds
        setTimeout(() => setDeletingId(null), 500);

      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to delete staff");
        setTimeout(() => {
          setError("");
          setDeletingId(null);
        }, 3000);
      }
    }
  };

  if (!staffList || staffList.length === 0) {
    return (
      <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          padding: '15px 20px',
          color: 'white'
        }}>
          <h5 className="mb-0" style={{ fontWeight: '600' }}>
            <FaUsers className="me-2" /> Staff Members
          </h5>
        </div>
        <Card.Body style={{ padding: '40px', textAlign: 'center' }}>
          <FaUsers size={50} style={{ color: '#cbd5e1', marginBottom: '15px' }} />
          <p className="mb-0 text-muted">No staff members found.</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        padding: '15px 20px',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h5 className="mb-0" style={{ fontWeight: '600' }}>
          <FaUsers className="me-2" /> Staff Members
        </h5>
        <Badge bg="light" text="dark" style={{ borderRadius: '20px', padding: '5px 12px' }}>
          Total: {staffList.length}
        </Badge>
      </div>
      
      <Card.Body style={{ padding: '0' }}>
        {error && (
          <Alert variant="danger" className="m-3" style={{ borderRadius: '10px' }}>
            {error}
          </Alert>
        )}
        
        <div style={{ overflowX: 'auto' }}>
          <Table hover responsive className="mb-0" style={{ minWidth: '600px' }}>
            <thead style={{ backgroundColor: '#f8f9fc', borderBottom: '2px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '15px', fontWeight: '600', color: '#4a5568' }}>Name</th>
                <th style={{ padding: '15px', fontWeight: '600', color: '#4a5568' }}>Email</th>
                <th style={{ padding: '15px', fontWeight: '600', color: '#4a5568' }}>Mobile</th>
                <th style={{ padding: '15px', fontWeight: '600', color: '#4a5568', width: '100px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <tr key={staff.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }}>
                  <td style={{ padding: '12px 15px', verticalAlign: 'middle' }}>
                    <div className="d-flex align-items-center">
                      <div style={{
                        width: '35px',
                        height: '35px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '10px',
                        color: 'white'
                      }}>
                        <FaUser size={16} />
                      </div>
                      <strong>{staff.name}</strong>
                    </div>
                  </td>
                  <td style={{ padding: '12px 15px', verticalAlign: 'middle' }}>
                    <FaEnvelope className="me-2" style={{ color: '#667eea' }} />
                    {staff.email}
                  </td>
                  <td style={{ padding: '12px 15px', verticalAlign: 'middle' }}>
                    <FaPhone className="me-2" style={{ color: '#667eea' }} />
                    {staff.mobile}
                  </td>
                  <td style={{ padding: '12px 15px', verticalAlign: 'middle' }}>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(staff.id, staff.name)}
                      disabled={deletingId === staff.id}
                      style={{
                        borderRadius: '8px',
                        padding: '6px 15px',
                        transition: 'all 0.2s',
                        display: 'flex',   
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {deletingId === staff.id ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <FaTrash className="me-1" /> Delete
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
}

export default StaffTable;