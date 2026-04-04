import React, { useState, useCallback } from "react";
import { Table, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { Search, Plus, RotateCcw } from "lucide-react";
import { billingAPI } from "../../services/api";
import useCRUD from "../../hooks/useCRUD";
import CardContainer from "../../components/CardContainer";

export default function Bills({ search: topSearch = "" }) {
  const navigate = useNavigate();
  const { items, loading, reload } = useCRUD(
    useCallback(() => billingAPI.getAll(), []),
  );
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = (e) => setSearchKeyword(e.target.value);

  const filtered = items.filter((b) => {
    const searchStr = `${b.code || ""} ${b.patientId} ${b.appointmentId} ${b.paymentStatus} ${b.paymentMethod}`.toLowerCase();
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
          <h4 className="fw-bold mb-0">Bills</h4>
          <p className="text-muted small mb-0">
            Manage hospital invoices and payments
          </p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <Button
            variant="link"
            className="p-0 text-dark text-decoration-none d-flex align-items-center gap-1"
            onClick={resetFilters}
          >
            <RotateCcw size={14} /> Reset
          </Button>
          <Button
            as={Link}
            to="/billing/create"
            variant="primary"
            className="d-flex align-items-center gap-1"
          >
            <Plus size={16} /> Create New Bill
          </Button>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div style={{ maxWidth: "300px", width: "100%" }}>
          <InputGroup size="sm">
            <InputGroup.Text className="bg-white border-end-0">
              <Search size={14} className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search bills..."
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
              <th>Appt.</th>
              <th className="text-end">Amount</th>
              <th>Date</th>
              <th>Method</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  Loading bills...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-muted">
                  No bills found.
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.id}>
                  <td className="fw-bold text-primary">
                    <Link
                      to={`/billing/${b.id}`}
                      className="text-decoration-none"
                    >
                      {b.code || "N/A"}
                    </Link>
                  </td>
                  <td>
                    <span className="badge bg-secondary opacity-75">
                      P-{b.patientId}
                    </span>
                  </td>
                  <td>
                    {b.appointmentId ? (
                      <span className="badge bg-info text-dark opacity-75">
                        A-{b.appointmentId}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="text-end fw-bold">
                    Rs. {parseFloat(b.totalAmount || 0).toFixed(2)}
                  </td>
                  <td>
                    {b.invoiceDate
                      ? new Date(b.invoiceDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <span className="small text-uppercase">
                      {b.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        b.paymentStatus === "PAID"
                          ? "bg-success"
                          : b.paymentStatus === "PENDING"
                            ? "bg-warning text-dark"
                            : "bg-danger"
                      }`}
                    >
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="text-center">
                    <Button
                      variant="link"
                      className="p-0 text-primary me-2"
                      onClick={() => navigate(`/billing/${b.id}`)}
                      title="View & Edit"
                    >
                      <i className="bi bi-eye-fill fs-5"></i>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </CardContainer>
  );
}
