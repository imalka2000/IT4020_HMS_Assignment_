import React, { useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";

const defaultValues = {
  patientId: "",
  doctorId: "",
  appointmentStatus: "SCHEDULED",
  appointmentDate: new Date().toISOString().slice(0, 10),
  appointmentTime: "09:00",
  reason: "",
  notes: ""
};

const AppointmentForm = ({
  appointmentData = {},
  patients = [],
  doctors = [],
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
    if (appointmentData && appointmentData.id) {
      reset({
        ...defaultValues,
        ...appointmentData,
        appointmentDate: appointmentData.appointmentDate 
          ? new Date(appointmentData.appointmentDate).toISOString().slice(0, 10) 
          : defaultValues.appointmentDate
      });
    }
  }, [appointmentData, reset]);

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
            <Form.Label className="fw-bold">Patient *</Form.Label>
            <Form.Select 
              {...register("patientId", { required: "Patient is required" })} 
              disabled={!isEditable}
              isInvalid={!!errors.patientId}
            >
              <option value="">Select Patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} {p.dateOfBirth ? `(${p.dateOfBirth})` : ""}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.patientId?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Doctor *</Form.Label>
            <Form.Select 
              {...register("doctorId", { required: "Doctor is required" })} 
              disabled={!isEditable}
              isInvalid={!!errors.doctorId}
            >
              <option value="">Select Doctor</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>
                  Dr. {d.firstName} {d.lastName} {d.specialization ? ` — ${d.specialization}` : ""}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.doctorId?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Date *</Form.Label>
            <Form.Control
              type="date"
              {...register("appointmentDate", { required: "Date is required" })}
              disabled={!isEditable}
              isInvalid={!!errors.appointmentDate}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Time *</Form.Label>
            <Form.Control
              type="time"
              {...register("appointmentTime", { required: "Time is required" })}
              disabled={!isEditable}
              isInvalid={!!errors.appointmentTime}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Status</Form.Label>
            <Form.Select {...register("appointmentStatus")} disabled={!isEditable}>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Reason</Form.Label>
            <Form.Control
              type="text"
              {...register("reason")}
              disabled={!isEditable}
              placeholder="Purpose of visit"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={12}>
          <Form.Group>
            <Form.Label className="fw-bold">Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              {...register("notes")}
              disabled={!isEditable}
              placeholder="Additional notes..."
            />
          </Form.Group>
        </Col>
      </Row>

      {isEditable && (
        <Row className="mt-4">
          <Col md={12}>
            <div className="d-flex gap-2">
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? "Saving..." : (isViewMode ? "Update Appointment" : "Schedule Appointment")}
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

export default AppointmentForm;
