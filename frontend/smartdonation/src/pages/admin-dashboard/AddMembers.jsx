import React, { useState } from "react";
import api from "../../api/api";
import { Form, Button, Alert, Card } from "react-bootstrap";

export default function AddMembers() {
  const [type, setType] = useState("USER");
  const [message, setMessage] = useState("");

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    role: "DONOR"
  });

  const [orgData, setOrgData] = useState({
    name: "",
    type: "",
    address: "",
    userName: "",
    userEmail: "",
    userPassword: "",
    userMobile: ""
  });

  // Handle User Create
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/user/admin/create-user", userData);
      setMessage("User created successfully");
    } catch (err) {
      setMessage(err.response?.data || "Error creating user");
    }
  };

  // Handle Org Create
  const handleOrgSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/organization/admin/create", orgData);
      setMessage("Organization created successfully");
    } catch (err) {
      setMessage(err.response?.data || "Error creating organization");
    }
  };

  return (
    <div className="d-flex flex-column align-items-center" style={{ minHeight: '80vh' }}>
      <h4 className="mb-4 fs-1" style={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        fontWeight: "600"
      }}>Add Members</h4>

      {message && (
        <Alert variant="success" className="border-0 shadow-sm" style={{ 
          background: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
          color: "#2d3748",
          borderRadius: "12px"
        }}>
          {message}
        </Alert>
      )}

      <div className="mb-4" style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={() => setType("USER")}
          style={{
            padding: "10px 24px",
            borderRadius: "40px",
            border: "none",
            fontWeight: "600",
            fontSize: "0.95rem",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            background: type === "USER" 
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              : "rgba(102, 126, 234, 0.1)",
            color: type === "USER" ? "white" : "#667eea",
            boxShadow: type === "USER" 
              ? "0 4px 12px rgba(102, 126, 234, 0.35)"
              : "none"
          }}
          onMouseEnter={(e) => {
            if (type !== "USER") {
              e.currentTarget.style.background = "rgba(102, 126, 234, 0.2)";
            }
          }}
          onMouseLeave={(e) => {
            if (type !== "USER") {
              e.currentTarget.style.background = "rgba(102, 126, 234, 0.1)";
            }
          }}
        >
          Add Admin / Donor
        </button>
        <button
          onClick={() => setType("ORG")}
          style={{
            padding: "10px 24px",
            borderRadius: "40px",
            border: "none",
            fontWeight: "600",
            fontSize: "0.95rem",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            background: type === "ORG" 
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              : "rgba(102, 126, 234, 0.1)",
            color: type === "ORG" ? "white" : "#667eea",
            boxShadow: type === "ORG" 
              ? "0 4px 12px rgba(102, 126, 234, 0.35)"
              : "none"
          }}
          onMouseEnter={(e) => {
            if (type !== "ORG") {
              e.currentTarget.style.background = "rgba(102, 126, 234, 0.2)";
            }
          }}
          onMouseLeave={(e) => {
            if (type !== "ORG") {
              e.currentTarget.style.background = "rgba(102, 126, 234, 0.1)";
            }
          }}
        >
          Add Organization
        </button>
      </div>

      {/* USER FORM */}
      {type === "USER" && (
        <Card className="p-4 border-0 col-11 shadow-lg" style={{ 
          borderRadius: "20px",
          background: "white",
          transition: "transform 0.3s ease, box-shadow 0.3s ease"
        }}>
          <Form onSubmit={handleUserSubmit}>
            <Form.Group className="mb-3">
              <Form.Control 
                placeholder="Name"
                style={{
                  borderRadius: "12px",
                  padding: "12px 16px",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.2s ease"
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                onChange={(e)=>setUserData({...userData, name:e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control 
                placeholder="Email"
                style={{
                  borderRadius: "12px",
                  padding: "12px 16px",
                  border: "1px solid #e2e8f0"
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                onChange={(e)=>setUserData({...userData, email:e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control 
                type="password" 
                placeholder="Password"
                style={{
                  borderRadius: "12px",
                  padding: "12px 16px",
                  border: "1px solid #e2e8f0"
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                onChange={(e)=>setUserData({...userData, password:e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control 
                placeholder="Mobile"
                style={{
                  borderRadius: "12px",
                  padding: "12px 16px",
                  border: "1px solid #e2e8f0"
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                onChange={(e)=>setUserData({...userData, mobile:e.target.value})}
              />
            </Form.Group>

            <Form.Select 
              className="mb-4"
              style={{
                borderRadius: "12px",
                padding: "12px 16px",
                border: "1px solid #e2e8f0",
                backgroundColor: "white"
              }}
              onChange={(e)=>setUserData({...userData, role:e.target.value})}
            >
              <option value="DONOR">Donor</option>
              <option value="ADMIN">Admin</option>
            </Form.Select>

            <Button 
              type="submit"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                borderRadius: "12px",
                padding: "12px 28px",
                fontWeight: "600",
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Create User
            </Button>
          </Form>
        </Card>
      )}

      {/* ORGANIZATION FORM */}
      {type === "ORG" && (
        <Card className="p-4 border-0 col-11 shadow-lg" style={{ 
          borderRadius: "20px",
          background: "white"
        }}>
          <Form onSubmit={handleOrgSubmit}>
            <h5 style={{ 
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              marginBottom: "16px",
              fontWeight: "600"
            }}>Organization Details</h5>

            <Form.Control 
              className="mb-3" 
              placeholder="Organization Name"
              style={{
                borderRadius: "12px",
                padding: "12px 16px",
                border: "1px solid #e2e8f0"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
              onChange={(e)=>setOrgData({...orgData, name:e.target.value})}
            />

            <Form.Control 
              className="mb-3" 
              placeholder="Type (NGO/Trust)"
              style={{
                borderRadius: "12px",
                padding: "12px 16px",
                border: "1px solid #e2e8f0"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
              onChange={(e)=>setOrgData({...orgData, type:e.target.value})}
            />

            <Form.Control 
              className="mb-4" 
              placeholder="Address"
              style={{
                borderRadius: "12px",
                padding: "12px 16px",
                border: "1px solid #e2e8f0"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
              onChange={(e)=>setOrgData({...orgData, address:e.target.value})}
            />

            <h5 style={{ 
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              marginBottom: "16px",
              marginTop: "8px",
              fontWeight: "600"
            }}>Org Head Details</h5>

            <Form.Control 
              className="mb-3" 
              placeholder="Name"
              style={{
                borderRadius: "12px",
                padding: "12px 16px",
                border: "1px solid #e2e8f0"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
              onChange={(e)=>setOrgData({...orgData, userName:e.target.value})}
            />

            <Form.Control 
              className="mb-3" 
              placeholder="Email"
              style={{
                borderRadius: "12px",
                padding: "12px 16px",
                border: "1px solid #e2e8f0"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
              onChange={(e)=>setOrgData({...orgData, userEmail:e.target.value})}
            />

            <Form.Control 
              type="password" 
              className="mb-3" 
              placeholder="Password"
              style={{
                borderRadius: "12px",
                padding: "12px 16px",
                border: "1px solid #e2e8f0"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
              onChange={(e)=>setOrgData({...orgData, userPassword:e.target.value})}
            />

            <Form.Control 
              className="mb-4" 
              placeholder="Mobile"
              style={{
                borderRadius: "12px",
                padding: "12px 16px",
                border: "1px solid #e2e8f0"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
              onChange={(e)=>setOrgData({...orgData, userMobile:e.target.value})}
            />

            <Button 
              type="submit"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                borderRadius: "12px",
                padding: "12px 28px",
                fontWeight: "600",
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Create Organization
            </Button>
          </Form>
        </Card>
      )}
    </div>
  );
}