import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Table, Badge } from "react-bootstrap";
import ApprovalSection from "./ApprovalSection";
import StaffForm from "../../components/staff/StaffForm";
import StaffTable from "../../components/staff/StaffTable";

export default function OrganizationDetails() {

  const { state } = useLocation();
  const navigate = useNavigate();

  const [org, setOrg] = useState(state);

  if (!org) return <p>No data found</p>;

  // Separate Head & Staff
  const head = org.head;
  const staffMembers = org.staff;

  return (
    <div className="container mt-4">

      <Button variant="secondary" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      {/* Basic Info */}
      <Card className="mt-3 p-3">
        <h4>{org.name}</h4>
        <p><b>Type:</b> {org.type}</p>
        <p><b>Address:</b> {org.address}</p>
        <p>
          <b>Status:</b>{" "}
          <Badge bg={org.status === "PENDING" ? "warning" : "success"}>
            {org.status}
          </Badge>
        </p>
        <p><b>Created At:</b> {org.createdAt ? new Date(org.createdAt).toLocaleString() : "-"}</p>
        <p>
          <b>Approved At:</b>{" "}
          {org.approvedAt
            ? new Date(org.approvedAt).toLocaleString()
            : "-"}
        </p>
      </Card>

      {/* Documents */}
      <Card className="mt-4 p-3">
        <h5>Organization Documents</h5>
        <Table bordered>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {org.documents?.map(doc => (
              <tr key={doc.id}>
                <td>{doc.fileName}</td>
                <td>{doc.description}</td>
                <td className="d-flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() =>
                      window.open(
                        `http://localhost:8080${doc.filePath}`,
                        "_blank"
                      )
                    }
                  >
                    View
                  </Button>

                  <a
                    href={`http://localhost:8080/api/organization/download/${doc.fileName}`}
                  >
                    <Button size="sm" variant="success">
                      Download
                    </Button>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Organization Head */}
      <Card className="mt-4 p-3">
        <h5>Organization Head</h5>
        {head ? (
          <>
            <p><b>Name:</b> {head.name}</p>
            <p><b>Email:</b> {head.email}</p>
            <p><b>Mobile:</b> {head.mobile}</p>
            <p><b>Role:</b> {head.role}</p>
          </>
        ) : (
          <p>No head assigned.</p>
        )}
      </Card>
      <br />

      {/* If Pending → Show Approval Section */}
      {org.status === "PENDING" ? (

        <ApprovalSection
          org={org}
          onStatusChange={() => navigate(-1)}
        />

      ) : (

        <>
          {/* Reusable Staff Table */}
          <StaffTable
            staffList={staffMembers || []}
            organizationId={org.id}
            onDelete={(id) =>
              setOrg(prev => ({
                ...prev,
                staff: prev.staff.filter(u => u.id !== id)
              }))
            }
          />
          <br/><br/>

          {/* Reusable Staff Form */}
          <StaffForm
            organizationId={org.id}
            onStaffAdded={(newStaff) =>
              setOrg(prev => ({
                ...prev,
                staff: [...prev.staff, newStaff]
              }))
            }
          />
        </>
      )}
      <Card className="mt-4 p-3">
        <h5>Organization Donations</h5>

        {!org.donations || org.donations.length === 0 ? (
          <p>No donations received yet.</p>
        ) : (
          <Table bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Donor</th>
                <th>Type</th>
                <th>Amount / Quantity</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {org.donations.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>

                  <td>{d.donor}</td>

                  <td>
                    <Badge
                      bg={
                        d.type === "MONEY"
                          ? "success"
                          : d.type === "FOOD"
                          ? "warning"
                          : "primary"
                      }
                    >
                      {d.type}
                    </Badge>
                  </td>

                  <td>
                    {d.amount
                      ? `₹ ${d.amount}`
                      : `${d.quantity || "-"} ${d.unit || ""}`}
                  </td>

                  <td>
                    <Badge
                      bg={
                        d.status === "COMPLETED"
                          ? "success"
                          : d.status === "PENDING"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {d.status}
                    </Badge>
                  </td>

                  <td>
                    {d.createdAt
                      ? new Date(d.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

    </div>
  );
}



