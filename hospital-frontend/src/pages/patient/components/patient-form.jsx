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
              placeholder="john@email.com"
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
            <Form.Label className="fw-bold">Date of Birth *</Form.Label>
            <Form.Control
              type="date"
              {...register("dateOfBirth", { required: "Date of birth is required" })}
              disabled={!isEditable}
              isInvalid={!!errors.dateOfBirth}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Gender *</Form.Label>
            <Form.Select 
              {...register("gender", { required: "Gender is required" })} 
              disabled={!isEditable}
              isInvalid={!!errors.gender}
            >
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Blood Group</Form.Label>
            <Form.Select {...register("bloodGroup")} disabled={!isEditable}>
              <option value="">Select...</option>
              {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Address</Form.Label>
            <Form.Control
              type="text"
              {...register("address")}
              disabled={!isEditable}
              placeholder="No. 1, Main Street"
            />
          </Form.Group>
        </Col>
      </Row>

      {isEditable && (
        <Row className="mt-4">
          <Col md={12}>
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
