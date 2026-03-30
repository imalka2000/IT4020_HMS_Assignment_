import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { doctorAPI } from "../../services/api";
import DoctorForm from "./components/doctor-form";
import CardContainer from "../../components/CardContainer";

const DoctorCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSave = async (data) => {
    setLoading(true);
    try {
      await doctorAPI.create(data);
      toast.success("Doctor added successfully");
      setTimeout(() => navigate("/doctors"), 1500);
    } catch (error) {
      toast.error(error.message || "Failed to add doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid mb-3">
        <h4 className="fw-bold px-2">Add New Doctor</h4>
      </div>
      <CardContainer>
        <DoctorForm onSubmit={handleSave} isLoading={loading} />
      </CardContainer>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default DoctorCreate;
