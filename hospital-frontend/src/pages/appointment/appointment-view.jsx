import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Dropdown, Row, Col, Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { appointmentAPI, patientAPI, doctorAPI } from "../../services/api";
import AppointmentForm from "./components/appointment-form";
import CardContainer from "../../components/CardContainer";

const AppointmentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [apptData, pData, dData] = await Promise.all([
        appointmentAPI.getById(id),
        patientAPI.getAll(),
        doctorAPI.getAll()
      ]);
      setAppointment(apptData);
      setPatients(pData);
      setDoctors(dData);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setIsSaving(true);
    try {
      await appointmentAPI.update(id, data);
      toast.success("Appointment updated successfully");
      setIsEditable(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to update appointment");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await appointmentAPI.delete(id);
      toast.success("Appointment deleted successfully");
      navigate("/appointments");
    } catch (error) {
      toast.error("Failed to delete appointment");
      setShowDeleteModal(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading appointment details...</div>;
  if (!appointment) return <div className="p-4 text-center">Appointment not found</div>;

  return (
    <>
      <CardContainer>
        <Row className="mb-3">
          <Col md={6}>
            <h4 className="fw-bold mt-2">Appointment #{appointment.id}</h4>
            <span className={`badge ${
              appointment.appointmentStatus === "COMPLETED" ? "bg-success" : 
              appointment.appointmentStatus === "SCHEDULED" ? "bg-primary" : "bg-danger"
            }`}>
              {appointment.appointmentStatus}
            </span>
          </Col>
          <Col md={6} className="d-flex justify-content-end align-items-center">
            {!isEditable && (
              <Dropdown align="end">
                <Dropdown.Toggle variant="white" className="border-0 p-0 shadow-none">
                  <i className="bi bi-three-dots-vertical fs-5"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/appointments/create">
                    <i className="bi bi-plus-circle me-2"></i> Schedule New
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

        <AppointmentForm 
          appointmentData={appointment} 
          patients={patients}
          doctors={doctors}
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
          Are you sure you want to delete appointment <b>#{appointment.id}</b>?
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

export default AppointmentView;
