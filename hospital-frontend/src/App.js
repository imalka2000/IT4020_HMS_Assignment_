import React, { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import {
  Users, Stethoscope, Calendar, Pill, Receipt,
  FlaskConical, LayoutDashboard, Search, Bell, Activity
} from "lucide-react";
import Dashboard    from "./pages/Dashboard";
import Patients     from "./patient/patients";
import PatientCreate from "./patient/patient-create";
import PatientView   from "./patient/patient-view";
import Doctors       from "./doctor/doctors";
import DoctorCreate  from "./doctor/doctor-create";
import DoctorView    from "./doctor/doctor-view";
import Appointments      from "./appointment/appointments";
import AppointmentCreate from "./appointment/appointment-create";
import AppointmentView   from "./appointment/appointment-view";
import Pharmacy      from "./pharmacy/pharmacy";
import PharmacyCreate from "./pharmacy/pharmacy-create";
import PharmacyView   from "./pharmacy/pharmacy-view";
import Billing      from "./billing/bills";
import BillCreate   from "./billing/bill-create";
import BillView     from "./billing/bill-view";
import LabTests      from "./labtest/labtests";
import LabTestCreate from "./labtest/labtest-create";
import LabTestView   from "./labtest/labtest-view";
import "./App.css";

const NAV = [
  { to: "/",             icon: LayoutDashboard, label: "Dashboard"    },
  { to: "/patients",     icon: Users,           label: "Patients"     },
  { to: "/appointments", icon: Calendar,        label: "Appointments" },
  { to: "/doctors",      icon: Stethoscope,     label: "Staff"        },
  { to: "/pharmacy",     icon: Pill,            label: "Pharmacy"     },
  { to: "/billing",      icon: Receipt,         label: "Billing"      },
  { to: "/labtests",     icon: FlaskConical,    label: "Lab Tests"    },
];

const PAGE_TITLES = {
  "/":             ["Dashboard",    "Overview of all hospital services"],
  "/patients":     ["Patients",     "Patient Service · localhost:8080/gateway/patients"],
  "/appointments": ["Appointments", "Appointment Service · localhost:8080/gateway/appointments"],
  "/doctors":      ["Staff",        "Doctor Service · localhost:8080/gateway/doctors"],
  "/pharmacy":     ["Pharmacy",     "Pharmacy Service · localhost:8080/gateway/medicines"],
  "/billing":      ["Billing",      "Billing Service · localhost:8080/gateway/invoices"],
  "/labtests":     ["Lab Tests",    "Lab Test Service · localhost:8080/gateway/labtests"],
};

export default function App() {
  const [search, setSearch] = useState("");

  return (
    <BrowserRouter>
      <AppInner search={search} setSearch={setSearch} />
    </BrowserRouter>
  );
}

function AppInner({ search, setSearch }) {
  const path = window.location.pathname;
  const [title, sub] = PAGE_TITLES[path] || PAGE_TITLES["/"];

  return (
    <div className="app-shell">
      {/* ── Sidebar (30% Blue) ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon" />
          <div>
            <span className="logo-text">MediCore</span>
            <span className="logo-sub">HMS · IT4020</span>
          </div>
        </div>

        <div className="sidebar-section">Main Menu</div>
        <nav className="sidebar-nav">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to} to={to} end={to === "/"}
              className={({ isActive }) => `nav-item ${isActive ? "nav-active" : ""}`}
            >
              <Icon size={17} className="nav-icon" />
              <span>{label}</span>
              <span className="nav-dot" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="gateway-pill">
            <div className="gw-dot" />
            <span className="gw-label">API Gateway</span>
            <span className="gw-port">:8080</span>
          </div>
        </div>
      </aside>

      {/* ── Topbar (30% Blue) ── */}
      <header className="topbar">
        <div className="topbar-left">
          <span className="topbar-title">{title}</span>
          <span className="topbar-sub">{sub}</span>
        </div>
        <div className="topbar-right">
          <div className="topbar-search">
            <Search size={13} color="rgba(255,255,255,0.6)" />
            <input
              placeholder="Search records…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="notif-btn">
            <Bell size={16} />
            <div className="notif-badge" />
          </button>
          <div className="topbar-avatar">AD</div>
        </div>
      </header>

      {/* ── Main (60% Sky) ── */}
      <main className="main-content">
        <Routes>
          <Route path="/"             element={<Dashboard />} />
          <Route path="/patients"     element={<Patients search={search} />} />
          <Route path="/patients/create" element={<PatientCreate />} />
          <Route path="/patients/:id"    element={<PatientView />} />
          <Route path="/doctors"      element={<Doctors search={search} />} />
          <Route path="/doctors/create" element={<DoctorCreate />} />
          <Route path="/doctors/:id"    element={<DoctorView />} />
          <Route path="/appointments" element={<Appointments search={search} />} />
          <Route path="/appointments/create" element={<AppointmentCreate />} />
          <Route path="/appointments/:id"    element={<AppointmentView />} />
          <Route path="/pharmacy"     element={<Pharmacy search={search} />} />
          <Route path="/pharmacy/create" element={<PharmacyCreate />} />
          <Route path="/pharmacy/:id"    element={<PharmacyView />} />
          <Route path="/billing"      element={<Billing search={search} />} />
          <Route path="/billing/create" element={<BillCreate />} />
          <Route path="/billing/:id"    element={<BillView />} />
          <Route path="/labtests"     element={<LabTests search={search} />} />
          <Route path="/labtests/create" element={<LabTestCreate />} />
          <Route path="/labtests/:id"    element={<LabTestView />} />
        </Routes>
      </main>
    </div>
  );
}
