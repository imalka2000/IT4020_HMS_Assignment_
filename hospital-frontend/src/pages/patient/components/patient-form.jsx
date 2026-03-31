import React, { useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  bloodGroup: "",
  address: ""
};

const PatientForm = ({
  patientData = {},
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
    if (patientData && patientData.id) {
      reset({
        ...defaultValues,
        ...patientData
      });
    }
  }, [patientData, reset]);

  const handleFormSubmit = async (data) => {
    if (onSubmit) {
      await onSubmit(data);
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
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </Form.Select>
          ) : (
            <Form.Control
              type={type}
              {...register(name, { 
                required: required ? `${label} is required` : false,
                pattern: type === "email" ? {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                } : undefined
              })}
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
      {renderField("First Name", "firstName", "text", null, true)}
      {renderField("Last Name", "lastName", "text", null, true)}
      {renderField("Email", "email", "email", null, true)}
      {renderField("Phone", "phone", "text", null, true)}
      {renderField("Date of Birth", "dateOfBirth", "date", null, true)}
      {renderField("Gender", "gender", "text", ["Male", "Female", "Other"], true)}
      {renderField("Blood Group", "bloodGroup", "text", BLOOD_GROUPS)}
      {renderField("Address", "address", "text")}

      {isEditable && (
        <Row className="mt-4">
          <Col md={{ span: 6, offset: 3 }}>
            <div className="d-flex gap-2">
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? "Saving..." : (isViewMode ? "Update Patient" : "Create Patient")}
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

export default PatientForm;
