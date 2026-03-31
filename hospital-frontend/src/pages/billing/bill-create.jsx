import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { billingAPI, patientAPI, appointmentAPI } from "../../services/api";
import BillsForm from "./components/bills-form";
import CardContainer from "../../components/CardContainer";

const BillCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pData, aData] = await Promise.all([
          patientAPI.getAll(),
          appointmentAPI.getAll()
        ]);
        setPatients(pData);
        setAppointments(aData);
      } catch (error) {
        toast.error("Failed to load patient/appointment data");
      }
    };
    fetchData();
  }, []);

  const handleSave = async (data) => {
    setLoading(true);
    try {
      await billingAPI.create(data);
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
        <BillsForm 
          onSubmit={handleSave} 
          isLoading={loading} 
          patients={patients} 
          appointments={appointments} 
        />
      </CardContainer>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default BillCreate;
