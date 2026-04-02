import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Dropdown, Row, Col, Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { billingAPI, patientAPI, appointmentAPI } from "../../services/api";
import BillsForm from "./components/bills-form";
import CardContainer from "../../components/CardContainer";

const BillView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
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
      const [billData, pData, aData] = await Promise.all([
        billingAPI.getById(id),
        patientAPI.getAll(),
        appointmentAPI.getAll()
      ]);
      setBill(billData);
      setPatients(pData);
      setAppointments(aData);
    } catch (error) {
      toast.error("Failed to load details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setIsSaving(true);
    try {
      await billingAPI.update(id, data);

      // If appointment ID is provided/changed, mark it as completed
      if (data.appointmentId) {
        const appointment = appointments.find(a => String(a.id) === String(data.appointmentId));
        if (appointment && (appointment.status !== "COMPLETED" && appointment.appointmentStatus !== "COMPLETED")) {
          await appointmentAPI.update(data.appointmentId, {
            ...appointment,
            status: "COMPLETED"
          });
        }
      }

      toast.success("Bill updated successfully");
      setIsEditable(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to update bill");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await billingAPI.delete(id);
      toast.success("Bill deleted successfully");
      navigate("/billing");
    } catch (error) {
      toast.error("Failed to delete bill");
      setShowDeleteModal(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading bill details...</div>;
  if (!bill) return <div className="p-4 text-center">Bill not found</div>;

  return (
    <>
      <CardContainer>
        <Row className="mb-3">
          <Col md={6}>
            <h4 className="fw-bold mt-2">Bill #{bill.code || "N/A"}</h4>
          </Col>
          <Col md={6} className="d-flex justify-content-end">
            {!isEditable && (
              <Dropdown align="end">
                <Dropdown.Toggle variant="white" className="border-0 p-0 shadow-none">
                  <i className="bi bi-three-dots-vertical fs-5"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/billing/create">
                    <i className="bi bi-plus-circle me-2"></i> Create New Bill
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

        <BillsForm 
          billData={bill} 
          isViewMode={true} 
          isEditable={isEditable} 
          onCancelEdit={() => setIsEditable(false)}
          onSubmit={handleUpdate}
          isLoading={isSaving}
          patients={patients}
          appointments={appointments}
        />
      </CardContainer>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete bill <b>#{bill.code || "N/A"}</b>?
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

export default BillView;
