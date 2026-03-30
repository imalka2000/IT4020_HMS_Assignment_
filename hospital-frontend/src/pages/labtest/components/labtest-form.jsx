import React, { useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";

const CATS = ["BLOOD", "URINE", "IMAGING", "MICROBIOLOGY", "PATHOLOGY", "OTHER"];

const defaultValues = {
  testName: "",
  testCode: "",
  category: "",
  orderedDate: new Date().toISOString().slice(0, 10),
  patientId: "",
  doctorId: "",
  normalRange: "",
  status: "PENDING"
};

const LabTestForm = ({
  testData = {},
  onSubmit,
  isViewMode = false,
  isEditable = !isViewMode,
  onCancelEdit = () => {},
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValues
  });

  useEffect(() => {
    if (testData && testData.id) {
      reset({
        ...defaultValues,
        ...testData,
        orderedDate: testData.orderedDate 
          ? new Date(testData.orderedDate).toISOString().slice(0, 10) 
          : defaultValues.orderedDate
      });
    }
  }, [testData, reset]);

  const handleFormSubmit = async (data) => {
    if (onSubmit) {
      await onSubmit({
        ...data,
        patientId: parseInt(data.patientId),
        doctorId: parseInt(data.doctorId)
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)} className="mt-4">
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Test Name *</Form.Label>
            <Form.Control
              type="text"
              {...register("testName", { required: "Test name is required" })}
              disabled={!isEditable}
              isInvalid={!!errors.testName}
              placeholder="e.g. Complete Blood Count"
            />
            <Form.Control.Feedback type="invalid">
              {errors.testName?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Test Code *</Form.Label>
            <Form.Control
              type="text"
              {...register("testCode", { required: "Test code is required" })}
              disabled={!isEditable}
              isInvalid={!!errors.testCode}
              placeholder="CBC-001"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Category *</Form.Label>
            <Form.Select 
              {...register("category", { required: "Category is required" })} 
              disabled={!isEditable}
              isInvalid={!!errors.category}
            >
              <option value="">Select Category</option>
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Ordered Date *</Form.Label>
            <Form.Control
              type="date"
              {...register("orderedDate", { required: "Date is required" })}
              disabled={!isEditable}
              isInvalid={!!errors.orderedDate}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Patient ID *</Form.Label>
            <Form.Control
              type="number"
              {...register("patientId", { required: "Patient ID is required" })}
              disabled={!isEditable}
              placeholder="e.g. 1"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Doctor ID *</Form.Label>
            <Form.Control
              type="number"
              {...register("doctorId", { required: "Doctor ID is required" })}
              disabled={!isEditable}
              placeholder="e.g. 1"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Normal Range</Form.Label>
            <Form.Control
              type="text"
              {...register("normalRange")}
              disabled={!isEditable}
              placeholder="e.g. 4.0–11.0 × 10³/µL"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Status</Form.Label>
            <Form.Select {...register("status")} disabled={!isEditable}>
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {isEditable && (
        <Row className="mt-4">
          <Col md={12}>
            <div className="d-flex gap-2">
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? "Saving..." : (isViewMode ? "Update Test" : "Order Test")}
              </Button>
              {isViewMode && (
                <Button variant="secondary" onClick={onCancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </Col>
        </Row>
      )}
    </Form>
  );
};

export default LabTestForm;
