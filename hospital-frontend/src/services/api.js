const GATEWAY = "http://localhost:8080/gateway";
const api = async (method, path, data = null) => {
  const options = { method, headers: { "Content-Type": "application/json" } };
  if (data) options.body = JSON.stringify(data);
  const res = await fetch(`${GATEWAY}${path}`, options);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  if (res.status === 204) return null;
  return res.json();
};
export const patientAPI = {
  getAll: () => api("GET", "/patients"),
  getById: (id) => api("GET", `/patients/${id}`),
  create: (d) => api("POST", "/patients", d),
  update: (id, d) => api("PUT", `/patients/${id}`, d),
  delete: (id) => api("DELETE", `/patients/${id}`),
  search: (l) => api("GET", `/patients/search?lastName=${l}`),
};

export const doctorAPI = {
  getAll: () => api("GET", "/doctors"),
  getById: (id) => api("GET", `/doctors/${id}`),
  create: (d) => api("POST", "/doctors", d),
  update: (id, d) => api("PUT", `/doctors/${id}`, d),
  delete: (id) => api("DELETE", `/doctors/${id}`),
  available: () => api("GET", "/doctors/available"),
  bySpec: (s) => api("GET", `/doctors/specialization/${s}`),
};

export const appointmentAPI = {
  getAll: () => api("GET", "/appointments"),
  getById: (id) => api("GET", `/appointments/${id}`),
  create: (d) => api("POST", "/appointments", d),
  update: (id, d) => api("PUT", `/appointments/${id}`, d),
  delete: (id) => api("DELETE", `/appointments/${id}`),
  updateStatus: (id, s) =>
    api("PATCH", `/appointments/${id}/status?status=${s}`),
  byPatient: (p) => api("GET", `/appointments/patient/${p}`),
  byDoctor: (d) => api("GET", `/appointments/doctor/${d}`),
};
export const pharmacyAPI = {
  getAll: () => api("GET", "/medicines"),
  getById: (id) => api("GET", `/medicines/${id}`),
  create: (d) => api("POST", "/medicines", d),
  update: (id, d) => api("PUT", `/medicines/${id}`, d),
  delete: (id) => api("DELETE", `/medicines/${id}`),
  updateStock: (id, q) => api("PATCH", `/medicines/${id}/stock?quantity=${q}`),
  inStock: () => api("GET", "/medicines/in-stock"),
  byCategory: (c) => api("GET", `/medicines/category/${c}`),
  search: (n) => api("GET", `/medicines/search?name=${n}`),
};

export const billingAPI = {
  getAll: () => api("GET", "/invoices"),
  getById: (id) => api("GET", `/invoices/${id}`),
  create: (d) => api("POST", "/invoices", d),
  update: (id, d) => api("PUT", `/invoices/${id}`, d),
  delete: (id) => api("DELETE", `/invoices/${id}`),
  markPaid: (id, m) => api("PATCH", `/invoices/${id}/pay?paymentMethod=${m}`),
  byPatient: (p) => api("GET", `/invoices/patient/${p}`),
  byStatus: (s) => api("GET", `/invoices/status?status=${s}`),
};

export const labAPI = {
  getAll: () => api("GET", "/labtests"),
  getById: (id) => api("GET", `/labtests/${id}`),
  create: (d) => api("POST", "/labtests", d),
  update: (id, d) => api("PUT", `/labtests/${id}`, d),
  delete: (id) => api("DELETE", `/labtests/${id}`),
  submitResult: (id, r, n, dt) =>
    api(
      "PATCH",
      `/labtests/${id}/result?result=
    ${encodeURIComponent(r)}&notes=
    ${encodeURIComponent(n || "")}&completedDate=${dt}`,
    ),
  updateStatus: (id, s) => api("PATCH", `/labtests/${id}/status?status=${s}`),
  byPatient: (p) => api("GET", `/labtests/patient/${p}`),
  byCategory: (c) => api("GET", `/labtests/category/${c}`),
};
