import React, { useState, useCallback } from "react";
import { Table, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { Search, Plus, RotateCcw } from "lucide-react";
import { pharmacyAPI } from "../../services/api";
import useCRUD from "../../hooks/useCRUD";
import CardContainer from "../../components/CardContainer";

export default function Pharmacy({ search: topSearch = "" }) {
  const navigate = useNavigate();
  const { items, loading, reload } = useCRUD(useCallback(() => pharmacyAPI.getAll(), []));
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = (e) => setSearchKeyword(e.target.value);

  const filtered = items.filter(m => 
    `${m.name} ${m.genericName} ${m.category} ${m.manufacturer}`.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    `${m.name} ${m.genericName} ${m.category} ${m.manufacturer}`.toLowerCase().includes(topSearch.toLowerCase())
  );

  const resetFilters = () => {
    setSearchKeyword("");
    reload();
  };

  return (
    <CardContainer>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Pharmacy Inventory</h4>
          <p className="text-muted small mb-0">Manage hospital medicines and stock levels</p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <Button variant="link" className="p-0 text-dark text-decoration-none d-flex align-items-center gap-1" onClick={resetFilters}>
            <RotateCcw size={14}/> Reset
          </Button>
          <Button as={Link} to="/pharmacy/create" variant="primary" className="d-flex align-items-center gap-1">
            <Plus size={16}/> Add Medicine
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
              placeholder="Search by name, generic name, category..."
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
              <th>Medicine</th>
              <th>Category</th>
              <th className="text-end">Price</th>
              <th className="text-center">Stock</th>
              <th>Expiry</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-4">Loading inventory...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-4 text-muted">No medicines found.</td></tr>
            ) : filtered.map(m => (
              <tr key={m.id}>
                <td className="fw-bold text-primary">#{m.id}</td>
                <td>
                  <div className="fw-bold">{m.name}</div>
                  <div className="text-muted small">{m.genericName || "Generic N/A"}</div>
                </td>
                <td><span className="badge bg-info text-dark opacity-75">{m.category}</span></td>
                <td className="text-end fw-bold text-success">Rs. {parseFloat(m.price).toFixed(2)}</td>
                <td className="text-center">
                  <span className={`fw-bold ${m.stockQuantity < 10 ? "text-danger" : "text-dark"}`}>
                    {m.stockQuantity}
                  </span>
                </td>
                <td>{new Date(m.expiryDate).toLocaleDateString()}</td>
                <td className="text-center">
                  <Button 
                    variant="link" 
                    className="p-0 text-primary me-2" 
                    onClick={() => navigate(`/pharmacy/${m.id}`)}
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
