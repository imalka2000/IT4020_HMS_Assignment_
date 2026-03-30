import React, { useState, useCallback, useEffect } from "react";
import { Plus, Trash2, Receipt, CreditCard } from "lucide-react";
import { billingAPI, patientAPI, appointmentAPI } from "../services/api";
import useCRUD from "../hooks/useCRUD";

const EMPTY = { patientId:"", appointmentId:"", invoiceDate:"", consultationFee:"", medicineFee:"", labFee:"" };
const STATUS_MAP = { PENDING:"badge-orange", PAID:"badge-green", CANCELLED:"badge-red" };

export default function Billing({ search = "" }) {
  const { items, loading, error, reload } = useCRUD(useCallback(() => billingAPI.getAll(), []));
  const [modal, setModal]       = useState(false);
  const [payModal, setPayModal] = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [payMethod, setPayMethod] = useState("CASH");
  const [saving, setSaving]     = useState(false);
  const [err2, setErr2]         = useState(null);

  // Dropdown data
  const [patients,     setPatients]     = useState([]);
  const [allAppts,     setAllAppts]     = useState([]);
  const [filteredAppts, setFilteredAppts] = useState([]);

  useEffect(() => {
    patientAPI.getAll().then(setPatients).catch(() => {});
    appointmentAPI.getAll().then(setAllAppts).catch(() => {});
  }, []);

  // When patient selection changes, filter appointments and reset appointmentId
  const handlePatientChange = (e) => {
    const pid = e.target.value;
    setForm(p => ({ ...p, patientId: pid, appointmentId: "" }));
    if (pid) {
      setFilteredAppts(allAppts.filter(a => a.patientId === pid));
    } else {
      setFilteredAppts([]);
    }
  };

  const f = k => e => setForm(p => ({...p, [k]: e.target.value}));

  const save = async () => {
    setSaving(true); setErr2(null);
    try {
      await billingAPI.create({
        ...form,
        consultationFee: parseFloat(form.consultationFee) || 0,
        medicineFee:     parseFloat(form.medicineFee) || 0,
        labFee:          parseFloat(form.labFee) || 0
      });
      setModal(false); reload();
    } catch(e) { setErr2(e.message); } finally { setSaving(false); }
  };

  const markPaid = async () => {
    try { await billingAPI.markPaid(payModal, payMethod); setPayModal(null); reload(); } catch(e) { alert(e.message); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete invoice?")) return;
    try { await billingAPI.delete(id); reload(); } catch(e) { alert(e.message); }
  };

  // Helpers: resolve names for table
  const patientName = (pid) => {
    const p = patients.find(p => p.id === pid);
    return p ? `${p.firstName} ${p.lastName}` : `P-${pid}`;
  };

  const filtered = items.filter(i =>
    `${i.patientId} ${i.paymentStatus} ${i.invoiceDate}`.toLowerCase().includes(search.toLowerCase())
  );
  const totalRevenue = items.filter(i=>i.paymentStatus==="PAID").reduce((s,i)=>s+(i.totalAmount||0),0);

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Billing</h1><p className="page-sub">Invoice management and payment tracking</p></div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={()=>{setForm(EMPTY);setFilteredAppts([]);setErr2(null);setModal(true);}}><Plus size={14}/>New Invoice</button>
        </div>
      </div>

      <div style={{display:"flex",gap:12,marginBottom:18}}>
        {[["Total Revenue","Rs. "+totalRevenue.toFixed(2),"var(--green)"],["Pending",items.filter(i=>i.paymentStatus==="PENDING").length,"var(--orange)"],["Paid",items.filter(i=>i.paymentStatus==="PAID").length,"var(--green)"]].map(([l,v,c])=>(
          <div key={l} className="card" style={{padding:"14px 20px",flex:1}}>
            <div className="stat-card-accent" style={{background:c}}/>
            <div className="stat-label">{l}</div>
            <div style={{fontFamily:"Syne,sans-serif",fontSize:24,fontWeight:800,color:"var(--text-dark)",marginTop:4}}>{v}</div>
          </div>
        ))}
      </div>

      {error && <div className="error-banner">⚠ Cannot reach Billing Service — {error}</div>}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Patient</th><th>Appt</th><th>Date</th><th>Consult</th><th>Medicine</th><th>Lab</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={10}><div className="loading"><Receipt size={18}/>Loading…</div></td></tr>
              : filtered.length === 0 ? <tr><td colSpan={10}><div className="empty-state"><Receipt size={36} color="var(--text-muted)" style={{margin:"0 auto 10px"}}/><h3>No invoices</h3></div></td></tr>
              : filtered.map(inv => (
                <tr key={inv.id}>
                  <td className="td-mono">#{inv.id?.slice(-6)}</td>
                  <td style={{fontWeight:500}}>{patientName(inv.patientId)}</td>
                  <td className="td-mono">{inv.appointmentId ? `#${inv.appointmentId?.slice(-6)}` : "—"}</td>
                  <td style={{fontSize:12}}>{inv.invoiceDate}</td>
                  <td className="td-mono">Rs. {inv.consultationFee?.toFixed(2)}</td>
                  <td className="td-mono">Rs. {inv.medicineFee?.toFixed(2)}</td>
                  <td className="td-mono">Rs. {inv.labFee?.toFixed(2)}</td>
                  <td><strong style={{color:"var(--green-dk)",fontFamily:"monospace"}}>Rs. {inv.totalAmount?.toFixed(2)}</strong></td>
                  <td><span className={`badge ${STATUS_MAP[inv.paymentStatus]||"badge-grey"}`}>{inv.paymentStatus}</span></td>
                  <td><div className="actions-cell">
                    {inv.paymentStatus==="PENDING"&&<button className="btn btn-success btn-sm" onClick={()=>setPayModal(inv.id)}><CreditCard size={11}/>Pay</button>}
                    <button className="btn btn-danger btn-sm" onClick={()=>del(inv.id)}><Trash2 size={12}/></button>
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
            <div className="modal-header"><div className="modal-title">Generate Invoice</div><button className="modal-close" onClick={()=>setModal(false)}>×</button></div>
            {err2 && <div className="error-banner">{err2}</div>}
            <div className="form-grid">

              {/* Patient Dropdown */}
              <div className="form-group">
                <label>Patient</label>
                <select value={form.patientId} onChange={handlePatientChange}>
                  <option value="">— Select Patient —</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName}{p.dateOfBirth ? ` (${p.dateOfBirth})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Appointment Dropdown — filtered by selected patient */}
              <div className="form-group">
                <label>Appointment</label>
                <select value={form.appointmentId} onChange={f("appointmentId")} disabled={!form.patientId}>
                  <option value="">
                    {form.patientId
                      ? filteredAppts.length === 0 ? "No appointments for this patient" : "— Select Appointment —"
                      : "— Select a patient first —"}
                  </option>
                  {filteredAppts.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.appointmentDate} {a.appointmentTime} — {a.reason || "No reason"} [{a.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group"><label>Invoice Date</label><input type="date" value={form.invoiceDate} onChange={f("invoiceDate")}/></div>
              <div className="form-group"><label>Consultation Fee (Rs.)</label><input type="number" step="0.01" value={form.consultationFee} onChange={f("consultationFee")} placeholder="0.00"/></div>
              <div className="form-group"><label>Medicine Fee (Rs.)</label><input type="number" step="0.01" value={form.medicineFee} onChange={f("medicineFee")} placeholder="0.00"/></div>
              <div className="form-group"><label>Lab Fee (Rs.)</label><input type="number" step="0.01" value={form.labFee} onChange={f("labFee")} placeholder="0.00"/></div>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save} disabled={saving || !form.patientId}>{saving?"Creating…":"Create Invoice"}</button>
            </div>
          </div>
        </div>
      )}

      {payModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setPayModal(null)}>
          <div className="modal" style={{maxWidth:360}}>
            <div className="modal-header"><div className="modal-title">Record Payment</div><button className="modal-close" onClick={()=>setPayModal(null)}>×</button></div>
            <div className="form-group" style={{marginBottom:16}}>
              <label>Payment Method</label>
              <select value={payMethod} onChange={e=>setPayMethod(e.target.value)}><option>CASH</option><option>CARD</option><option>BANK_TRANSFER</option><option>INSURANCE</option></select>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={()=>setPayModal(null)}>Cancel</button>
              <button className="btn btn-success" onClick={markPaid}>Confirm Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
