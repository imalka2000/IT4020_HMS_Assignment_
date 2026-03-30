import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { labAPI } from "../services/api";
import LabTestForm from "./components/labtest-form";
import CardContainer from "../components/CardContainer";

const LabTestCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSave = async (data) => {
    setLoading(true);
    try {
      await labAPI.create(data);
      toast.success("Lab test ordered successfully");
      setTimeout(() => navigate("/labtests"), 1500);
    } catch (error) {
      toast.error(error.message || "Failed to order lab test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid mb-3">
        <h4 className="fw-bold px-2">Order New Lab Test</h4>
      </div>
      <CardContainer>
        <LabTestForm onSubmit={handleSave} isLoading={loading} />
      </CardContainer>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default LabTestCreate;
