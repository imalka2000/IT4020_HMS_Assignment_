# Hospital Management System — Microservices Architecture

## IT4020 Modern Topics in IT — Assignment 2

\---

## Architecture Overview

```
                        ┌─────────────────────────────┐
   Client               │     API Gateway :8080        │
   Requests  ─────────► │  (Spring Cloud Gateway)      │
                        │  Single Entry Point          │
                        └────────────┬────────────────┘
                                     │ Routes traffic
              ┌──────────┬───────────┼──────────┬──────────┬──────────┐
              ▼          ▼           ▼          ▼          ▼          ▼
         Patient      Doctor    Appointment  Pharmacy   Billing    LabTest
         :8081        :8082       :8083       :8084      :8085      :8086
```

\---

## Services \& Team Contributions

|Service|Member|Port|Base Path|Gateway Path|
|-|-|-|-|-|
|Patient Service|Member 1|8081|/api/patients/\*\*|/gateway/patients/\*\*|
|Doctor Service|Member 2|8082|/api/doctors/\*\*|/gateway/doctors/\*\*|
|Appointment Service|Member 3|8083|/api/appointments/\*\*|/gateway/appointments/\*\*|
|Pharmacy Service|Member 4|8084|/api/medicines/\*\*|/gateway/medicines/\*\*|
|Billing Service|Member 5|8085|/api/invoices/\*\*|/gateway/invoices/\*\*|
|Lab Test Service|Member 6|8086|/api/labtests/\*\*|/gateway/labtests/\*\*|
|**API Gateway**|**All**|8080|–|–|

\---

## Folder Structure

```
hospital-microservices/
├── api-gateway/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/hospital/gateway/
│       │   └── ApiGatewayApplication.java
│       └── resources/
│           └── application.yml          ← All 6 route configs (shared by all members)
│
├── patient-service/          (IT22261946)
├── doctor-service/           (IT22082138)
├── appointment-service/      (IT22263094)
├── pharmacy-service/         (IT22073396)
├── billing-service/          (IT22138040)
├── labtest-service/          (IT22277190)
│
│   Each service follows the same structure:
│   └── src/main/
│       ├── java/com/hospital/<service>/
│       │   ├── <Service>Application.java
│       │   ├── model/
│       │   ├── repository/
│       │   ├── service/
│       │   └── controller/
│       └── resources/
│           └── application.properties
```

\---

## How to Run

### Step 1 — Build each service

```bash
cd patient-service    \&\& mvn clean package -DskipTests \&\& cd ..
cd doctor-service     \&\& mvn clean package -DskipTests \&\& cd ..
cd appointment-service \&\& mvn clean package -DskipTests \&\& cd ..
cd pharmacy-service   \&\& mvn clean package -DskipTests \&\& cd ..
cd billing-service    \&\& mvn clean package -DskipTests \&\& cd ..
cd labtest-service    \&\& mvn clean package -DskipTests \&\& cd ..
cd api-gateway        \&\& mvn clean package -DskipTests \&\& cd ..
```

### Step 2 — Run all services (open 7 terminals)

```bash
cd patient-service     \&\& mvn spring-boot:run   # Terminal 1
cd doctor-service      \&\& mvn spring-boot:run   # Terminal 2
cd appointment-service \&\& mvn spring-boot:run   # Terminal 3
cd pharmacy-service    \&\& mvn spring-boot:run   # Terminal 4
cd billing-service     \&\& mvn spring-boot:run   # Terminal 5
cd labtest-service     \&\& mvn spring-boot:run   # Terminal 6
cd api-gateway         \&\& mvn spring-boot:run   # Terminal 7 — start LAST
```

\---

## Swagger UI URLs

### Direct (Native) Access

|Service|Swagger URL|
|-|-|
|Patient Service|http://localhost:8081/swagger-ui.html|
|Doctor Service|http://localhost:8082/swagger-ui.html|
|Appointment Service|http://localhost:8083/swagger-ui.html|
|Pharmacy Service|http://localhost:8084/swagger-ui.html|
|Billing Service|http://localhost:8085/swagger-ui.html|
|Lab Test Service|http://localhost:8086/swagger-ui.html|

### Via API Gateway (Single Port — 8080)

```
http://localhost:8080/swagger-ui.html
```

Use the dropdown in the top-right corner to switch between services.

\---

## Gateway Route Examples

```
# Direct call to Patient Service:
GET http://localhost:8081/api/patients

# Same call via API Gateway (no port switching needed):
GET http://localhost:8080/gateway/patients

# Direct lab test:
POST http://localhost:8086/api/labtests

# Via gateway:
POST http://localhost:8080/gateway/labtests
```

\---

## Why API Gateway?

Without the gateway, clients must know and manage 6 different ports (8081–8086).
The API Gateway:

* Exposes a **single port (8080)** for all services
* Handles **URL rewriting** transparently
* Enables future addition of auth, rate limiting, logging at one place
* Aggregates all **Swagger docs** under one UI

