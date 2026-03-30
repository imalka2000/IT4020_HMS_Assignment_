import React, { useState, useCallback } from "react";
import { Plus, Search, Edit2, Trash2, Users } from "lucide-react";
import { patientAPI } from "../services/api";
import useCRUD from "../hooks/useCRUD";

const EMPTY = { firstName:"", lastName:"", email:"", phone:"", dateOfBirth:"", gender:"", address:"", bloodGroup:"" };
const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

export default function Patients({ search = "" }) {
  const { items, loading, error, reload } = useCRUD(useCallback(() => patientAPI.getAll(), []));
  const [modal, setModal]   = useState(null);
  const [form, setForm]     = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [err2, setErr2]     = useState(null);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setErr2(null); setModal(true); };
  const openEdit = (p) => { setForm({...p}); setEditId(p.id); setErr2(null); setModal(true); };
  const close    = () => setModal(null);
  const f = k => e => setForm(p => ({...p, [k]: e.target.value}));

  const save = async () => {
    setSaving(true); setErr2(null);
    try {
      editId ? await patientAPI.update(editId, form) : await patientAPI.create(form);
      close(); reload();
    } catch(e) { setErr2(e.message); } finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this patient?")) return;
    try { await patientAPI.delete(id); reload(); } catch(e) { alert(e.message); }
  };

  const filtered = items.filter(p =>
    `${p.firstName} ${p.lastName} ${p.email} ${p.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  const genderColor = g => g === "Male" ? "badge-blue" : g === "Female" ? "badge-orange" : "badge-grey";

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Patients</h1>
          <p className="page-sub">Manage patient records · {filtered.length} of {items.length} shown</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={openAdd}><Plus size={14}/>New Patient</button>
        </div>
      </div>

      {error && <div className="error-banner">⚠ Cannot reach Patient Service — {error}</div>}

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>DOB</th><th>Gender</th><th>Blood</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8}><div className="loading"><Users size={18} />Loading patients…</div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8}><div className="empty-state"><Users size={36} color="var(--text-muted)" style={{margin:"0 auto 10px"}}/><h3>No patients found</h3><p>Register your first patient using the button above.</p></div></td></tr>
              ) : filtered.map(p => (
                <tr key={p.id}>
                  <td className="td-mono">{p.id}</td>
                  <td><div style={{fontWeight:600,color:"var(--text-dark)"}}>{p.firstName} {p.lastName}</div></td>
                  <td style={{color:"var(--text-mid)"}}>{p.email}</td>
                  <td className="td-mono">{p.phone}</td>
                  <td style={{color:"var(--text-mid)",fontSize:12}}>{p.dateOfBirth}</td>
                  <td>{p.gender && <span className={`badge ${genderColor(p.gender)}`}>{p.gender}</span>}</td>
                  <td>{p.bloodGroup && <span className="badge badge-grey">{p.bloodGroup}</span>}</td>
                  <td><div className="actions-cell">
                    <button className="btn btn-ghost btn-sm" onClick={()=>openEdit(p)}><Edit2 size={12}/>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>del(p.id)}><Trash2 size={12}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&close()}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{editId ? "Edit Patient" : "Register New Patient"}</div>
              <button className="modal-close" onClick={close}>×</button>
            </div>
            {err2 && <div className="error-banner">{err2}</div>}
            <div className="form-grid">
              <div className="form-group"><label>First Name</label><input value={form.firstName} onChange={f("firstName")} placeholder="John"/></div>
              <div className="form-group"><label>Last Name</label><input value={form.lastName} onChange={f("lastName")} placeholder="Smith"/></div>
              <div className="form-group"><label>Email</label><input value={form.email} onChange={f("email")} placeholder="john@email.com"/></div>
              <div className="form-group"><label>Phone</label><input value={form.phone} onChange={f("phone")} placeholder="+94 77 000 0000"/></div>
              <div className="form-group"><label>Date of Birth</label><input value={form.dateOfBirth} onChange={f("dateOfBirth")} placeholder="YYYY-MM-DD"/></div>
              <div className="form-group"><label>Gender</label>
                <select value={form.gender} onChange={f("gender")}><option value="">Select…</option><option>Male</option><option>Female</option><option>Other</option></select>
              </div>
              <div className="form-group"><label>Blood Group</label>
                <select value={form.bloodGroup} onChange={f("bloodGroup")}><option value="">Select…</option>{BLOOD_GROUPS.map(g=><option key={g}>{g}</option>)}</select>
              </div>
              <div className="form-group"><label>Address</label><input value={form.address} onChange={f("address")} placeholder="No. 1, Main Street"/></div>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={close}>Cancel</button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>{saving?"Saving…":"Save Patient"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
