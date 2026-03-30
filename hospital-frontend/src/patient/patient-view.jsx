import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Dropdown, Row, Col, Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { patientAPI } from "../services/api";
import PatientForm from "./components/patient-form";
import CardContainer from "../components/CardContainer";

const PatientView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    setLoading(true);
    try {
      const data = await patientAPI.getById(id);
      setPatient(data);
    } catch (error) {
      toast.error("Failed to load patient details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setIsSaving(true);
    try {
      await patientAPI.update(id, data);
      toast.success("Patient updated successfully");
      setIsEditable(false);
      fetchPatient();
    } catch (error) {
      toast.error("Failed to update patient");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await patientAPI.delete(id);
      toast.success("Patient deleted successfully");
      navigate("/patients");
    } catch (error) {
      toast.error("Failed to delete patient");
      setShowDeleteModal(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading patient details...</div>;
  if (!patient) return <div className="p-4 text-center">Patient not found</div>;

  return (
    <>
      <CardContainer>
        <Row className="mb-3">
          <Col md={6}>
            <h4 className="fw-bold mt-2">{patient.firstName} {patient.lastName}</h4>
            <span className="text-muted small">Patient ID: #{patient.id}</span>
          </Col>
          <Col md={6} className="d-flex justify-content-end align-items-center">
            {!isEditable && (
              <Dropdown align="end">
                <Dropdown.Toggle variant="white" className="border-0 p-0 shadow-none">
                  <i className="bi bi-three-dots-vertical fs-5"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/patients/create">
                    <i className="bi bi-plus-circle me-2"></i> Register New Patient
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

        <PatientForm 
          patientData={patient} 
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
          Are you sure you want to delete patient <b>{patient.firstName} {patient.lastName}</b>?
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

export default PatientView;
