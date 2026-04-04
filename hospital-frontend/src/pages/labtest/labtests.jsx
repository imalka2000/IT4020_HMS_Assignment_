import React, { useState, useCallback } from "react";
import { Table, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { Search, Plus, RotateCcw } from "lucide-react";
import { labAPI } from "../../services/api";
import useCRUD from "../../hooks/useCRUD";
import CardContainer from "../../components/CardContainer";

export default function LabTests({ search: topSearch = "" }) {
  const navigate = useNavigate();
  const { items, loading, reload } = useCRUD(useCallback(() => labAPI.getAll(), []));
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = (e) => setSearchKeyword(e.target.value);

  const filtered = items.filter(t => {
    const searchStr = `${t.testName} ${t.testCode} ${t.category} ${t.status} ${t.patientId}`.toLowerCase();
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
          <h4 className="fw-bold mb-0">Lab Test Orders</h4>
          <p className="text-muted small mb-0">Track and manage diagnostic test requests</p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <Button variant="link" className="p-0 text-dark text-decoration-none d-flex align-items-center gap-1" onClick={resetFilters}>
            <RotateCcw size={14}/> Reset
          </Button>
          <Button as={Link} to="/labtests/create" variant="primary" className="d-flex align-items-center gap-1">
            <Plus size={16}/> Order New Test
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
              placeholder="Search by name, code, patient ID or status..."
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
              <th>Test Info</th>
              <th>Category</th>
              <th>Patient</th>
              <th>Date</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-4">Loading tests...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-4 text-muted">No tests found.</td></tr>
            ) : filtered.map(t => (
              <tr key={t.id}>
                <td className="fw-bold text-primary">{t.testCode || "N/A"}</td>
                <td>
                  <div className="fw-bold">{t.testName}</div>
                </td>
                <td><span className="badge bg-secondary opacity-75">{t.category}</span></td>
                <td><span className="badge bg-info text-dark opacity-75">P-{t.patientId}</span></td>
                <td>{new Date(t.orderedDate).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${
                    t.status === "COMPLETED" ? "bg-success" : 
                    t.status === "PENDING" ? "bg-warning text-dark" : "bg-danger"
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="text-center">
                  <Button 
                    variant="link" 
                    className="p-0 text-primary me-2" 
                    onClick={() => navigate(`/labtests/${t.id}`)}
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
