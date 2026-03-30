# MediCore HMS — React Frontend
## IT4020 Assignment 2 — Hospital Management System

### Setup & Run

```bash
# Install dependencies
npm install

# Start the React development server
npm start
# Opens at http://localhost:3000
```

### Prerequisites
Make sure all backend microservices are running first:
- API Gateway: http://localhost:8080  ← Frontend connects here
- Patient Service: http://localhost:8081
- Doctor Service:  http://localhost:8082
- Appointment:     http://localhost:8083
- Pharmacy:        http://localhost:8084
- Billing:         http://localhost:8085
- Lab Tests:       http://localhost:8086

### Pages
| Page         | Route          | Service           |
|--------------|----------------|-------------------|
| Dashboard    | /              | All services      |
| Patients     | /patients      | Patient Service   |
| Doctors      | /doctors       | Doctor Service    |
| Appointments | /appointments  | Appointment Svc   |
| Pharmacy     | /pharmacy      | Pharmacy Service  |
| Billing      | /billing       | Billing Service   |
| Lab Tests    | /labtests      | Lab Test Service  |

All API calls go through http://localhost:8080/gateway/...
