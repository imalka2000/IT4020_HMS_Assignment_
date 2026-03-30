import React, { useState, useCallback } from "react";
import { Plus, Trash2, Calendar, CheckCircle, XCircle } from "lucide-react";
import { appointmentAPI } from "../services/api";
import useCRUD from "../hooks/useCRUD";

const EMPTY = { patientId:"", doctorId:"", appointmentDate:"", appointmentTime:"", reason:"", notes:"" };
const STATUS_MAP = { SCHEDULED:"badge-blue", COMPLETED:"badge-green", CANCELLED:"badge-red" };

export default function Appointments({ search = "" }) {
  const { items, loading, error, reload } = useCRUD(useCallback(() => appointmentAPI.getAll(), []));
  const [modal, setModal] = useState(false);
  const [form, setForm]   = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [err2, setErr2]     = useState(null);
  const f = k => e => setForm(p => ({...p, [k]: e.target.value}));

  const save = async () => {
    setSaving(true); setErr2(null);
    try { await appointmentAPI.create(form); setModal(false); reload(); }
    catch(e) { setErr2(e.message); } finally { setSaving(false); }
  };

  const changeStatus = async (id, status) => {
    try { await appointmentAPI.updateStatus(id, status); reload(); } catch(e) { alert(e.message); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete appointment?")) return;
    try { await appointmentAPI.delete(id); reload(); } catch(e) { alert(e.message); }
  };

  const filtered = items.filter(a =>
    `${a.patientId} ${a.doctorId} ${a.reason} ${a.appointmentDate} ${a.status}`.toLowerCase().includes(search.toLowerCase())
  );

  const counts = { SCHEDULED: items.filter(a=>a.status==="SCHEDULED").length, COMPLETED: items.filter(a=>a.status==="COMPLETED").length, CANCELLED: items.filter(a=>a.status==="CANCELLED").length };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="page-sub">Schedule and manage patient appointments</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={()=>{setForm(EMPTY);setErr2(null);setModal(true);}}><Plus size={14}/>Schedule New</button>
        </div>
      </div>

      {/* Mini stats */}
      <div style={{display:"flex",gap:12,marginBottom:18}}>
        {[["Scheduled",counts.SCHEDULED,"badge-blue"],["Completed",counts.COMPLETED,"badge-green"],["Cancelled",counts.CANCELLED,"badge-red"]].map(([l,v,cls])=>(
          <div key={l} className="card" style={{padding:"12px 18px",display:"flex",alignItems:"center",gap:10,flex:1}}>
            <span className={`badge ${cls}`}>{l}</span>
            <span style={{fontFamily:"Syne, sans-serif",fontSize:22,fontWeight:800,color:"var(--text-dark)"}}>{v}</span>
          </div>
        ))}
      </div>

      {error && <div className="error-banner">⚠ Cannot reach Appointment Service — {error}</div>}

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8}><div className="loading"><Calendar size={18}/>Loading…</div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8}><div className="empty-state"><Calendar size={36} color="var(--text-muted)" style={{margin:"0 auto 10px"}}/><h3>No appointments</h3><p>Click "Schedule New" to book one.</p></div></td></tr>
              ) : filtered.map(a => (
                <tr key={a.id}>
                  <td className="td-mono">#{a.id}</td>
                  <td className="td-mono">P-{a.patientId}</td>
                  <td className="td-mono">D-{a.doctorId}</td>
                  <td style={{fontWeight:600}}>{a.appointmentDate}</td>
                  <td style={{color:"var(--text-mid)",fontSize:12}}>{a.appointmentTime}</td>
                  <td style={{maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"var(--text-mid)"}}>{a.reason}</td>
                  <td><span className={`badge ${STATUS_MAP[a.status]||"badge-grey"}`}>{a.status}</span></td>
                  <td><div className="actions-cell">
                    {a.status === "SCHEDULED" && <>
                      <button className="btn btn-success btn-sm" onClick={()=>changeStatus(a.id,"COMPLETED")}><CheckCircle size={11}/>Done</button>
                      <button className="btn btn-danger btn-sm" onClick={()=>changeStatus(a.id,"CANCELLED")}><XCircle size={11}/></button>
                    </>}
                    <button className="btn btn-danger btn-sm" onClick={()=>del(a.id)}><Trash2 size={12}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Schedule New Appointment</div>
              <button className="modal-close" onClick={()=>setModal(false)}>×</button>
            </div>
            {err2 && <div className="error-banner">{err2}</div>}
            <div className="form-grid">
              <div className="form-group"><label>Patient ID</label><input type="number" value={form.patientId} onChange={f("patientId")} placeholder="e.g. 1"/></div>
              <div className="form-group"><label>Doctor ID</label><input type="number" value={form.doctorId} onChange={f("doctorId")} placeholder="e.g. 1"/></div>
              <div className="form-group"><label>Date</label><input type="date" value={form.appointmentDate} onChange={f("appointmentDate")}/></div>
              <div className="form-group"><label>Time</label><input type="time" value={form.appointmentTime} onChange={f("appointmentTime")}/></div>
              <div className="form-group full"><label>Reason</label><input value={form.reason} onChange={f("reason")} placeholder="Purpose of visit"/></div>
              <div className="form-group full"><label>Notes</label><textarea value={form.notes} onChange={f("notes")} rows={3} placeholder="Additional notes…"/></div>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>{saving?"Booking…":"Confirm Booking"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
