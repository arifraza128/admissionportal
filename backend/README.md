# Apex University Portal Backend API

Production-style Node.js / Express.js / MongoDB REST API for the **University Admission & Course Registration System**.

---

## 🛠 Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **File Uploads**: Multer
- **CORS & Environment**: CORS middleware, dotenv

---

## 🏗 Directory Structure

```
backend/
├── .env                       # Environment variables
├── package.json               # Dependencies & scripts
├── README.md                  # API documentation
├── uploads/                   # Local file storage for candidate documents
└── src/
    ├── server.js              # Express app & HTTP listener
    ├── config/
    │   └── db.js              # MongoDB connection
    ├── controllers/           # HTTP Request/Response handlers
    ├── middleware/            # JWT auth, RBAC guards, Multer upload & error handler
    ├── models/                # User, Application, Document, Course, Registration, Result
    ├── routes/                # Route definitions mounted under /api
    ├── services/              # Core business logic (Registration 9-Step engine, Prereqs, Conflicts)
    └── utils/                 # Time utilities, seed scripts & integration test suite
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Create or modify `.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/universityDB
JWT_SECRET=university_secret_key
CORS_ORIGIN=http://localhost:5173
```

### 3. Seed the Database
Pre-populates sample student, officer, faculty, and administrator profiles, along with official courses (CS301, ML301, CS401, CS320, CS450):
```bash
npm run seed
```

### 4. Start the Server
```bash
npm run dev
# or
npm start
```
Server runs at `http://localhost:5000` (API base: `http://localhost:5000/api`).

### 5. Run 18-Step Automated Integration Test Suite
```bash
npm run test:integration
```

---

## 📡 API Contract Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user (`name`, `email`, `password`, `role`) |
| `POST` | `/api/auth/login` | Public | Login with email & password, returns JWT token |
| `GET` | `/api/auth/users` | Admin / Officer | List user accounts |

### 📋 Admission Management (`/api/admission`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/admission/apply` | Student | Submit admission dossier (starts `PENDING`) |
| `GET` | `/api/admission/my-application` | Student | Retrieve own application status & notes |
| `GET` | `/api/admission/applications` | Officer / Admin | List all candidate applications |
| `GET` | `/api/admission/applications/:id` | Officer / Admin / Student | Get application details |
| `PUT` | `/api/admission/applications/:id/approve` | Officer / Admin | Approve student admission (`APPROVED`) |
| `PUT` | `/api/admission/applications/:id/reject` | Officer / Admin | Decline admission with notes (`REJECTED`) |

### 📂 Document Uploads (`/api/documents`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/documents/upload` | Student | Upload transcript/ID proof (Multer) |
| `GET` | `/api/documents` | Authenticated | List uploaded documents |
| `DELETE` | `/api/documents/:id` | Student / Admin | Remove document |

### 📚 Course Catalog (`/api/courses`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/courses` | Public / Auth | List courses with live enrolled count & available seats |
| `GET` | `/api/courses/:id` | Public / Auth | Get course details |
| `POST` | `/api/courses` | Admin | Create course with capacity, prerequisites & schedule |
| `PUT` | `/api/courses/:id` | Admin / Faculty | Update course |
| `DELETE` | `/api/courses/:id` | Admin | Delete course |

### 🎓 Course Registration (`/api/registrations`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/registrations` | Student | Register for course (Executes 9-step validation pipeline) |
| `GET` | `/api/registrations/my` | Student | List active enrolled & waitlisted subjects |
| `DELETE` | `/api/registrations/:id` | Student / Admin | Drop course registration |

### 📅 Timetable (`/api/timetable`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/timetable` | Student / Faculty / Admin | Get scheduled courses timetable matrix |

### 🏆 Academic Results (`/api/results`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/results` | Authenticated | Get student grades & transcript |
| `POST` | `/api/results` | Faculty / Admin | Publish course examination grade |
| `PUT` | `/api/results/:id` | Faculty / Admin | Update grade |

---

## ⚙️ Core Registration Business Rules

When `POST /api/registrations` is invoked with `{ "courseId": "..." }`, the backend executes the exact sequential validation:
1. **Authenticate**: Verify valid JWT Bearer token.
2. **Role Check**: Must possess `STUDENT` role.
3. **Admission Status**: Must have an `APPROVED` admission application.
4. **Course Exists**: Must exist in the catalog.
5. **Duplicate Check**: Must not be already `ENROLLED` or `WAITLISTED` for this subject.
6. **Prerequisites Check**: Must have completed all prerequisite subjects with a passing grade in the `Result` collection. If missing, returns HTTP 400 with `{ "status": "REJECTED", "reason": "Prerequisite <Name> has not been completed." }`.
7. **Timetable Conflict Check**: Collision detected if on the same day:
   $$\text{existing.start} < \text{new.end} \quad \text{AND} \quad \text{new.start} < \text{existing.end}$$
   If collision exists, returns HTTP 400 with `{ "status": "REJECTED", "reason": "Timetable conflict with <Course>." }`.
8. **Capacity Evaluation**:
   - If `enrolledCount < capacity` $\rightarrow$ creates `ENROLLED` record (HTTP 201).
   - If `enrolledCount >= capacity` $\rightarrow$ creates `WAITLISTED` record (HTTP 201).
