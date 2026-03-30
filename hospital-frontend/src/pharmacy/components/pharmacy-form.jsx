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

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)} className="mt-4">
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Medicine Name *</Form.Label>
            <Form.Control
              type="text"
              {...register("name", { required: "Name is required" })}
              disabled={!isEditable}
              isInvalid={!!errors.name}
              placeholder="e.g. Amoxicillin"
            />
            <Form.Control.Feedback type="invalid">
              {errors.name?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Generic Name</Form.Label>
            <Form.Control
              type="text"
              {...register("genericName")}
              disabled={!isEditable}
              placeholder="e.g. Penicillin"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Category *</Form.Label>
            <Form.Control
              type="text"
              {...register("category", { required: "Category is required" })}
              disabled={!isEditable}
              isInvalid={!!errors.category}
              placeholder="e.g. Antibiotic"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Manufacturer</Form.Label>
            <Form.Control
              type="text"
              {...register("manufacturer")}
              disabled={!isEditable}
              placeholder="e.g. Pfizer"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Price (Rs.) *</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              {...register("price", { required: "Price is required" })}
              disabled={!isEditable}
              isInvalid={!!errors.price}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Stock Quantity *</Form.Label>
            <Form.Control
              type="number"
              {...register("stockQuantity", { required: "Stock is required" })}
              disabled={!isEditable}
              isInvalid={!!errors.stockQuantity}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Expiry Date *</Form.Label>
            <Form.Control
              type="date"
              {...register("expiryDate", { required: "Expiry date is required" })}
              disabled={!isEditable}
              isInvalid={!!errors.expiryDate}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Description</Form.Label>
            <Form.Control
              type="text"
              {...register("description")}
              disabled={!isEditable}
              placeholder="Dosage, instructions, etc."
            />
          </Form.Group>
        </Col>
      </Row>

      {isEditable && (
        <Row className="mt-4">
          <Col md={12}>
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
