import React, { useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";

const defaultValues = {
  patientId: "",
  doctorId: "",
  status: "SCHEDULED",
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
          : defaultValues.appointmentDate,
        status: appointmentData.status || appointmentData.appointmentStatus || defaultValues.status
      });
    }
  }, [appointmentData, reset]);

  const handleFormSubmit = async (data) => {
    if (onSubmit) {
      // Ensure IDs are strings
      const formattedData = {
        ...data,
        patientId: String(data.patientId),
        doctorId: String(data.doctorId)
      };
      await onSubmit(formattedData);
    }
  };

  const renderField = (label, name, type = "text", options = null, required = false) => {
    return (
      <Row className="mb-3 align-items-center">
        <Col md={3}>
          <Form.Label className="mb-0 fw-bold">{label} {required && "*"}</Form.Label>
        </Col>
        <Col md={6}>
          {options ? (
            <Form.Select
              {...register(name, { required: required ? `${label} is required` : false })}
              disabled={!isEditable}
              isInvalid={!!errors[name]}
            >
              <option value="">Select {label}...</option>
              {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Form.Select>
          ) : (
            <Form.Control
              type={type}
              as={type === "textarea" ? "textarea" : "input"}
              rows={type === "textarea" ? 3 : undefined}
              {...register(name, { required: required ? `${label} is required` : false })}
              disabled={!isEditable}
              isInvalid={!!errors[name]}
              placeholder={`Enter ${label}`}
            />
          )}
          <Form.Control.Feedback type="invalid">
            {errors[name]?.message}
          </Form.Control.Feedback>
        </Col>
      </Row>
    );
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)} className="mt-4">
      {renderField("Patient", "patientId", "select", 
        patients.map(p => ({ value: p.id, label: `${p.firstName} ${p.lastName}` })), 
        true
      )}
      {renderField("Doctor", "doctorId", "select", 
        doctors.map(d => ({ value: d.id, label: `Dr. ${d.firstName} ${d.lastName}` })), 
        true
      )}
      {renderField("Date", "appointmentDate", "date", null, true)}
      {renderField("Time", "appointmentTime", "time", null, true)}
      {renderField("Status", "status", "select", [
        { value: "SCHEDULED", label: "SCHEDULED" },
        { value: "COMPLETED", label: "COMPLETED" },
        { value: "CANCELLED", label: "CANCELLED" }
      ])}
      {renderField("Reason", "reason", "text")}
      {renderField("Notes", "notes", "textarea")}

      {isEditable && (
        <Row className="mt-4">
          <Col md={{ span: 6, offset: 3 }}>
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
