import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import api from "./../../api/api"
import { useNavigate } from "react-router-dom";
import ApprovalSection from "./ApprovalSection";

export default function OrganizationRequests({ user }) {

  const [orgs, setOrgs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = () => {
    api
      .get("/organization/pending")
      .then(res => setOrgs(res.data))
      .catch(err => console.error(err));
  };

  return (
    <div className="container mt-4" style={{ marginLeft: "250px", maxWidth: "1200px" }}>
      <h3 style={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        fontWeight: "700",
        marginBottom: "24px"
      }}>Pending Organization Requests</h3>

      <div className="d-flex flex-wrap gap-4 mt-4">
        {orgs.map(org => (
          <Card
            key={org.id}
            style={{ 
              width: "320px", 
              borderRadius: "20px",
              border: "none",
              transition: "transform 0.3s ease, box-shadow 0.3s ease"
            }}
            className="p-3 shadow-lg"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
          >
            <h5 style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              fontWeight: "600",
              marginBottom: "12px"
            }}>{org.name}</h5>
            <p style={{ color: "#4a5568", marginBottom: "8px" }}>
              <b style={{ color: "#667eea" }}>Type:</b> {org.type}
            </p>
            <p style={{ color: "#4a5568", marginBottom: "16px" }}>
              <b style={{ color: "#667eea" }}>Address:</b> {org.address}
            </p>

            {/* Approval Section */}
            <ApprovalSection
              org={org}
              onStatusChange={() => fetchPending()}
            />

            {/* More Info button at bottom */}
            <div className="mt-3 text-center">
              <Button
                variant="info"
                size="sm"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: "40px",
                  padding: "8px 24px",
                  fontWeight: "500",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onClick={() =>
                  navigate(`/admin/organizations/${org.id}`, { state: org })
                }
              >
                More Info
              </Button>
            </div>

          </Card>
        ))}
      </div>
    </div>
  );
}