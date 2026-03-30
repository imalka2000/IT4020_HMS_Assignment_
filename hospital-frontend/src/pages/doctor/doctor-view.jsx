import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Dropdown, Row, Col, Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { doctorAPI } from "../../services/api";
import DoctorForm from "./components/doctor-form";
import CardContainer from "../../components/CardContainer";

const DoctorView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    setLoading(true);
    try {
      const data = await doctorAPI.getById(id);
      setDoctor(data);
    } catch (error) {
      toast.error("Failed to load doctor details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setIsSaving(true);
    try {
      await doctorAPI.update(id, data);
      toast.success("Doctor updated successfully");
      setIsEditable(false);
      fetchDoctor();
    } catch (error) {
      toast.error("Failed to update doctor");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await doctorAPI.delete(id);
      toast.success("Doctor deleted successfully");
      navigate("/doctors");
    } catch (error) {
      toast.error("Failed to delete doctor");
      setShowDeleteModal(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading doctor details...</div>;
  if (!doctor) return <div className="p-4 text-center">Doctor not found</div>;

  return (
    <>
      <CardContainer>
        <Row className="mb-3">
          <Col md={6}>
            <h4 className="fw-bold mt-2">Dr. {doctor.firstName} {doctor.lastName}</h4>
            <span className="text-muted small">{doctor.specialization} · {doctor.department}</span>
          </Col>
          <Col md={6} className="d-flex justify-content-end align-items-center">
            {!isEditable && (
              <Dropdown align="end">
                <Dropdown.Toggle variant="white" className="border-0 p-0 shadow-none">
                  <i className="bi bi-three-dots-vertical fs-5"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/doctors/create">
                    <i className="bi bi-plus-circle me-2"></i> Add New Doctor
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

        <DoctorForm 
          doctorData={doctor} 
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
          Are you sure you want to delete <b>Dr. {doctor.firstName} {doctor.lastName}</b>?
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

export default DoctorView;
