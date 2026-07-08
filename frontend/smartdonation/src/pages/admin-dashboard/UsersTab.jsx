import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Table, Spinner, Alert, Form, InputGroup } from "react-bootstrap";

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = [...users];
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (roleFilter !== "ALL") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/user/all");
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) return (
    <div className="text-center py-5">
      <Spinner animation="border" style={{ color: '#667eea' }} />
    </div>
  );

  if (error) return <Alert variant="danger" className="border-0 shadow-sm" style={{ borderRadius: "12px" }}>{error}</Alert>;

  return (
    <div>
      <h4 className="mb-4 fs-1" style={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        fontWeight: "600"
      }}>All Users</h4>

      <div className="d-flex gap-3 mb-4">
        <InputGroup style={{ flex: 1 }}>
          <Form.Control
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              padding: "10px 16px"
            }}
          />
        </InputGroup>

        <Form.Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            width: "200px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            padding: "10px 16px",
            backgroundColor: "white"
          }}
        >
          <option value="ALL">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="ORGANIZATION">Organization</option>
          <option value="STAFF">Staff</option>
          <option value="DONOR">Donor</option>
        </Form.Select>
      </div>

      <div style={{ overflowX: "auto" }}>
        <Table striped bordered hover responsive style={{ borderRadius: "12px", overflow: "hidden" }}>
          <thead style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Mobile</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td style={{ fontWeight: "500" }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span style={{
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: "500",
                      background: u.role === "ADMIN" ? "#fef3c7" : 
                                 u.role === "ORGANIZATION" ? "#dbeafe" :
                                 u.role === "STAFF" ? "#e0e7ff" : "#dcfce7",
                      color: u.role === "ADMIN" ? "#92400e" : 
                             u.role === "ORGANIZATION" ? "#1e40af" :
                             u.role === "STAFF" ? "#3730a3" : "#166534"
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.mobile}</td>
                  <td>{formatDate(u.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}