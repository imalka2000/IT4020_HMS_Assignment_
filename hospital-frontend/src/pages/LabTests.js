import React, { useState, useCallback } from "react";
import { Plus, Trash2, FlaskConical, ClipboardCheck } from "lucide-react";
import { labAPI } from "../services/api";
import useCRUD from "../hooks/useCRUD";

const EMPTY = { patientId:"", doctorId:"", testName:"", testCode:"", category:"", orderedDate:"", normalRange:"" };
const CATS   = ["BLOOD","URINE","IMAGING","MICROBIOLOGY","PATHOLOGY","OTHER"];
const STATUS_MAP = { ORDERED:"badge-orange", IN_PROGRESS:"badge-blue", COMPLETED:"badge-green", CANCELLED:"badge-red" };

export default function LabTests({ search = "" }) {
  const { items, loading, error, reload } = useCRUD(useCallback(() => labAPI.getAll(), []));
  const [modal, setModal]         = useState(false);
  const [resultModal, setResult]  = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [resultForm, setResultForm] = useState({ result:"", notes:"", completedDate:"" });
  const [saving, setSaving]       = useState(false);
  const [err2, setErr2]           = useState(null);
  const f  = k => e => setForm(p => ({...p, [k]: e.target.value}));
  const rf = k => e => setResultForm(p => ({...p, [k]: e.target.value}));

  const save = async () => {
    setSaving(true); setErr2(null);
    try { await labAPI.create({ ...form, patientId:parseInt(form.patientId)||null, doctorId:parseInt(form.doctorId)||null }); setModal(false); reload(); }
    catch(e) { setErr2(e.message); } finally { setSaving(false); }
  };

  const submitResult = async () => {
    try { await labAPI.submitResult(resultModal, resultForm.result, resultForm.notes, resultForm.completedDate); setResult(null); setResultForm({result:"",notes:"",completedDate:""}); reload(); }
    catch(e) { alert(e.message); }
  };

  const del = async (id) => {
    if (!window.confirm("Cancel test?")) return;
    try { await labAPI.delete(id); reload(); } catch(e) { alert(e.message); }
  };

  const filtered = items.filter(t =>
    `${t.testName} ${t.category} ${t.patientId} ${t.status}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Lab Tests</h1><p className="page-sub">Test orders and results management · {items.filter(t=>t.status==="ORDERED").length} pending</p></div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={()=>{setForm(EMPTY);setErr2(null);setModal(true);}}><Plus size={14}/>Order Test</button>
        </div>
      </div>
      {error && <div className="error-banner">⚠ Cannot reach Lab Test Service — {error}</div>}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Test</th><th>Code</th><th>Category</th><th>Patient</th><th>Doctor</th><th>Ordered</th><th>Result</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={10}><div className="loading"><FlaskConical size={18}/>Loading…</div></td></tr>
              : filtered.length === 0 ? <tr><td colSpan={10}><div className="empty-state"><FlaskConical size={36} color="var(--text-muted)" style={{margin:"0 auto 10px"}}/><h3>No lab tests</h3><p>Click "Order Test" to add one.</p></div></td></tr>
              : filtered.map(t => (
                <tr key={t.id}>
                  <td className="td-mono">#{t.id}</td>
                  <td><div style={{fontWeight:600,color:"var(--text-dark)"}}>{t.testName}</div></td>
                  <td><span className="badge badge-grey">{t.testCode}</span></td>
                  <td><span className="badge badge-blue">{t.category}</span></td>
                  <td className="td-mono">P-{t.patientId}</td>
                  <td className="td-mono">D-{t.doctorId}</td>
                  <td style={{fontSize:12,color:"var(--text-mid)"}}>{t.orderedDate}</td>
                  <td style={{maxWidth:130,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:12,color:t.result?"var(--text-dark)":"var(--text-muted)"}}>{t.result||"Pending…"}</td>
                  <td><span className={`badge ${STATUS_MAP[t.status]||"badge-grey"}`}>{t.status}</span></td>
                  <td><div className="actions-cell">
                    {(t.status==="ORDERED"||t.status==="IN_PROGRESS") && <button className="btn btn-success btn-sm" onClick={()=>{setResult(t.id);setResultForm({result:"",notes:"",completedDate:""});}}><ClipboardCheck size={11}/>Result</button>}
                    <button className="btn btn-danger btn-sm" onClick={()=>del(t.id)}><Trash2 size={12}/></button>
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
            <div className="modal-header"><div className="modal-title">Order Lab Test</div><button className="modal-close" onClick={()=>setModal(false)}>×</button></div>
            {err2 && <div className="error-banner">{err2}</div>}
            <div className="form-grid">
              <div className="form-group"><label>Test Name</label><input value={form.testName} onChange={f("testName")} placeholder="e.g. Complete Blood Count"/></div>
              <div className="form-group"><label>Test Code</label><input value={form.testCode} onChange={f("testCode")} placeholder="CBC-001"/></div>
              <div className="form-group"><label>Category</label><select value={form.category} onChange={f("category")}><option value="">Select…</option>{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
              <div className="form-group"><label>Ordered Date</label><input type="date" value={form.orderedDate} onChange={f("orderedDate")}/></div>
              <div className="form-group"><label>Patient ID</label><input type="number" value={form.patientId} onChange={f("patientId")}/></div>
              <div className="form-group"><label>Doctor ID</label><input type="number" value={form.doctorId} onChange={f("doctorId")}/></div>
              <div className="form-group full"><label>Normal Range</label><input value={form.normalRange} onChange={f("normalRange")} placeholder="e.g. 4.0–11.0 × 10³/µL"/></div>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>{saving?"Ordering…":"Order Test"}</button>
            </div>
          </div>
        </div>
      )}

      {resultModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setResult(null)}>
          <div className="modal" style={{maxWidth:420}}>
            <div className="modal-header"><div className="modal-title">Submit Test Result</div><button className="modal-close" onClick={()=>setResult(null)}>×</button></div>
            <div className="form-grid">
              <div className="form-group full"><label>Result</label><input value={resultForm.result} onChange={rf("result")} placeholder="e.g. 8.5 × 10³/µL — Normal"/></div>
              <div className="form-group"><label>Completed Date</label><input type="date" value={resultForm.completedDate} onChange={rf("completedDate")}/></div>
              <div className="form-group full"><label>Technician Notes</label><textarea value={resultForm.notes} onChange={rf("notes")} rows={3}/></div>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={()=>setResult(null)}>Cancel</button>
              <button className="btn btn-success" onClick={submitResult}>Submit Result</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
