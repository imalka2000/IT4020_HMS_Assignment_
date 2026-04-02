import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { labAPI, patientAPI, doctorAPI } from "../../services/api";
import LabTestForm from "./components/labtest-form";
import CardContainer from "../../components/CardContainer";

const LabTestCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

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
        <LabTestForm 
          onSubmit={handleSave} 
          isLoading={loading} 
          patients={patients}
          doctors={doctors}
        />
      </CardContainer>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default LabTestCreate;
