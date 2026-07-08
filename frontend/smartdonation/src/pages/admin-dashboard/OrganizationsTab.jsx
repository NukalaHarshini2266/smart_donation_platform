import React, { useEffect, useState } from "react";
import { Table, Button, Badge, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function OrganizationsTab() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/organization/all")
      .then(res => {
        setOrganizations(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching organizations:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return(
    <div className="text-center mt-4">
      <Spinner animation="border" />
    </div>
  );

  return (
    <div>
      <h4 className="mb-3">Organizations</h4>

      <Table bordered hover responsive className="rounded-4 overflow-hidden">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Address</th>
            <th>Created at</th>
            <th>Approved At</th>
            <th>Status</th>
            <th>More Info</th>
          </tr>
        </thead>
        <tbody>
          {organizations?.map(org => (
            <tr key={org.id}>
              <td>{org.name}</td>
              <td>{org.type}</td>
              <td>{org.address}</td>
              <td>{org.createdAt ? new Date(org.createdAt).toLocaleString() : "-"}</td>
              <td>{org.approvedAt ? new Date(org.approvedAt).toLocaleString() : "-"}</td>
              <td>
                <Badge bg={
                  org.status === "ACTIVE" ? "success" :
                  org.status === "PENDING" ? "warning" : "danger"
                }>
                  {org.status}
                </Badge>
              </td>
              <td>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate(`/admin/organizations/${org.id}`, { state: org })}
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
