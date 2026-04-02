import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Dropdown, Row, Col, Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { labAPI } from "../../services/api";
import LabTestForm from "./components/labtest-form";
import CardContainer from "../../components/CardContainer";

const LabTestView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchTest();
  }, [id]);

  const fetchTest = async () => {
    setLoading(true);
    try {
      const data = await labAPI.getById(id);
      setTest(data);
    } catch (error) {
      toast.error("Failed to load test details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setIsSaving(true);
    try {
      await labAPI.update(id, data);
      toast.success("Test updated successfully");
      setIsEditable(false);
      fetchTest();
    } catch (error) {
      toast.error("Failed to update test");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await labAPI.delete(id);
      toast.success("Test deleted successfully");
      navigate("/labtests");
    } catch (error) {
      toast.error("Failed to delete test");
      setShowDeleteModal(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading test details...</div>;
  if (!test) return <div className="p-4 text-center">Test not found</div>;

  return (
    <>
      <CardContainer>
        <Row className="mb-3">
          <Col md={6}>
            <h4 className="fw-bold mt-2">{test.testName}</h4>
            <span className="text-muted small"><span className="fw-bold text-primary">#{test.testCode}</span> · {test.category}</span>
          </Col>
          <Col md={6} className="d-flex justify-content-end align-items-center">
            {!isEditable && (
              <Dropdown align="end">
                <Dropdown.Toggle variant="white" className="border-0 p-0 shadow-none">
                  <i className="bi bi-three-dots-vertical fs-5"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/labtests/create">
                    <i className="bi bi-plus-circle me-2"></i> Order New Test
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

        <LabTestForm 
          testData={test} 
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
          Are you sure you want to delete <b>{test.testName}</b>?
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

export default LabTestView;
