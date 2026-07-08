import React, { useEffect, useState } from "react";
import { Table, Badge, Spinner } from "react-bootstrap";
import api from "../../api/api";

export default function DonationsTab() {

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/donation/all")
      .then(res => {
        setDonations(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching donations:", err);
        setLoading(false);
      });
  }, []);

  const getTypeBadge = (type) => {
    const variants = {
      MONEY: "success",
      FOOD: "warning",
      SERVICE: "info"
    };
    return <Badge bg={variants[type] || "secondary"}>{type}</Badge>;
  };

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: "warning",
      COMPLETED: "success"
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  if (loading)
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" />
      </div>
    );

  return (
    <div>
      <h4 className="mb-3 text-center fw-bold fs-1"> All Donations</h4>

      <Table hover striped bordered responsive className="rounded-4 overflow-hidden">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Donor</th>
            <th>Organization</th>
            <th>Amount / Quantity</th>
            <th>Type</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {donations.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>

              <td>{d.donorName}</td>

              <td>{d.organizationName}</td>

              <td>
                {d.type === "MONEY"
                  ? `₹ ${d.amount}`
                  : `${d.quantity} ${d.unit}`}
              </td>

              <td>{getTypeBadge(d.type)}</td>

              <td>{getStatusBadge(d.status)}</td>

              <td>
                {d.createdAt
                  ? new Date(d.createdAt).toLocaleString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}