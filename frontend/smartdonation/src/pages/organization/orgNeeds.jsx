import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/api"
import {
  Card,Row,Col,Badge,Spinner,Alert,Button,Modal,Form} from "react-bootstrap";

export default function OrgNeeds({ organizationId }) {
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedNeed, setSelectedNeed] = useState(null);

  // ✅ Fetch Needs
  const fetchNeeds = async () => {
    if (!organizationId) {
      setNeeds([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(
        `/needs/org-needs/${organizationId}`
      );
      setNeeds(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load needs.");
      setNeeds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNeeds();
  }, [organizationId]);

  // ✅ Cancel
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this need?")) return;

    try {
      await api.put(
        `/needs/${id}/cancel`
      );
      fetchNeeds();
    } catch {
      alert("Failed to cancel need");
    }
  };

  // ✅ Reopen
  const handleReopen = async (id) => {
    try {
      await api.put(
        `/needs/${id}/reopen`
      );
      fetchNeeds();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Cannot reopen. Please extend deadline first."
      );
    }
  };

  // ✅ Open Edit Modal
  const handleEditClick = (need) => {
    setSelectedNeed({ ...need });
    setShowModal(true);
  };

  // ✅ Update or Extend
  const handleUpdate = async () => {
    try {
      if (selectedNeed.status === "EXPIRED") {

        if (!selectedNeed.deadline) {
          alert("Please select a deadline");
          return;
        }

        // const formattedDate = new Date(selectedNeed.deadline).toISOString();
        const formattedDate=selectedNeed.deadline;

        await api.put(
          `/needs/${selectedNeed.id}/extend`,
          null,
          {
            params: { newDeadline: formattedDate }
          }
        );

      } else {

        await api.put(
          `/needs/${selectedNeed.id}/update`,
          selectedNeed
        );
      }

      setShowModal(false);
      fetchNeeds();

    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };
  const parseDate = (str) => {
    if (!str) return null;
    const date = new Date(str);
    return isNaN(date.getTime()) ? null : date;
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!Array.isArray(needs) || needs.length === 0)
    return <Alert variant="info">No needs posted yet.</Alert>;

  return (
    <div style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f1f5f9 100%)'}}>
      <h3 className="mb-4">Organization Needs</h3>

      <Row>
        {needs.map((need) => {
          const deadline = parseDate(need.deadline);

          let badgeColor = "success";

          if (need.status === "CANCELLED") {
            badgeColor = "danger";
          } else if (need.status === "EXPIRED") {
            badgeColor = "secondary";
          }

          return (
            <Col md={6} lg={4} key={need.id} className="mb-4">
              <Card className="shadow-sm h-100">

                {need.imageUrl && (
                  <Card.Img
                    variant="top"
                    src={`http://localhost:8080/uploads/needs/${need.imageUrl}`}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}

                <Card.Body>
                  <Card.Title>{need.title}</Card.Title>
                  <Card.Text>{need.description}</Card.Text>

                  <div className="mb-2">
                    <Badge bg="secondary" className="me-2">
                      {need.category}
                    </Badge>

                    <Badge
                      bg={
                        need.urgency === "HIGH"
                          ? "danger"
                          : need.urgency === "MEDIUM"
                          ? "warning"
                          : "success"
                      }
                    >
                      {need.urgency}
                    </Badge>
                  </div>

                  <p>
                    <strong>Required:</strong> {need.requiredQuantity}{" "}
                    {need.unit}
                  </p>

                  <p>
                    <strong>Collected:</strong> {need.collectedQuantity}{" "}
                    {need.unit}
                  </p>

                  <p>
                    <strong>Location:</strong> {need.location}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <Badge bg={badgeColor}>{need.status}</Badge>
                  </p>

                  <p>
                    <strong>Deadline:</strong>{" "}
                    {deadline
                      ? deadline.toLocaleString("en-GB")
                      : "Not Set"}
                  </p>

                  {/* ✅ Buttons */}
                  <div className="d-flex gap-2 mt-2">

                    {/* OPEN */}
                    {need.status === "OPEN" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleEditClick(need)}
                        >
                          Update
                        </Button>

                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleCancel(need.id)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}

                    {/* EXPIRED */}
                    {need.status === "EXPIRED" && (
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleEditClick(need)}
                      >
                        Extend Deadline
                      </Button>
                    )}

                    {/* CANCELLED */}
                    {need.status === "CANCELLED" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline-success"
                          onClick={() => handleReopen(need.id)}
                        >
                          Reopen
                        </Button>

                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleEditClick(need)}
                        >
                          Update
                        </Button>
                      </>
                    )}

                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* ✅ Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedNeed?.status === "EXPIRED"
              ? "Extend Deadline"
              : "Update Need"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            {selectedNeed && (
              <Form>

                {/* TITLE */}
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    value={selectedNeed.title || ""}
                    onChange={(e) =>
                      setSelectedNeed({
                        ...selectedNeed,
                        title: e.target.value
                      })
                    }
                  />
                </Form.Group>

                {/* DESCRIPTION */}
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={selectedNeed.description || ""}
                    onChange={(e) =>
                      setSelectedNeed({
                        ...selectedNeed,
                        description: e.target.value
                      })
                    }
                  />
                </Form.Group>

                {/* CATEGORY */}
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    value={selectedNeed.category || ""}
                    onChange={(e) =>
                      setSelectedNeed({
                        ...selectedNeed,
                        category: e.target.value
                      })
                    }
                  />
                </Form.Group>

                {/* REQUIRED QUANTITY */}
                <Form.Group className="mb-3">
                  <Form.Label>Required Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    value={selectedNeed.requiredQuantity || ""}
                    onChange={(e) =>
                      setSelectedNeed({
                        ...selectedNeed,
                        requiredQuantity: e.target.value
                      })
                    }
                  />
                </Form.Group>

                {/* UNIT */}
                <Form.Group className="mb-3">
                  <Form.Label>Unit</Form.Label>
                  <Form.Control
                    value={selectedNeed.unit || ""}
                    onChange={(e) =>
                      setSelectedNeed({
                        ...selectedNeed,
                        unit: e.target.value
                      })
                    }
                  />
                </Form.Group>

                {/* LOCATION */}
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    value={selectedNeed.location || ""}
                    onChange={(e) =>
                      setSelectedNeed({
                        ...selectedNeed,
                        location: e.target.value
                      })
                    }
                  />
                </Form.Group>

                {/* URGENCY */}
                <Form.Group className="mb-3">
                  <Form.Label>Urgency</Form.Label>
                  <Form.Select
                    value={selectedNeed.urgency || "LOW"}
                    onChange={(e) =>
                      setSelectedNeed({
                        ...selectedNeed,
                        urgency: e.target.value
                      })
                    }
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </Form.Select>
                </Form.Group>

                {/* DEADLINE */}
                <Form.Group className="mb-3">
                  <Form.Label>Deadline</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={
                      selectedNeed.deadline
                        ? selectedNeed.deadline.slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setSelectedNeed({
                        ...selectedNeed,
                        deadline: e.target.value
                      })
                    }
                  />
                </Form.Group>

              </Form>
            )}
          </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>

          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}