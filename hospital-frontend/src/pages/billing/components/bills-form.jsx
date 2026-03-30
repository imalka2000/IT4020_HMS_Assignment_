import React, { useEffect } from "react";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";

const defaultValues = {
  patientId: "",
  appointmentId: "",
  amount: "",
  status: "PENDING",
  billingDate: new Date().toISOString().slice(0, 10),
  paymentMethod: "CASH"
};

const BillsForm = ({
  billData = {},
  onSubmit,
  isViewMode = false,
  isEditable = !isViewMode,
  onCancelEdit = () => {},
  isLoading = false
}) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValues
  });

  useEffect(() => {
    if (billData && (billData.id || billData.patientId)) {
      reset({
        ...defaultValues,
        ...billData,
        billingDate: billData.billingDate 
          ? new Date(billData.billingDate).toISOString().slice(0, 10) 
          : defaultValues.billingDate
      });
    }
  }, [billData, reset]);

  const handleFormSubmit = async (data) => {
    if (onSubmit) {
      await onSubmit(data);
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)} className="mt-4">
      <Row className="mb-3 align-items-center">
        <Col md={3}>
          <Form.Label className="mb-0 fw-bold">Patient ID *</Form.Label>
        </Col>
        <Col md={6}>
          <Form.Control
            type="number"
            {...register("patientId", { required: "Patient ID is required" })}
            disabled={!isEditable}
            isInvalid={!!errors.patientId}
          />
          <Form.Control.Feedback type="invalid">
            {errors.patientId?.message}
          </Form.Control.Feedback>
        </Col>
      </Row>

      <Row className="mb-3 align-items-center">
        <Col md={3}>
          <Form.Label className="mb-0 fw-bold">Appointment ID</Form.Label>
        </Col>
        <Col md={6}>
          <Form.Control
            type="number"
            {...register("appointmentId")}
            disabled={!isEditable}
          />
        </Col>
      </Row>

      <Row className="mb-3 align-items-center">
        <Col md={3}>
          <Form.Label className="mb-0 fw-bold">Amount (Rs.) *</Form.Label>
        </Col>
        <Col md={6}>
          <Form.Control
            type="number"
            step="0.01"
            {...register("amount", { required: "Amount is required" })}
            disabled={!isEditable}
            isInvalid={!!errors.amount}
          />
          <Form.Control.Feedback type="invalid">
            {errors.amount?.message}
          </Form.Control.Feedback>
        </Col>
      </Row>

      <Row className="mb-3 align-items-center">
        <Col md={3}>
          <Form.Label className="mb-0 fw-bold">Billing Date *</Form.Label>
        </Col>
        <Col md={6}>
          <Form.Control
            type="date"
            {...register("billingDate", { required: "Date is required" })}
            disabled={!isEditable}
            isInvalid={!!errors.billingDate}
          />
        </Col>
      </Row>

      <Row className="mb-3 align-items-center">
        <Col md={3}>
          <Form.Label className="mb-0 fw-bold">Status</Form.Label>
        </Col>
        <Col md={6}>
          <Form.Select {...register("status")} disabled={!isEditable}>
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="CANCELLED">CANCELLED</option>
          </Form.Select>
        </Col>
      </Row>

      <Row className="mb-3 align-items-center">
        <Col md={3}>
          <Form.Label className="mb-0 fw-bold">Payment Method</Form.Label>
        </Col>
        <Col md={6}>
          <Form.Select {...register("paymentMethod")} disabled={!isEditable}>
            <option value="CASH">CASH</option>
            <option value="CARD">CARD</option>
            <option value="INSURANCE">INSURANCE</option>
            <option value="OTHER">OTHER</option>
          </Form.Select>
        </Col>
      </Row>

      {isEditable && (
        <Row className="mt-4">
          <Col md={{ span: 6, offset: 3 }}>
            <div className="d-flex gap-2">
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? "Saving..." : (isViewMode ? "Update Bill" : "Create Bill")}
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

export default BillsForm;
