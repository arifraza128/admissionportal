# Apex University | Admission & Course Registration Portal (Frontend)

An enterprise-grade, modern React frontend for the University Admission & Course Registration System (MERN Stack).

---

## 🌟 Tech Stack & Features

- **React 18** with **Vite 6**
- **React Router DOM v6** (Nested routes, layout guards, role-based protection)
- **Axios** (Centralized instance, automatic JWT Bearer token interceptor, smart mock fallback engine)
- **Context API** (`AuthContext` for JWT & session state, `ToastContext` for notifications)
- **Modern Responsive Design System** (Vanilla CSS variables, glassmorphism, responsive data tables, accessible modals, weekly timetable matrix)
- **Lucide React** for modern iconography

---

## 👥 Supported Roles & Dashboards

1. **STUDENT (`/student/*`)**:
   - `Dashboard`: Academic summary, GPA metrics, active term courses, admission milestone card.
   - `Admission Application`: Comprehensive multi-section form (`POST /admission/apply`).
   - `Upload Documents`: File dropzone for transcripts, ID, certificates (`POST /documents/upload`, `GET /documents`, `DELETE /documents/:id`).
   - `Application Status`: Real-time milestone tracker & committee feedback (`GET /admission/my-application`).
   - `Available Courses`: Searchable catalog with prerequisites & capacity (`GET /courses`).
   - `Course Registration`: Interactive registration engine with live backend response handling (`ENROLLED`, `WAITLISTED`, `PREREQUISITE FAILURE`, `TIMETABLE CONFLICT`, `DUPLICATE`) (`POST /registrations`, `DELETE /registrations/:id`).
   - `My Courses`: Enrolled subjects & drop options (`GET /registrations/my`).
   - `Timetable`: 5-day weekly schedule matrix with automatic conflict detection (`GET /timetable`).
   - `Results`: Grade transcript with CGPA and semester breakdown (`GET /results`).
   - `Profile`: Student profile and contact settings.

2. **ADMISSION OFFICER (`/officer/*`)**:
   - `Dashboard`: Total submissions, pending review count, acceptance rate.
   - `Application List`: Filterable queue by program/status (`GET /admission/applications`).
   - `Application Details`: Candidate dossier evaluation, document inspection, Approve/Reject decisions with reviewer notes (`PUT /admission/applications/:id/approve`, `PUT /admission/applications/:id/reject`).
   - `Document Review`: Central credential archive (`GET /documents`).

3. **FACULTY (`/faculty/*`)**:
   - `Dashboard`: Assigned courses overview, enrolled student counts, grading status.
   - `Assigned Courses`: Course catalog and lecture logistics (`GET /courses`).
   - `Student List`: Student attendance and marks roster.
   - `Enter / Update Results`: Spreadsheet-style grade entry terminal with auto GPA computation (`POST /results`, `PUT /results/:id`).

4. **ADMIN (`/admin/*`)**:
   - `Dashboard`: System health, active users, audit logs.
   - `Manage Users`: Account provisioning & role assignment (`POST /auth/register`).
   - `Manage Courses`: CRUD operations for curriculum subjects, prerequisites, capacity (`POST /courses`, `PUT /courses/:id`, `DELETE /courses/:id`).
   - `Manage Faculty`: Faculty workload and department allocations.
   - `Manage Timetable`: Master university timetable matrix.
   - `System Reports`: Enrollment analytics, capacity utilization, admission yield charts.

---

## 🚀 Getting Started

### 1. Installation
```bash
cd frontend
npm install
```

### 2. Environment Configuration
The `.env` file contains the API base URL:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```

---

## ⚡ Quick Demo Accounts

You can log in using the quick-fill profile buttons on the `/login` screen or use the interactive **Role Switcher** bar at the top of the screen:

| Role | Email | Password | Target Dashboard |
|---|---|---|---|
| **Student** | `arif@example.com` | `123456` | `/student/dashboard` |
| **Admission Officer** | `officer@example.com` | `123456` | `/officer/dashboard` |
| **Faculty** | `faculty@example.com` | `123456` | `/faculty/dashboard` |
| **Administrator** | `admin@example.com` | `123456` | `/admin/dashboard` |

---

## 📡 API Contract Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register new user account |
| `POST` | `/auth/login` | Sign in & receive JWT token |
| `POST` | `/admission/apply` | Submit admission application |
| `GET` | `/admission/my-application` | Get current student's application status |
| `GET` | `/admission/applications` | List all applications (Officer) |
| `GET` | `/admission/applications/:id` | Get specific application details |
| `PUT` | `/admission/applications/:id/approve` | Approve admission application |
| `PUT` | `/admission/applications/:id/reject` | Reject admission application |
| `POST` | `/documents/upload` | Upload supporting admission document |
| `GET` | `/documents` | List uploaded documents |
| `DELETE` | `/documents/:id` | Remove document |
| `GET` | `/courses` | List university courses |
| `GET` | `/courses/:id` | Get course details |
| `POST` | `/courses` | Create new course (Admin) |
| `PUT` | `/courses/:id` | Update course details (Admin) |
| `DELETE` | `/courses/:id` | Delete course (Admin) |
| `POST` | `/registrations` | Register for course (Student) |
| `GET` | `/registrations/my` | List enrolled courses (Student) |
| `DELETE` | `/registrations/:id` | Drop course registration |
| `GET` | `/timetable` | Get enrolled timetable schedule |
| `GET` | `/results` | Get academic grades and transcript |
| `POST` | `/results` | Submit semester grades (Faculty) |
| `PUT` | `/results/:id` | Update published grade (Faculty) |
