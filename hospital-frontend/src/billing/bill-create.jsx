import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { billingAPI } from "../services/api";
import BillsForm from "./components/bills-form";
import CardContainer from "../components/CardContainer";

const BillCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSave = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        patientId: parseInt(data.patientId),
        appointmentId: data.appointmentId ? parseInt(data.appointmentId) : null,
        amount: parseFloat(data.amount)
      };
      await billingAPI.create(payload);
      toast.success("Bill created successfully");
      setTimeout(() => navigate("/billing"), 1500);
    } catch (error) {
      toast.error(error.message || "Failed to create bill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid mb-3">
        <h4 className="fw-bold px-2">Create New Bill</h4>
      </div>
      <CardContainer>
        <BillsForm onSubmit={handleSave} isLoading={loading} />
      </CardContainer>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default BillCreate;
