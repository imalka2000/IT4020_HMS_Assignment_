// Pharmacy.js
import React, { useState, useCallback } from "react";
import { Plus, Edit2, Trash2, Pill } from "lucide-react";
import { pharmacyAPI } from "../services/api";
import useCRUD from "../hooks/useCRUD";

const EMPTY = { name:"", genericName:"", category:"", manufacturer:"", price:"", stockQuantity:"", expiryDate:"", description:"" };

export default function Pharmacy({ search = "" }) {
  const { items, loading, error, reload } = useCRUD(useCallback(() => pharmacyAPI.getAll(), []));
  const [modal, setModal]   = useState(false);
  const [form, setForm]     = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [err2, setErr2]     = useState(null);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setErr2(null); setModal(true); };
  const openEdit = (m) => { setForm({...m}); setEditId(m.id); setErr2(null); setModal(true); };
  const close    = () => setModal(false);
  const f = k => e => setForm(p => ({...p, [k]: e.target.value}));

  const save = async () => {
    setSaving(true); setErr2(null);
    try {
      const payload = { ...form, price:parseFloat(form.price)||0, stockQuantity:parseInt(form.stockQuantity)||0 };
      editId ? await pharmacyAPI.update(editId, payload) : await pharmacyAPI.create(payload);
      close(); reload();
    } catch(e) { setErr2(e.message); } finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!window.confirm("Remove medicine?")) return;
    try { await pharmacyAPI.delete(id); reload(); } catch(e) { alert(e.message); }
  };

  const filtered = items.filter(m =>
    `${m.name} ${m.genericName} ${m.category} ${m.manufacturer}`.toLowerCase().includes(search.toLowerCase())
  );

  const stockBadge = qty => {
    if (qty <= 0)  return <span className="badge badge-red">Out of Stock</span>;
    if (qty <= 10) return <span className="badge badge-orange">{qty} units</span>;
    return <span className="badge badge-green">{qty} units</span>;
  };

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Pharmacy</h1><p className="page-sub">Medicine inventory management · {items.length} items</p></div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={openAdd}><Plus size={14}/>Add Medicine</button>
        </div>
      </div>
      {error && <div className="error-banner">⚠ Cannot reach Pharmacy Service — {error}</div>}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Generic</th><th>Category</th><th>Manufacturer</th><th>Price</th><th>Stock</th><th>Expiry</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={9}><div className="loading"><Pill size={18}/>Loading…</div></td></tr>
              : filtered.length === 0 ? <tr><td colSpan={9}><div className="empty-state"><Pill size={36} color="var(--text-muted)" style={{margin:"0 auto 10px"}}/><h3>No medicines</h3></div></td></tr>
              : filtered.map(m => (
                <tr key={m.id}>
                  <td className="td-mono">{m.id}</td>
                  <td><div style={{fontWeight:700,color:"var(--text-dark)"}}>{m.name}</div></td>
                  <td style={{color:"var(--text-muted)",fontSize:12}}>{m.genericName}</td>
                  <td><span className="badge badge-blue">{m.category}</span></td>
                  <td style={{color:"var(--text-mid)"}}>{m.manufacturer}</td>
                  <td className="td-mono">Rs. {m.price?.toFixed(2)}</td>
                  <td>{stockBadge(m.stockQuantity)}</td>
                  <td style={{color:"var(--text-mid)",fontSize:12}}>{m.expiryDate}</td>
                  <td><div className="actions-cell">
                    <button className="btn btn-ghost btn-sm" onClick={()=>openEdit(m)}><Edit2 size={12}/>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>del(m.id)}><Trash2 size={12}/></button>
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
            <div className="modal-header"><div className="modal-title">{editId?"Edit Medicine":"Add Medicine"}</div><button className="modal-close" onClick={close}>×</button></div>
            {err2 && <div className="error-banner">{err2}</div>}
            <div className="form-grid">
              <div className="form-group"><label>Name</label><input value={form.name} onChange={f("name")}/></div>
              <div className="form-group"><label>Generic Name</label><input value={form.genericName} onChange={f("genericName")}/></div>
              <div className="form-group"><label>Category</label><input value={form.category} onChange={f("category")} placeholder="e.g. Antibiotic"/></div>
              <div className="form-group"><label>Manufacturer</label><input value={form.manufacturer} onChange={f("manufacturer")}/></div>
              <div className="form-group"><label>Price (Rs.)</label><input type="number" value={form.price} onChange={f("price")}/></div>
              <div className="form-group"><label>Stock Quantity</label><input type="number" value={form.stockQuantity} onChange={f("stockQuantity")}/></div>
              <div className="form-group"><label>Expiry Date</label><input value={form.expiryDate} onChange={f("expiryDate")} placeholder="YYYY-MM-DD"/></div>
              <div className="form-group"><label>Description</label><input value={form.description} onChange={f("description")}/></div>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={close}>Cancel</button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>{saving?"Saving…":"Save Medicine"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
