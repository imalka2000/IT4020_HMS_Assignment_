# 🏥 MediCore Hospital Management System
## IT4020 Modern Topics in IT — Assignment 2 | SLIIT 2026

---

## 🎨 Design System: 60-30-10 Rule

| Role | Color | Usage |
|------|-------|-------|
| **60% Dominant** | `#E6F7F9` Clean Sky | Background, cards, content areas, table rows |
| **30% Secondary** | `#0077B6` Trust Blue | Sidebar, header, nav bar, primary UI chrome |
| **10% Accent 1** | `#FF9800` Action Orange | Primary action buttons, urgent alerts, CTA |
| **10% Accent 2** | `#4CAF50` Health Green | Confirmed status, success, available indicators |

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────────────────┐
│  React Frontend  │────▶│     API Gateway :8080         │
│  :3000           │     │  (Spring Cloud Gateway)       │
│  60-30-10 theme  │     │  Single entry point           │
└─────────────────┘     └──────┬───────────────────────┘
                                │ Route Rewriting
        ┌───────────┬───────────┼───────────┬───────────┬───────────┐
        ▼           ▼           ▼           ▼           ▼           ▼
   Patient      Doctor    Appointment  Pharmacy    Billing    LabTest
   :8081        :8082       :8083       :8084       :8085      :8086
   (Member 1)  (Member 2)  (Member 3)  (Member 4)  (Member 5) (Member 6)
```

---

## 🐳 Docker — One Command Startup

### Prerequisites
- Docker Desktop installed and running
- At least 4GB RAM allocated to Docker

### Run the entire stack
```bash
# From the project root (where docker-compose.yml is)
docker-compose up --build

# Or run in background
docker-compose up --build -d
```

### Stop everything
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f api-gateway
docker-compose logs -f patient-service
docker-compose logs -f frontend
```

### Access Points (after docker-compose up)
| Service | URL |
|---------|-----|
| 🖥️ **React Frontend** | http://localhost:3000 |
| 🔀 **API Gateway** | http://localhost:8080 |
| 📖 **Swagger UI (all services)** | http://localhost:8080/swagger-ui.html |
| 🧑‍⚕️ Patient Service direct | http://localhost:8081/swagger-ui.html |
| 👨‍⚕️ Doctor Service direct | http://localhost:8082/swagger-ui.html |
| 📅 Appointment Service direct | http://localhost:8083/swagger-ui.html |
| 💊 Pharmacy Service direct | http://localhost:8084/swagger-ui.html |
| 🧾 Billing Service direct | http://localhost:8085/swagger-ui.html |
| 🔬 Lab Test Service direct | http://localhost:8086/swagger-ui.html |

---

## 🚀 Run Without Docker (Development)

### Backend — 7 terminals
```bash
cd hospital-microservices/patient-service     && mvn spring-boot:run  # :8081
cd hospital-microservices/doctor-service      && mvn spring-boot:run  # :8082
cd hospital-microservices/appointment-service && mvn spring-boot:run  # :8083
cd hospital-microservices/pharmacy-service    && mvn spring-boot:run  # :8084
cd hospital-microservices/billing-service     && mvn spring-boot:run  # :8085
cd hospital-microservices/labtest-service     && mvn spring-boot:run  # :8086
cd hospital-microservices/api-gateway         && mvn spring-boot:run  # :8080 ← start LAST
```

### Frontend
```bash
cd hospital-frontend
npm install
npm start   # Opens http://localhost:3000
```

---

## 📁 Project Structure

```
project-root/
│
├── docker-compose.yml          ← ONE command to run everything
│
├── hospital-microservices/
│   ├── api-gateway/            ← All Members · Port 8080
│   │   ├── Dockerfile
│   │   └── src/main/resources/
│   │       ├── application.yml           (local dev)
│   │       └── application-docker.yml    (Docker — uses container hostnames)
│   │
│   ├── patient-service/        ← Member 1 · Port 8081
│   ├── doctor-service/         ← Member 2 · Port 8082
│   ├── appointment-service/    ← Member 3 · Port 8083
│   ├── pharmacy-service/       ← Member 4 · Port 8084
│   ├── billing-service/        ← Member 5 · Port 8085
│   └── labtest-service/        ← Member 6 · Port 8086
│       (each contains Dockerfile + pom.xml + src/)
│
└── hospital-frontend/          ← React App · Port 3000
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    └── src/
        ├── App.js              (Shell + Router)
        ├── App.css             (60-30-10 design tokens)
        ├── services/api.js     (All gateway API calls)
        ├── hooks/useCRUD.js    (Reusable data fetching)
        └── pages/
            ├── Dashboard.js    (Overview + appointments table + doctor availability)
            ├── Patients.js     (Member 1 — CRUD via gateway)
            ├── Doctors.js      (Member 2 — CRUD via gateway)
            ├── Appointments.js (Member 3 — CRUD + status via gateway)
            ├── Pharmacy.js     (Member 4 — CRUD + stock via gateway)
            ├── Billing.js      (Member 5 — invoices + payments via gateway)
            └── LabTests.js     (Member 6 — tests + results via gateway)
```

---

## 🔀 Gateway Route Map

| Browser/App calls | Gateway rewrites to |
|-------------------|---------------------|
| `:8080/gateway/patients/**` | `:8081/api/patients/**` |
| `:8080/gateway/doctors/**` | `:8082/api/doctors/**` |
| `:8080/gateway/appointments/**` | `:8083/api/appointments/**` |
| `:8080/gateway/medicines/**` | `:8084/api/medicines/**` |
| `:8080/gateway/invoices/**` | `:8085/api/invoices/**` |
| `:8080/gateway/labtests/**` | `:8086/api/labtests/**` |

**In Docker:** hostnames are container names (e.g. `patient-service:8081`)
**In dev:** hostnames are `localhost:8081`

---

## 👥 Team Contributions

| Member | Service | Port | Responsibility |
|--------|---------|------|---------------|
| Member 1 | Patient Service | 8081 | Patient model, CRUD endpoints, search, gateway route |
| Member 2 | Doctor Service | 8082 | Doctor model, CRUD, availability, specialization filter, gateway route |
| Member 3 | Appointment Service | 8083 | Appointment model, booking, status management, gateway route |
| Member 4 | Pharmacy Service | 8084 | Medicine inventory, stock updates, category filters, gateway route |
| Member 5 | Billing Service | 8085 | Invoice generation, payment tracking, gateway route |
| Member 6 | Lab Test Service | 8086 | Test ordering, result submission, category filters, gateway route |
| **All** | **API Gateway** | **8080** | **application.yml routing config, Swagger aggregation** |
