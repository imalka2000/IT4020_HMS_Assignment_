import React, { useState, useCallback } from "react";
import { Plus, Edit2, Trash2, Stethoscope, CheckCircle, XCircle } from "lucide-react";
import { doctorAPI } from "../services/api";
import useCRUD from "../hooks/useCRUD";

const EMPTY = { firstName:"", lastName:"", specialization:"", email:"", phone:"", licenseNumber:"", department:"", available:true };

export default function Doctors({ search = "" }) {
  const { items, loading, error, reload } = useCRUD(useCallback(() => doctorAPI.getAll(), []));
  const [modal, setModal]   = useState(false);
  const [form, setForm]     = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [err2, setErr2]     = useState(null);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setErr2(null); setModal(true); };
  const openEdit = (d) => { setForm({...d}); setEditId(d.id); setErr2(null); setModal(true); };
  const close    = () => setModal(false);
  const f = k => e => setForm(p => ({...p, [k]: e.target.type==="checkbox"?e.target.checked:e.target.value}));

  const save = async () => {
    setSaving(true); setErr2(null);
    try {
      editId ? await doctorAPI.update(editId, form) : await doctorAPI.create(form);
      close(); reload();
    } catch(e) { setErr2(e.message); } finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!window.confirm("Remove this doctor?")) return;
    try { await doctorAPI.delete(id); reload(); } catch(e) { alert(e.message); }
  };

  const filtered = items.filter(d =>
    `${d.firstName} ${d.lastName} ${d.specialization} ${d.department}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Medical Staff</h1>
          <p className="page-sub">Doctor profiles and availability · {items.filter(d=>d.available).length} available now</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={openAdd}><Plus size={14}/>Add Doctor</button>
        </div>
      </div>

      {error && <div className="error-banner">⚠ Cannot reach Doctor Service — {error}</div>}

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Name</th><th>Specialization</th><th>Department</th><th>License</th><th>Phone</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8}><div className="loading"><Stethoscope size={18}/>Loading staff…</div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8}><div className="empty-state"><Stethoscope size={36} color="var(--text-muted)" style={{margin:"0 auto 10px"}}/><h3>No doctors found</h3></div></td></tr>
              ) : filtered.map(d => (
                <tr key={d.id}>
                  <td className="td-mono">{d.id}</td>
                  <td>
                    <div style={{fontWeight:700,color:"var(--text-dark)"}}>Dr. {d.firstName} {d.lastName}</div>
                    <div style={{fontSize:11,color:"var(--text-muted)"}}>{d.email}</div>
                  </td>
                  <td><span className="badge badge-blue">{d.specialization}</span></td>
                  <td style={{color:"var(--text-mid)"}}>{d.department}</td>
                  <td className="td-mono">{d.licenseNumber}</td>
                  <td className="td-mono">{d.phone}</td>
                  <td>
                    {d.available
                      ? <span className="badge badge-green"><CheckCircle size={10} style={{marginRight:3}}/>Available</span>
                      : <span className="badge badge-red"><XCircle size={10} style={{marginRight:3}}/>Unavailable</span>}
                  </td>
                  <td><div className="actions-cell">
                    <button className="btn btn-ghost btn-sm" onClick={()=>openEdit(d)}><Edit2 size={12}/>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>del(d.id)}><Trash2 size={12}/></button>
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
              <div className="modal-title">{editId?"Edit Doctor":"Add Doctor"}</div>
              <button className="modal-close" onClick={close}>×</button>
            </div>
            {err2 && <div className="error-banner">{err2}</div>}
            <div className="form-grid">
              <div className="form-group"><label>First Name</label><input value={form.firstName} onChange={f("firstName")}/></div>
              <div className="form-group"><label>Last Name</label><input value={form.lastName} onChange={f("lastName")}/></div>
              <div className="form-group"><label>Specialization</label><input value={form.specialization} onChange={f("specialization")} placeholder="e.g. Cardiology"/></div>
              <div className="form-group"><label>Department</label><input value={form.department} onChange={f("department")}/></div>
              <div className="form-group"><label>Email</label><input value={form.email} onChange={f("email")}/></div>
              <div className="form-group"><label>Phone</label><input value={form.phone} onChange={f("phone")}/></div>
              <div className="form-group full"><label>License Number</label><input value={form.licenseNumber} onChange={f("licenseNumber")}/></div>
              <div className="form-group full" style={{flexDirection:"row",alignItems:"center",gap:10}}>
                <input type="checkbox" id="avail" checked={form.available} onChange={f("available")} style={{width:"auto"}}/>
                <label htmlFor="avail" style={{textTransform:"none",fontSize:13,fontWeight:600}}>Available for appointments</label>
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={close}>Cancel</button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>{saving?"Saving…":"Save Doctor"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
