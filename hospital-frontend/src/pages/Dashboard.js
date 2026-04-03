import React, { useEffect, useState, useCallback } from "react";
import {
  Users,
  Stethoscope,
  Calendar,
  Pill,
  Receipt,
  FlaskConical,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  patientAPI,
  doctorAPI,
  appointmentAPI,
  pharmacyAPI,
  billingAPI,
  labAPI,
} from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [counts, setCounts] = useState({});
  const [appointments, setAppts] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.allSettled([
      patientAPI.getAll(),
      doctorAPI.getAll(),
      appointmentAPI.getAll(),
      pharmacyAPI.getAll(),
      billingAPI.getAll(),
      labAPI.getAll(),
    ]).then((results) => {
      const keys = [
        "patients",
        "doctors",
        "appointments",
        "medicines",
        "invoices",
        "labtests",
      ];
      const c = {};
      results.forEach((r, i) => {
        c[keys[i]] = r.status === "fulfilled" ? (r.value?.length ?? 0) : 0;
      });
      setCounts(c);
      if (results[2].status === "fulfilled") {
        setAppts((results[2].value || []).slice(0, 7));
      }
      if (results[0].status === "fulfilled") {
        setAllPatients(results[0].value || []);
      }
      if (results[1].status === "fulfilled") {
        setAllDoctors(results[1].value || []);
      }
      setLoading(false);
    });
  }, []);

  const stats = [
    {
      label: "Patients",
      value: counts.patients,
      icon: Users,
      accent: "var(--blue)",
      link: "/patients",
    },
    {
      label: "Appointments",
      value: counts.appointments,
      icon: Calendar,
      accent: "var(--orange)",
      link: "/appointments",
    },
    {
      label: "Staff",
      value: counts.doctors,
      icon: Stethoscope,
      accent: "var(--green)",
      link: "/doctors",
    },
    {
      label: "Medicines",
      value: counts.medicines,
      icon: Pill,
      accent: "var(--blue)",
      link: "/pharmacy",
    },
    {
      label: "Invoices",
      value: counts.invoices,
      icon: Receipt,
      accent: "var(--orange)",
      link: "/billing",
    },
    {
      label: "Lab Tests",
      value: counts.labtests,
      icon: FlaskConical,
      accent: "var(--green)",
      link: "/labtests",
    },
  ];

  const getPatientName = (id) => {
    const p = allPatients.find((x) => String(x.id) === String(id));
    return p ? `${p.firstName} ${p.lastName}` : `P-${id?.slice(-4) || "…"}`;
  };

  const getDoctorName = (id) => {
    const d = allDoctors.find((x) => String(x.id) === String(id));
    return d ? `Dr. ${d.firstName} ${d.lastName}` : `D-${id?.slice(-4) || "…"}`;
  };

  const statusBadge = (s) => {
    if (!s) return <span className="badge badge-grey">—</span>;
    const map = {
      SCHEDULED: "badge-blue",
      COMPLETED: "badge-green",
      CANCELLED: "badge-red",
    };
    return <span className={`badge ${map[s] || "badge-grey"}`}>{s}</span>;
  };

  return (
    <div>
      {/* ── Stat Grid ── */}
      <div className="stat-grid">
        {stats.map(({ label, value, icon: Icon, accent, link }) => (
          <div
            className="stat-card"
            key={label}
            style={{ "--accent": accent, cursor: "pointer" }}
            onClick={() => navigate(link)}
          >
            <div className="stat-card-accent" />
            <div className="stat-label">{label}</div>
            <div className="stat-value">{loading ? "…" : (value ?? 0)}</div>
            <div className="stat-sub">Total records</div>
            <div className="stat-icon">
              <Icon size={48} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Hospital Statistics (Charts) ── */}
      <div className="card mb-4" style={{ marginBottom: 20 }}>
        <div className="card-header border-0 bg-transparent">
          <div className="card-title" style={{ fontSize: 16 }}>
            Hospital Insights
          </div>
        </div>
        <div
          className="card-body"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 30,
            padding: "0 20px 25px",
          }}
        >
          {[
            {
              label: "Active Consultations",
              count: counts.appointments,
              total: counts.patients,
              color: "var(--orange)",
            },
            {
              label: "Lab Performance",
              count: counts.labtests,
              total: counts.appointments,
              color: "var(--green)",
            },
            {
              label: "Revenue Cycle",
              count: counts.invoices,
              total: counts.appointments,
              color: "var(--blue)",
            },
          ].map((stat) => {
            const perc = Math.min(
              100,
              Math.round((stat.count / (stat.total || 1)) * 100),
            );
            return (
              <div key={stat.label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <span>{stat.label}</span>
                  <span style={{ color: stat.color }}>{perc}%</span>
                </div>
                <div
                  style={{
                    height: 8,
                    background: "#f0f2f5",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${perc}%`,
                      height: "100%",
                      background: stat.color,
                      borderRadius: 10,
                      transition: "width 1s ease-in-out",
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 11,
                    color: "var(--text-muted)",
                  }}
                >
                  {stat.count} of {stat.total || 0} relative records
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: 18,
          alignItems: "start",
        }}
      >
        {/* Left: Today's Appointments table */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Today's Appointments</div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginTop: 2,
                  fontWeight: 500,
                }}
              >
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate("/appointments")}
            >
              <Plus size={13} /> Schedule New
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="loading">
                      <Clock size={16} />
                      Loading…
                    </td>
                  </tr>
                ) : appointments.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div
                        className="empty-state"
                        style={{ padding: "28px 16px" }}
                      >
                        <Calendar
                          size={28}
                          color="var(--text-muted)"
                          style={{ margin: "0 auto 8px" }}
                        />
                        <h3 style={{ fontSize: 14 }}>No appointments yet</h3>
                        <p style={{ fontSize: 12 }}>
                          Click "Schedule New" to add one.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  appointments.map((a) => (
                    <tr key={a.id}>
                      <td style={{ fontSize: 13, fontWeight: 600 }}>
                        {getPatientName(a.patientId)}
                      </td>
                      <td style={{ fontSize: 12, color: "var(--text-mid)" }}>
                        {getDoctorName(a.doctorId)}
                      </td>
                      <td style={{ fontSize: 12, fontWeight: 600 }}>
                        {a.appointmentTime || "—"}
                      </td>
                      <td
                        style={{
                          maxWidth: 160,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: "var(--text-mid)",
                        }}
                      >
                        {a.reason || "—"}
                      </td>
                      <td>{statusBadge(a.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column: Quick Actions + Doctor Availability */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Quick Actions (Orange = urgent, Blue = standard) */}
          <div>
            <div className="section-label">Quick Actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                className="action-card"
                onClick={() => navigate("/appointments")}
              >
                <Plus size={18} />
                Schedule New Appointment
              </div>
              <div
                className="action-card blue"
                onClick={() => navigate("/patients")}
              >
                <Users size={18} />
                Register New Patient
              </div>
              <div
                className="action-card green"
                onClick={() => navigate("/labtests")}
              >
                <FlaskConical size={18} />
                Order Lab Test
              </div>
            </div>
          </div>

          {/* Doctor Availability */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Doctor Availability</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {allDoctors.filter((d) => d.available).length} online
              </span>
            </div>
            <div className="card-body" style={{ padding: "10px 16px" }}>
              {loading ? (
                <div
                  style={{
                    padding: 16,
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: 13,
                  }}
                >
                  Loading…
                </div>
              ) : allDoctors.length === 0 ? (
                <div
                  style={{
                    padding: 12,
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: 12,
                  }}
                >
                  No doctors registered yet.
                </div>
              ) : (
                allDoctors.map((d) => (
                  <div
                    key={d.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 0",
                      borderBottom: "1px solid var(--sky)",
                    }}
                  >
                    <div
                      className={`avail-dot ${d.available ? "online" : "offline"}`}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--text-dark)",
                        }}
                      >
                        Dr. {d.firstName} {d.lastName}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {d.specialization}
                      </div>
                    </div>
                    {d.available ? (
                      <span className="badge badge-green">
                        <CheckCircle size={9} style={{ marginRight: 2 }} />
                        Free
                      </span>
                    ) : (
                      <span className="badge badge-grey">Busy</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending alerts */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Alerts</span>
              <AlertTriangle size={14} color="var(--orange)" />
            </div>
            <div className="card-body">
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div
                  style={{ display: "flex", gap: 8, alignItems: "flex-start" }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--orange)",
                      flexShrink: 0,
                      marginTop: 4,
                    }}
                  />
                  <span>Check pending invoices in Billing</span>
                </div>
                <div
                  style={{ display: "flex", gap: 8, alignItems: "flex-start" }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--orange)",
                      flexShrink: 0,
                      marginTop: 4,
                    }}
                  />
                  <span>Lab tests awaiting results</span>
                </div>
                <div
                  style={{ display: "flex", gap: 8, alignItems: "flex-start" }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--green)",
                      flexShrink: 0,
                      marginTop: 4,
                    }}
                  />
                  <span>All 6 microservices running via Gateway :8080</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
