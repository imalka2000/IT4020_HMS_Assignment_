import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { patientAPI } from "../services/api";
import PatientForm from "./components/patient-form";
import CardContainer from "../components/CardContainer";

const PatientCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSave = async (data) => {
    setLoading(true);
    try {
      await patientAPI.create(data);
      toast.success("Patient registered successfully");
      setTimeout(() => navigate("/patients"), 1500);
    } catch (error) {
      toast.error(error.message || "Failed to register patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid mb-3">
        <h4 className="fw-bold px-2">Register New Patient</h4>
      </div>
      <CardContainer>
        <PatientForm onSubmit={handleSave} isLoading={loading} />
      </CardContainer>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default PatientCreate;
