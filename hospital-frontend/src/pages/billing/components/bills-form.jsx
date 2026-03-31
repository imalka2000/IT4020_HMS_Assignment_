import React, { useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";

const defaultValues = {
  patientId: "",
  appointmentId: "",
  consultationFee: 0.0,
  medicineFee: 0.0,
  labFee: 0.0,
  totalAmount: 0.0,
  paymentStatus: "PENDING",
  invoiceDate: new Date().toISOString().slice(0, 10),
  paymentMethod: "CASH"
};

const BillsForm = ({
  billData = {},
  onSubmit,
  isViewMode = false,
  isEditable = !isViewMode,
  onCancelEdit = () => {},
  isLoading = false,
  patients = [],
  appointments = []
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValues
  });

  const watchedPatientId = watch("patientId");
  const filteredAppointments = appointments.filter(a => 
    String(a.patientId) === String(watchedPatientId) && 
    (isViewMode || (a.status !== "COMPLETED" && a.appointmentStatus !== "COMPLETED"))
  );

  const watchConsultation = watch("consultationFee");
  const watchMedicine = watch("medicineFee");
  const watchLab = watch("labFee");

  useEffect(() => {
    const total = (parseFloat(watchConsultation) || 0) + 
                  (parseFloat(watchMedicine) || 0) + 
                  (parseFloat(watchLab) || 0);
    setValue("totalAmount", total.toFixed(2));
  }, [watchConsultation, watchMedicine, watchLab, setValue]);

  useEffect(() => {
    if (billData && (billData.id || billData.patientId)) {
      reset({
        ...defaultValues,
        ...billData,
        invoiceDate: billData.invoiceDate 
          ? new Date(billData.invoiceDate).toISOString().slice(0, 10) 
          : defaultValues.invoiceDate,
      });
    }
  }, [billData, reset]);

  const handleFormSubmit = async (data) => {
    if (onSubmit) {
      const formattedData = {
        ...data,
        patientId: String(data.patientId),
        appointmentId: data.appointmentId ? String(data.appointmentId) : null,
        consultationFee: parseFloat(data.consultationFee) || 0,
        medicineFee: parseFloat(data.medicineFee) || 0,
        labFee: parseFloat(data.labFee) || 0,
        totalAmount: parseFloat(data.totalAmount)
      };
      await onSubmit(formattedData);
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)} className="mt-4">
      <Row className="mb-3 align-items-center">
        <Col md={3}>
          <Form.Label className="mb-0 fw-bold">Patient *</Form.Label>
        </Col>
        <Col md={6}>
          <Form.Select
            {...register("patientId", { required: "Patient is required" })}
            disabled={!isEditable}
            isInvalid={!!errors.patientId}
          >
            <option value="">Select Patient...</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.patientId?.message}
          </Form.Control.Feedback>
        </Col>
      </Row>

      <Row className="mb-3 align-items-center">
        <Col md={3}>
          <Form.Label className="mb-0 fw-bold">Appointment</Form.Label>
        </Col>
        <Col md={6}>
          <Form.Select
            {...register("appointmentId")}
            disabled={!isEditable || !watchedPatientId}
          >
            <option value="">Select Appointment...</option>
            {filteredAppointments.map(a => (
              <option key={a.id} value={a.id}>
                #{a.id} - {a.reason} ({a.appointmentTime})
              </option>
            ))}
          </Form.Select>
          {!watchedPatientId && (
            <Form.Text className="text-muted small">Please select a patient first</Form.Text>
          )}
        </Col>
      </Row>

      <Row className="mb-3 align-items-center">
        <Col md={3}>
          <Form.Label className="mb-0 fw-bold">Consultation Fee (Rs.)</Form.Label>
        </Col>
        <Col md={6}>
          <Form.Control
            type="number"
            step="0.01"
            {...register("consultationFee")}
            disabled={!isEditable}
          />
        </Col>
      </Row>

      <Row className="mb-3 align-items-center">
        <Col md={3}>
          <Form.Label className="mb-0 fw-bold">Medicine Fee (Rs.)</Form.Label>
        </Col>
        <Col md={6}>
          <Form.Control
            type="number"
            step="0.01"
            {...register("medicineFee")}
            disabled={!isEditable}
          />
        </Col>
      </Row>

      <Row className="mb-3 align-items-center">
        <Col md={3}>
          <Form.Label className="mb-0 fw-bold">Lab Fee (Rs.)</Form.Label>
        </Col>
        <Col md={6}>
          <Form.Control
            type="number"
            step="0.01"
            {...register("labFee")}
            disabled={!isEditable}
          />
        </Col>
      </Row>

      <Row className="mb-3 align-items-center">
        <Col md={3}>
          <Form.Label className="mb-0 fw-bold">Total Amount (Rs.) *</Form.Label>
        </Col>
        <Col md={6}>
          <Form.Control
            type="number"
            step="0.01"
            {...register("totalAmount", { required: "Total amount is required" })}
            disabled={true}
            className="bg-light fw-bold text-success"
          />
          <Form.Control.Feedback type="invalid">
            {errors.totalAmount?.message}
          </Form.Control.Feedback>
        </Col>
      </Row>

      <Row className="mb-3 align-items-center">
        <Col md={3}>
          <Form.Label className="mb-0 fw-bold">Invoice Date *</Form.Label>
        </Col>
        <Col md={6}>
          <Form.Control
            type="date"
            {...register("invoiceDate", { required: "Date is required" })}
            disabled={!isEditable}
            isInvalid={!!errors.invoiceDate}
          />
        </Col>
      </Row>

      <Row className="mb-3 align-items-center">
        <Col md={3}>
          <Form.Label className="mb-0 fw-bold">Status</Form.Label>
        </Col>
        <Col md={6}>
          <Form.Select {...register("paymentStatus")} disabled={!isEditable}>
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
