import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Dropdown, Row, Col, Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { pharmacyAPI } from "../services/api";
import PharmacyForm from "./components/pharmacy-form";
import CardContainer from "../components/CardContainer";

const PharmacyView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchMedicine();
  }, [id]);

  const fetchMedicine = async () => {
    setLoading(true);
    try {
      const data = await pharmacyAPI.getById(id);
      setMedicine(data);
    } catch (error) {
      toast.error("Failed to load medicine details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setIsSaving(true);
    try {
      await pharmacyAPI.update(id, data);
      toast.success("Medicine updated successfully");
      setIsEditable(false);
      fetchMedicine();
    } catch (error) {
      toast.error("Failed to update medicine");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await pharmacyAPI.delete(id);
      toast.success("Medicine deleted successfully");
      navigate("/pharmacy");
    } catch (error) {
      toast.error("Failed to delete medicine");
      setShowDeleteModal(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading medicine details...</div>;
  if (!medicine) return <div className="p-4 text-center">Medicine not found</div>;

  return (
    <>
      <CardContainer>
        <Row className="mb-3">
          <Col md={6}>
            <h4 className="fw-bold mt-2">{medicine.name}</h4>
            <span className="text-muted small">{medicine.genericName} · {medicine.category}</span>
          </Col>
          <Col md={6} className="d-flex justify-content-end align-items-center">
            {!isEditable && (
              <Dropdown align="end">
                <Dropdown.Toggle variant="white" className="border-0 p-0 shadow-none">
                  <i className="bi bi-three-dots-vertical fs-5"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/pharmacy/create">
                    <i className="bi bi-plus-circle me-2"></i> Add New Medicine
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setIsEditable(true)}>
                    <i className="bi bi-pencil-square me-2"></i> Edit
                  </Dropdown.Item>
                  <Dropdown.Item className="text-danger" onClick={() => setShowDeleteModal(true)}>
                    <i className="bi bi-trash-fill me-2"></i> Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Col>
        </Row>

        <PharmacyForm 
          pharmacyData={medicine} 
          isViewMode={true} 
          isEditable={isEditable} 
          onCancelEdit={() => setIsEditable(false)}
          onSubmit={handleUpdate}
          isLoading={isSaving}
        />
      </CardContainer>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <b>{medicine.name}</b>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default PharmacyView;
