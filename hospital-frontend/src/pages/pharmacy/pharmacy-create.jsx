import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { pharmacyAPI } from "../../services/api";
import PharmacyForm from "./components/pharmacy-form";
import CardContainer from "../../components/CardContainer";

const PharmacyCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSave = async (data) => {
    setLoading(true);
    try {
      await pharmacyAPI.create(data);
      toast.success("Medicine added successfully");
      setTimeout(() => navigate("/pharmacy"), 1500);
    } catch (error) {
      toast.error(error.message || "Failed to add medicine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid mb-3">
        <h4 className="fw-bold px-2">Add New Medicine</h4>
      </div>
      <CardContainer>
        <PharmacyForm onSubmit={handleSave} isLoading={loading} />
      </CardContainer>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default PharmacyCreate;
