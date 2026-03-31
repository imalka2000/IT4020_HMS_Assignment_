import React, { useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";

const defaultValues = {
  name: "",
  genericName: "",
  category: "",
  manufacturer: "",
  price: "",
  stockQuantity: "",
  expiryDate: "",
  description: ""
};

const PharmacyForm = ({
  pharmacyData = {},
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
    if (pharmacyData && pharmacyData.id) {
      reset({
        ...defaultValues,
        ...pharmacyData,
        expiryDate: pharmacyData.expiryDate 
          ? new Date(pharmacyData.expiryDate).toISOString().slice(0, 10) 
          : ""
      });
    }
  }, [pharmacyData, reset]);

  const handleFormSubmit = async (data) => {
    if (onSubmit) {
      await onSubmit({
        ...data,
        price: parseFloat(data.price),
        stockQuantity: parseInt(data.stockQuantity)
      });
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
              step={type === "number" ? "0.01" : undefined}
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
      {renderField("Medicine Name", "name", "text", null, true)}
      {renderField("Generic Name", "genericName")}
      {renderField("Category", "category", "text", null, true)}
      {renderField("Manufacturer", "manufacturer")}
      {renderField("Price (Rs.)", "price", "number", null, true)}
      {renderField("Stock Quantity", "stockQuantity", "number", null, true)}
      {renderField("Expiry Date", "expiryDate", "date", null, true)}
      {renderField("Description", "description", "textarea")}

      {isEditable && (
        <Row className="mt-4">
          <Col md={{ span: 6, offset: 3 }}>
            <div className="d-flex gap-2">
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? "Saving..." : (isViewMode ? "Update Medicine" : "Add Medicine")}
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

export default PharmacyForm;
