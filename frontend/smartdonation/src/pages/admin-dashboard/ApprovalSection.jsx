import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import api from "./../../api/api";

export default function ApprovalSection({ org, onStatusChange }) {

  const [documentsVerified, setDocumentsVerified] = useState(
    org.documentsVerified || false
  );

  const [inspectionCompleted, setInspectionCompleted] = useState(
    org.inspectionCompleted || false
  );

  const updateChecklist = (type, value) => {

    if (type === "DOCUMENTS") {
      setDocumentsVerified(value);
    }

    if (type === "INSPECTION") {
      setInspectionCompleted(value);
    }

    api.post(
      `/organization/update-checklist?orgId=${org.id}&type=${type}&value=${value}`
    );
  };

  const approveOrg = () => {
    api.post(
      `/organization/approve?orgId=${org.id}`
    ).then(() => {
      if (onStatusChange) onStatusChange("APPROVED");
    });
  };

  const rejectOrg = () => {
    api.post(
      `/organization/reject?orgId=${org.id}`
    ).then(() => {
      if (onStatusChange) onStatusChange("REJECTED");
    });
  };

  return (
    <Card className="mt-4 p-3">
      <h5>Verification & Approval</h5>

      <Form.Check
        type="checkbox"
        label="Documents Verified"
        checked={documentsVerified}
        onChange={(e) =>
          updateChecklist("DOCUMENTS", e.target.checked)
        }
      />

      <Form.Check
        type="checkbox"
        label="Inspection Completed"
        checked={inspectionCompleted}
        onChange={(e) =>
          updateChecklist("INSPECTION", e.target.checked)
        }
      />

      <div className="d-flex gap-3 mt-3">
        <Button
          variant="success"
          disabled={!documentsVerified || !inspectionCompleted}
          onClick={approveOrg}
        >
          Approve
        </Button>

        <Button
          variant="danger"
          onClick={rejectOrg}
        >
          Reject
        </Button>
      </div>
    </Card>
  );
}
