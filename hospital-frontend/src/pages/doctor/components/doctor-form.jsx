import React, { useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";

const defaultValues = {
  firstName: "",
  lastName: "",
  specialization: "",
  department: "",
  email: "",
  phone: "",
  licenseNumber: "",
  available: true
};

const DoctorForm = ({
  doctorData = {},
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
    if (doctorData && doctorData.id) {
      reset({
        ...defaultValues,
        ...doctorData
      });
    }
  }, [doctorData, reset]);

  const handleFormSubmit = async (data) => {
    if (onSubmit) {
      await onSubmit(data);
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)} className="mt-4">
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">First Name *</Form.Label>
            <Form.Control
              type="text"
              {...register("firstName", { required: "First name is required" })}
              disabled={!isEditable}
              isInvalid={!!errors.firstName}
              placeholder="John"
            />
            <Form.Control.Feedback type="invalid">
              {errors.firstName?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Last Name *</Form.Label>
            <Form.Control
              type="text"
              {...register("lastName", { required: "Last name is required" })}
              disabled={!isEditable}
              isInvalid={!!errors.lastName}
              placeholder="Smith"
            />
            <Form.Control.Feedback type="invalid">
              {errors.lastName?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Specialization *</Form.Label>
            <Form.Control
              type="text"
              {...register("specialization", { required: "Specialization is required" })}
              disabled={!isEditable}
              isInvalid={!!errors.specialization}
              placeholder="e.g. Cardiology"
            />
            <Form.Control.Feedback type="invalid">
              {errors.specialization?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Department *</Form.Label>
            <Form.Control
              type="text"
              {...register("department", { required: "Department is required" })}
              disabled={!isEditable}
              isInvalid={!!errors.department}
              placeholder="e.g. Inpatient"
            />
            <Form.Control.Feedback type="invalid">
              {errors.department?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Email *</Form.Label>
            <Form.Control
              type="email"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              disabled={!isEditable}
              isInvalid={!!errors.email}
              placeholder="dr.smith@hospital.com"
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Phone *</Form.Label>
            <Form.Control
              type="text"
              {...register("phone", { required: "Phone is required" })}
              disabled={!isEditable}
              isInvalid={!!errors.phone}
              placeholder="+94 77 000 0000"
            />
            <Form.Control.Feedback type="invalid">
              {errors.phone?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">License Number *</Form.Label>
            <Form.Control
              type="text"
              {...register("licenseNumber", { required: "License number is required" })}
              disabled={!isEditable}
              isInvalid={!!errors.licenseNumber}
              placeholder="MED-12345"
            />
          </Form.Group>
        </Col>
        <Col md={6} className="d-flex align-items-end">
          <Form.Group className="mb-2">
            <Form.Check 
              type="checkbox"
              label="Available for appointments"
              {...register("available")}
              disabled={!isEditable}
              className="fw-bold"
            />
          </Form.Group>
        </Col>
      </Row>

      {isEditable && (
        <Row className="mt-4">
          <Col md={12}>
            <div className="d-flex gap-2">
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? "Saving..." : (isViewMode ? "Update Doctor" : "Add Doctor")}
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

export default DoctorForm;
