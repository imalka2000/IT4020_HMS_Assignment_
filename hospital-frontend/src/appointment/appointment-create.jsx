import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { appointmentAPI, patientAPI, doctorAPI } from "../services/api";
import AppointmentForm from "./components/appointment-form";
import CardContainer from "../components/CardContainer";

const AppointmentCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pData, dData] = await Promise.all([
          patientAPI.getAll(),
          doctorAPI.getAll()
        ]);
        setPatients(pData);
        setDoctors(dData);
      } catch (error) {
        toast.error("Failed to load patient/doctor data");
      }
    };
    fetchData();
  }, []);

  const handleSave = async (data) => {
    setLoading(true);
    try {
      await appointmentAPI.create(data);
      toast.success("Appointment scheduled successfully");
      setTimeout(() => navigate("/appointments"), 1500);
    } catch (error) {
      toast.error(error.message || "Failed to schedule appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid mb-3">
        <h4 className="fw-bold px-2">Schedule New Appointment</h4>
      </div>
      <CardContainer>
        <AppointmentForm 
          patients={patients} 
          doctors={doctors}
          onSubmit={handleSave} 
          isLoading={loading} 
        />
      </CardContainer>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AppointmentCreate;
