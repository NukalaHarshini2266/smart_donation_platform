// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import api from "../../api/api";

// export default function ProfilePage() {

//   const { id } = useParams();

//   const [user, setUser] = useState(null);
//   const [org, setOrg] = useState(null);
//   const [edit, setEdit] = useState(false);

//   const [form, setForm] = useState({
//     name: "",
//     mobile: "",
//     orgName: "",
//     address: "",
//     userName: "",
//     userMobile: "",
//     documents: []
//   });

//   const [newDocs, setNewDocs] = useState([]);

//   // ================= FETCH =================
//   useEffect(() => {

//     const loggedUser = JSON.parse(localStorage.getItem("user"));
//     setUser(loggedUser);

//     if (loggedUser.role === "ORGANIZATION") {

//       api.get(`/organization/by-user/${id}`).then(res => {

//         setOrg(res.data);

//         setForm({
//           orgName: res.data.name,
//           address: res.data.address,
//           userName: res.data.head?.name,
//           userMobile: res.data.head?.mobile,
//           documents: res.data.documents || []
//         });

//       });

//     } else {

//       api.get(`/user/${id}`).then(res => {
//         setUser(res.data);
//         setForm({
//           name: res.data.name,
//           mobile: res.data.mobile
//         });
//       });

//     }

//   }, [id]);

//   // ================= HANDLE FILE ADD =================
//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);

//     const docs = files.map(file => ({
//       file,
//       description: ""
//     }));

//     setNewDocs(prev => [...prev, ...docs]);
//   };

//   // ================= REMOVE FILE =================
//   const removeFile = (index) => {
//     const updated = newDocs.filter((_, i) => i !== index);
//     setNewDocs(updated);
//   };

//   // ================= UPDATE =================
//   const handleUpdate = async () => {

//     if (user.role === "ORGANIZATION") {

//       const formData = new FormData();

//       formData.append("data", new Blob([JSON.stringify({
//         name: form.orgName,
//         address: form.address,
//         userName: form.userName,
//         userMobile: form.userMobile,
//         documents: form.documents,
//         newDescriptions: newDocs.map(d => d.description)
//       })], { type: "application/json" }));

//       // files
//       newDocs.forEach(doc => {
//         formData.append("files", doc.file);
//       });

      

//       try {
//         await api.put(`/organization/${org.id}`, formData, {
//           headers: { "Content-Type": "multipart/form-data" }
//         });

//         alert("Organization updated");
//         setEdit(false);
//         setNewDocs([]);

//       } catch (err) {
//         alert("Update failed");
//       }

//     } else {

//       await api.put(`/user/profile/${id}`, {
//         name: form.name,
//         mobile: form.mobile
//       });

//       alert("User updated");
//       setEdit(false);
//     }
//   };

//   if (!user) return <p>Loading...</p>;

//   // ================= UI =================
//   return (
//     <div className="container mt-4">

//       <h3>Profile</h3>

//       {/* COMMON */}
//       <div className="card p-3 mb-3">
//         <p><b>Email:</b> {user.email}</p>
//         <p><b>Role:</b> {user.role}</p>
//       </div>

//       {/* ================= USER ================= */}
//       {user.role !== "ORGANIZATION" && (
//         <div className="card p-3">

//           <p><b>Name:</b></p>
//           {edit ? (
//             <input
//               className="form-control mb-2"
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//             />
//           ) : <p>{form.name}</p>}

//           <p><b>Mobile:</b></p>
//           {edit ? (
//             <input
//               className="form-control"
//               value={form.mobile}
//               onChange={(e) => setForm({ ...form, mobile: e.target.value })}
//             />
//           ) : <p>{form.mobile}</p>}

//         </div>
//       )}

//       {/* ================= ORGANIZATION ================= */}
//       {user.role === "ORGANIZATION" && org && (
//         <div className="card p-3">

//           {/* ORG DETAILS */}
//           <h5>Organization Details</h5>

//           <p><b>Name:</b></p>
//           {edit ? (
//             <input
//               className="form-control mb-2"
//               value={form.orgName}
//               onChange={(e) => setForm({ ...form, orgName: e.target.value })}
//             />
//           ) : <p>{org.name}</p>}

//           <p><b>Type:</b> {org.type}</p>

//           <p><b>Address:</b></p>
//           {edit ? (
//             <input
//               className="form-control mb-2"
//               value={form.address}
//               onChange={(e) => setForm({ ...form, address: e.target.value })}
//             />
//           ) : <p>{org.address}</p>}

//           <p><b>Status:</b> {org.status}</p>

//           {/* HEAD */}
//           <h5 className="mt-3">Organization Head</h5>

//           <p><b>Name:</b></p>
//           {edit ? (
//             <input
//               className="form-control mb-2"
//               value={form.userName}
//               onChange={(e) => setForm({ ...form, userName: e.target.value })}
//             />
//           ) : <p>{org.head?.name}</p>}

//           <p><b>Email:</b> {org.head?.email}</p>

//           <p><b>Mobile:</b></p>
//           {edit ? (
//             <input
//               className="form-control mb-2"
//               value={form.userMobile}
//               onChange={(e) => setForm({ ...form, userMobile: e.target.value })}
//             />
//           ) : <p>{org.head?.mobile}</p>}

//           {/* DOCUMENTS */}
//           <h5 className="mt-3">Documents</h5>

//           <table className="table">
//             <thead>
//               <tr>
//                 <th>File</th>
//                 <th>Description</th>
//                 <th>Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {form.documents.map((doc) => (
//                 <tr key={doc.id}>
//                   <td>{doc.fileName}</td>
//                   <td>{doc.description}</td>
//                   <td>
//                     <button
//                       className="btn btn-sm btn-outline-secondary"
//                       onClick={() =>
//                         window.open(`http://localhost:8080${doc.filePath}`)
//                       }
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* ADD NEW FILES */}
//           {edit && (
//             <>
//               <h6>Add New Documents</h6>

//               <input
//                 type="file"
//                 multiple
//                 className="form-control mb-3"
//                 onChange={handleFileChange}
//               />

//               {newDocs.length === 0 && (
//                 <p className="text-muted">No files selected</p>
//               )}

//               {newDocs.map((doc, index) => (
//                 <div
//                   key={index}
//                   className="d-flex align-items-center justify-content-between border rounded p-2 mb-2"
//                 >
//                   <div style={{ flex: 2 }}>
//                     <p className="mb-1 fw-bold">{doc.file.name}</p>

//                     <input
//                       className="form-control"
//                       placeholder="Enter description"
//                       value={doc.description}
//                       onChange={(e) => {
//                         const updated = [...newDocs];
//                         updated[index].description = e.target.value;
//                         setNewDocs(updated);
//                       }}
//                     />
//                   </div>

//                   <div className="d-flex gap-2 ms-3">

//                     <button
//                       className="btn btn-sm btn-outline-primary"
//                       onClick={() => {
//                         const url = URL.createObjectURL(doc.file);
//                         window.open(url);
//                       }}
//                     >
//                       View
//                     </button>

//                     <button
//                       className="btn btn-sm btn-outline-danger"
//                       onClick={() => removeFile(index)}
//                     >
//                       Delete
//                     </button>

//                   </div>
//                 </div>
//               ))}
//             </>
//           )}

//         </div>
//       )}

//       {/* BUTTONS */}
//       <div className="mt-3">
//         {!edit ? (
//           <button className="btn btn-primary" onClick={() => setEdit(true)}>
//             Edit
//           </button>
//         ) : (
//           <>
//             <button className="btn btn-success me-2" onClick={handleUpdate}>
//               Save
//             </button>
//             <button className="btn btn-secondary" onClick={() => setEdit(false)}>
//               Cancel
//             </button>
//           </>
//         )}
//       </div>

//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import { FaUser, FaEnvelope, FaUserTag, FaBuilding, FaMapMarkerAlt, FaPhone, FaFileAlt, FaEdit, FaSave, FaTimes, FaEye, FaTrash, FaUpload } from "react-icons/fa";

export default function ProfilePage() {

  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [org, setOrg] = useState(null);
  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    orgName: "",
    address: "",
    userName: "",
    userMobile: "",
    documents: []
  });

  const [newDocs, setNewDocs] = useState([]);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedUser);

    if (loggedUser.role === "ORGANIZATION") {
      api.get(`/organization/by-user/${id}`).then(res => {
        setOrg(res.data);
        setForm({
          orgName: res.data.name,
          address: res.data.address,
          userName: res.data.head?.name,
          userMobile: res.data.head?.mobile,
          documents: res.data.documents || []
        });
      });
    } else {
      api.get(`/user/${id}`).then(res => {
        setUser(res.data);
        setForm({
          name: res.data.name,
          mobile: res.data.mobile
        });
      });
    }
  }, [id]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const docs = files.map(file => ({
      file,
      description: ""
    }));
    setNewDocs(prev => [...prev, ...docs]);
  };

  const removeFile = (index) => {
    const updated = newDocs.filter((_, i) => i !== index);
    setNewDocs(updated);
  };

  const handleUpdate = async () => {
    if (user.role === "ORGANIZATION") {
      const formData = new FormData();
      formData.append("data", new Blob([JSON.stringify({
        name: form.orgName,
        address: form.address,
        userName: form.userName,
        userMobile: form.userMobile,
        documents: form.documents,
        newDescriptions: newDocs.map(d => d.description)
      })], { type: "application/json" }));

      newDocs.forEach(doc => {
        formData.append("files", doc.file);
      });

      try {
        await api.put(`/organization/${org.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Organization updated");
        setEdit(false);
        setNewDocs([]);
      } catch (err) {
        alert("Update failed");
      }
    } else {
      await api.put(`/user/profile/${id}`, {
        name: form.name,
        mobile: form.mobile
      });
      alert("User updated");
      setEdit(false);
    }
  };

  if (!user) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="spinner-border text-primary"></div>
    </div>
  );

  return (
    <div style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f1f5f9 100%)', minHeight: '100vh', padding: '30px' }}>
      <div className="container">
        <div className="d-flex align-items-center mb-4">
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '15px'
          }}>
            <FaUser size={24} color="white" />
          </div>
          <h3 style={{ fontWeight: '700', color: '#1e293b', margin: 0 }}>My Profile</h3>
        </div>

        {/* COMMON INFO */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-md-6">
                <p className="mb-2"><FaEnvelope className="me-2" style={{ color: '#667eea' }} /> <b>Email:</b> {user.role === "ORGANIZATION" ? org?.head?.email : user.email}</p>
              </div>
              <div className="col-md-6">
                <p className="mb-0"><FaUserTag className="me-2" style={{ color: '#667eea' }} /> <b>Role:</b> 
                  <span className="ms-2 badge" style={{ backgroundColor: '#667eea' }}>{user.role}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* USER PROFILE */}
        {user.role !== "ORGANIZATION" && (
          <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <div className="card-body p-4">
              <h5 className="mb-3" style={{ fontWeight: '600', color: '#1e293b' }}>Personal Information</h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Full Name</label>
                  {edit ? (
                    <input
                      className="form-control"
                      style={{ borderRadius: '10px' }}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  ) : (
                    <p className="mb-0">{form.name}</p>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Mobile Number</label>
                  {edit ? (
                    <input
                      className="form-control"
                      style={{ borderRadius: '10px' }}
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    />
                  ) : (
                    <p className="mb-0">{form.mobile}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORGANIZATION PROFILE */}
        {user.role === "ORGANIZATION" && org && (
          <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <div className="card-body p-4">
              <h5 className="mb-3" style={{ fontWeight: '600', color: '#1e293b' }}>
                <FaBuilding className="me-2" style={{ color: '#667eea' }} /> Organization Details
              </h5>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Organization Name</label>
                  {edit ? (
                    <input
                      className="form-control"
                      style={{ borderRadius: '10px' }}
                      value={form.orgName}
                      onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                    />
                  ) : (
                    <p className="mb-0">{org.name}</p>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Organization Type</label>
                  <p className="mb-0">{org.type}</p>
                </div>
                <div className="col-md-12 mb-3">
                  <label className="form-label fw-bold"><FaMapMarkerAlt className="me-1" /> Address</label>
                  {edit ? (
                    <input
                      className="form-control"
                      style={{ borderRadius: '10px' }}
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />
                  ) : (
                    <p className="mb-0">{org.address}</p>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Status</label>
                  <p className="mb-0"><span className="badge bg-success">{org.status}</span></p>
                </div>
              </div>

              <h5 className="mt-4 mb-3" style={{ fontWeight: '600', color: '#1e293b' }}>Organization Head</h5>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Name</label>
                  {edit ? (
                    <input
                      className="form-control"
                      style={{ borderRadius: '10px' }}
                      value={form.userName}
                      onChange={(e) => setForm({ ...form, userName: e.target.value })}
                    />
                  ) : (
                    <p className="mb-0">{org.head?.name}</p>
                  )}
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Email</label>
                  <p className="mb-0">{org.head?.email}</p>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold"><FaPhone className="me-1" /> Mobile</label>
                  {edit ? (
                    <input
                      className="form-control"
                      style={{ borderRadius: '10px' }}
                      value={form.userMobile}
                      onChange={(e) => setForm({ ...form, userMobile: e.target.value })}
                    />
                  ) : (
                    <p className="mb-0">{org.head?.mobile}</p>
                  )}
                </div>
              </div>

              {/* DOCUMENTS */}
              <h5 className="mt-4 mb-3" style={{ fontWeight: '600', color: '#1e293b' }}>
                <FaFileAlt className="me-2" style={{ color: '#667eea' }} /> Documents
              </h5>
              
              {form.documents.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead style={{ background: '#f8f9fc' }}>
                      <tr>
                        <th>File Name</th>
                        <th>Description</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.documents.map((doc) => (
                        <tr key={doc.id}>
                          <td>{doc.fileName}</td>
                          <td>{doc.description}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              style={{ borderRadius: '8px' }}
                              onClick={() => window.open(`http://localhost:8080${doc.filePath}`)}
                            >
                              <FaEye className="me-1" /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ADD NEW FILES */}
              {edit && (
                <div className="mt-4">
                  <h6 className="mb-2"><FaUpload className="me-2" style={{ color: '#667eea' }} /> Add New Documents</h6>
                  <input
                    type="file"
                    multiple
                    className="form-control mb-3"
                    style={{ borderRadius: '10px' }}
                    onChange={handleFileChange}
                  />

                  {newDocs.length === 0 && (
                    <p className="text-muted">No files selected</p>
                  )}

                  {newDocs.map((doc, index) => (
                    <div key={index} className="d-flex align-items-center justify-content-between border rounded p-3 mb-2" style={{ borderRadius: '10px' }}>
                      <div style={{ flex: 2 }}>
                        <p className="mb-1 fw-bold">{doc.file.name}</p>
                        <input
                          className="form-control"
                          style={{ borderRadius: '8px' }}
                          placeholder="Enter description"
                          value={doc.description}
                          onChange={(e) => {
                            const updated = [...newDocs];
                            updated[index].description = e.target.value;
                            setNewDocs(updated);
                          }}
                        />
                      </div>
                      <div className="d-flex gap-2 ms-3">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          style={{ borderRadius: '8px' }}
                          onClick={() => {
                            const url = URL.createObjectURL(doc.file);
                            window.open(url);
                          }}
                        >
                          <FaEye /> View
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          style={{ borderRadius: '8px' }}
                          onClick={() => removeFile(index)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* BUTTONS */}
        <div className="mt-4">
          {!edit ? (
            <button
              className="btn px-4 py-2"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontWeight: '600'
              }}
              onClick={() => setEdit(true)}
            >
              <FaEdit className="me-2" /> Edit Profile
            </button>
          ) : (
            <>
              <button
                className="btn btn-success me-2 px-4 py-2"
                style={{ borderRadius: '10px', fontWeight: '600' }}
                onClick={handleUpdate}
              >
                <FaSave className="me-2" /> Save Changes
              </button>
              <button
                className="btn btn-secondary px-4 py-2"
                style={{ borderRadius: '10px', fontWeight: '600' }}
                onClick={() => setEdit(false)}
              >
                <FaTimes className="me-2" /> Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}