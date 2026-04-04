import React, { useState, useCallback } from "react";
import { Table, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { Search, Plus, RotateCcw } from "lucide-react";
import { patientAPI } from "../../services/api";
import useCRUD from "../../hooks/useCRUD";
import CardContainer from "../../components/CardContainer";

export default function Patients({ search: topSearch = "" }) {
  const navigate = useNavigate();
  const { items, loading, error, reload } = useCRUD(useCallback(() => patientAPI.getAll(), []));
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = (e) => setSearchKeyword(e.target.value);

  const filtered = items.filter(p => {
    const searchStr = `${p.firstName} ${p.lastName} ${p.email} ${p.phone} ${p.code || ""} ${p.id}`.toLowerCase();
    const matchesSearch = !searchKeyword ? true : searchStr.includes(searchKeyword.toLowerCase());
    const matchesTopSearch = !topSearch ? true : searchStr.includes(topSearch.toLowerCase());
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
          <h4 className="fw-bold mb-0">Patients</h4>
          <p className="text-muted small mb-0">Total registered patients: {items.length}</p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <Button variant="link" className="p-0 text-dark text-decoration-none d-flex align-items-center gap-1" onClick={resetFilters}>
            <RotateCcw size={14}/> Reset
          </Button>
          <Button as={Link} to="/patients/create" variant="primary" className="d-flex align-items-center gap-1">
            <Plus size={16}/> Register Patient
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
              placeholder="Search patients by name, email, phone or ID..."
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
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Blood</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-4">Loading patients...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-4 text-muted">No patients found.</td></tr>
            ) : filtered.map(p => (
              <tr key={p.id}>
                <td className="fw-bold text-primary">{p.code || "N/A"}</td>
                <td>
                  <div className="fw-bold">{p.firstName} {p.lastName}</div>
                  <div className="text-muted small">DOB: {p.dateOfBirth}</div>
                </td>
                <td>{p.email}</td>
                <td>{p.phone}</td>
                <td>{p.gender}</td>
                <td><span className="badge bg-danger opacity-75">{p.bloodGroup || "-"}</span></td>
                <td className="text-center">
                  <Button 
                    variant="link" 
                    className="p-0 text-primary me-2" 
                    onClick={() => navigate(`/patients/${p.id}`)}
                    title="View & Edit"
                  >
                    <i className="bi bi-eye-fill fs-5"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </CardContainer>
  );
}
