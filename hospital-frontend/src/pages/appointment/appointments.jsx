import React, { useState, useCallback, useEffect } from "react";
import { Table, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { Search, Plus, RotateCcw } from "lucide-react";
import { appointmentAPI, patientAPI, doctorAPI } from "../../services/api";
import useCRUD from "../../hooks/useCRUD";
import CardContainer from "../../components/CardContainer";

export default function Appointments({ search: topSearch = "" }) {
  const navigate = useNavigate();
  const { items, loading, reload } = useCRUD(useCallback(() => appointmentAPI.getAll(), []));
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pData, dData] = await Promise.all([
          patientAPI.getAll(),
          doctorAPI.getAll()
        ]);
        setPatients(pData);
        setDoctors(dData);
      } catch (e) {}
    };
    fetchData();
  }, []);

  const getPatientName = (id) => {
    const p = patients.find(x => String(x.id) === String(id));
    return p ? `${p.firstName} ${p.lastName}` : `ID: ${id}`;
  };

  const getDoctorName = (id) => {
    const d = doctors.find(x => String(x.id) === String(id));
    return d ? `Dr. ${d.firstName} ${d.lastName}` : `ID: ${id}`;
  };

  const handleSearch = (e) => setSearchKeyword(e.target.value);

  const filtered = items.filter(a => {
    const pName = getPatientName(a.patientId).toLowerCase();
    const dName = getDoctorName(a.doctorId).toLowerCase();
    const status = (a.status || a.appointmentStatus || "").toLowerCase();
    const search = searchKeyword.toLowerCase();
    const tSearch = topSearch.toLowerCase();
    
    const matchesSearch = !search ? true : (
      pName.includes(search) || dName.includes(search) || status.includes(search) ||
      (a.code || "").toLowerCase().includes(search)
    );
    
    const matchesTopSearch = !tSearch ? true : (
      pName.includes(tSearch) || dName.includes(tSearch) || status.includes(tSearch) ||
      (a.code || "").toLowerCase().includes(tSearch)
    );
    
    return matchesSearch && matchesTopSearch;
  });

  const resetFilters = () => {
    setSearchKeyword("");
    reload();
  };

  return (
    <CardContainer>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Appointments</h4>
          <p className="text-muted small mb-0">Schedule and manage medical consultations</p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <Button variant="link" className="p-0 text-dark text-decoration-none d-flex align-items-center gap-1" onClick={resetFilters}>
            <RotateCcw size={14}/> Reset
          </Button>
          <Button as={Link} to="/appointments/create" variant="primary" className="d-flex align-items-center gap-1">
            <Plus size={16}/> Schedule New
          </Button>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div style={{ maxWidth: "400px", width: "100%" }}>
          <InputGroup size="sm">
            <InputGroup.Text className="bg-white border-end-0">
              <Search size={14} className="text-muted"/>
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by patient, doctor or status..."
              className="border-start-0"
              value={searchKeyword}
              onChange={handleSearch}
            />
          </InputGroup>
        </div>
      </div>

      <div className="table-responsive">
        <Table hover className="align-middle">
          <thead className="bg-light">
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-4">Loading appointments...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-4 text-muted">No appointments found.</td></tr>
            ) : filtered.map(a => {
              const currentStatus = a.status || a.appointmentStatus || "PENDING";
              return (
                <tr key={a.id}>
                  <td className="fw-bold text-primary">{a.code || "N/A"}</td>
                  <td><div className="fw-bold">{getPatientName(a.patientId)}</div></td>
                  <td>{getDoctorName(a.doctorId)}</td>
                  <td>
                    <div>{a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString() : "-"}</div>
                    <div className="small text-muted">{a.appointmentTime}</div>
                  </td>
                  <td>
                    <span className={`badge ${
                      currentStatus === "COMPLETED" ? "bg-success" : 
                      currentStatus === "SCHEDULED" ? "bg-primary" : "bg-danger"
                    }`}>
                      {currentStatus}
                    </span>
                  </td>
                  <td className="text-center">
                    <Button 
                      variant="link" 
                      className="p-0 text-primary me-2" 
                      onClick={() => navigate(`/appointments/${a.id}`)}
                      title="View & Edit"
                    >
                      <i className="bi bi-eye-fill fs-5"></i>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </CardContainer>
  );
}
