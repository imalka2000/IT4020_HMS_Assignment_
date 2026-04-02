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
      {renderField("Test Name", "testName", "text", null, true)}
      {renderField("Test Code", "testCode", "text", null, true)}
      {renderField("Category", "category", "select", 
        CATS.map(c => ({ value: c, label: c })), 
        true
      )}
      {renderField("Ordered Date", "orderedDate", "date", null, true)}
      {renderField("Patient", "patientId", "select", 
        patients.map(p => ({ value: p.id, label: `${p.firstName} ${p.lastName}` })), 
        true
      )}
      {renderField("Doctor", "doctorId", "select", 
        doctors.map(d => ({ value: d.id, label: `Dr. ${d.firstName} ${d.lastName}` })), 
        true
      )}
      {renderField("Normal Range", "normalRange")}
      {renderField("Status", "status", "select", [
        { value: "PENDING", label: "PENDING" },
        { value: "COMPLETED", label: "COMPLETED" },
        { value: "CANCELLED", label: "CANCELLED" }
      ])}

      {isEditable && (
        <Row className="mt-4">
          <Col md={{ span: 6, offset: 3 }}>
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
