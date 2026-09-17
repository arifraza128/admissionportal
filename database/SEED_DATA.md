# 🧪 Seed Data & Test Scenarios Specification

This document provides a complete inventory of the test datasets seeded into `universityDB`, deterministic ObjectId mappings, role login credentials, and step-by-step test verification scenarios.

---

## 🔑 Core System Actors & Credentials

All seeded accounts use the default password: **`password123`**.

| Role | Name | Email | Deterministic ObjectId | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **STUDENT** | Arif Raza | `arif@example.com` | `65a000000000000000010001` | Core student actor with complete dossier |
| **FACULTY** | Dr. Rahul Sharma | `rahul.sharma@example.com` | `65a000000000000000020001` | Assigned professor for CS301, ML301, CS401, CS302 |
| **FACULTY (Demo)** | Faculty Demo User | `faculty@example.com` | `65a000000000000000020002` | Quick demo faculty login |
| **ADMISSION_OFFICER** | Priya Singh | `priya.singh@example.com` | `65a000000000000000030001` | Evaluator for admission applications and documents |
| **ADMISSION_OFFICER (Demo)** | Admission Officer Demo | `officer@example.com` | `65a000000000000000030002` | Quick demo admission officer login |
| **ADMIN** | System Admin | `admin@example.com` | `65a000000000000000040001` | Full administrative supervisor |

> **Additional Students**:
> - `student2@example.com` (`65a000000000000000010002`) to `student45@example.com` (`65a00000000000000001002d`).
> - Provides a total cohort of 45 students for deep concurrency, pagination, and capacity testing.

---

## 📚 Course Catalog & Timetable Structure

| Code | Course Name | Capacity | Faculty | Prerequisites | Schedule Day | Time Slot | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CS301** | Database Systems | **40** | Dr. Rahul Sharma | *None* | Monday | 10:00 - 11:00 | **100% Filled** (40 enrolled, 2 waitlisted) |
| **ML301** | Machine Learning | **40** | Dr. Rahul Sharma | *None* | Monday | 10:30 - 11:30 | **Timetable collision** with CS301 |
| **CS401** | Adv Machine Learning | **40** | Dr. Rahul Sharma | `['ML301']` | Tuesday | 11:00 - 12:00 | **Requires ML301 completed** |
| **CS302** | Operating Systems | **40** | Dr. Rahul Sharma | *None* | Monday | 12:00 - 13:00 | Clean non-overlapping slot |

---

## 🎯 Verification Test Scenarios

### Scenario 1: Course Capacity & Waitlist Engine (40-Student Limit)
- **Subject Course**: `CS301` (Database Systems), Capacity = 40.
- **Seeded State**:
  - Exactly 40 students (`arif@example.com` + `student2@example.com` through `student40@example.com`) have status `ENROLLED`.
  - Student 41 (`student41@example.com`) has status `WAITLISTED` with `waitlistPosition: 1`.
  - Student 42 (`student42@example.com`) has status `WAITLISTED` with `waitlistPosition: 2`.
- **Expected Backend Behavior**:
  - When the 41st student requests registration, the backend spots `enrolledCount (40) >= capacity (40)` and automatically places the student on the waitlist with position 1.

---

### Scenario 2: Timetable Conflict Collision
- **Courses**:
  - `CS301`: Monday 10:00 – 11:00
  - `ML301`: Monday 10:30 – 11:30
- **Collision Formula**:
  $$\text{Overlap} \iff (\text{Day}_1 = \text{Day}_2) \land (\text{Start}_1 < \text{End}_2) \land (\text{Start}_2 < \text{End}_1)$$
  $$10:00 < 11:30 \ (\text{True}) \land 10:30 < 11:00 \ (\text{True}) \implies \mathbf{CONFLICT}$$
- **Seeded State**:
  - Student Arif Raza is enrolled in `CS301`.
- **Expected Backend Behavior**:
  - Attempting to register for `ML301` should trigger a 409 Conflict: *"Schedule overlap detected with CS301 on Monday 10:00-11:00"*.

---

### Scenario 3: Prerequisite Validation Engine
- **Subject Course**: `CS401` (Advanced Machine Learning).
- **Prerequisite Requirement**: `ML301` must be completed with a passing grade.
- **Seeded State**:
  - **Arif Raza (`arif@example.com`)**: Result record exists for `ML301` with `grade: 'A+'`, `status: 'COMPLETED'`.
  - **Student 41 (`student41@example.com`)**: No result record for `ML301`.
- **Expected Backend Behavior**:
  - Arif Raza can enroll in `CS401` without error.
  - Student 41 receives a 400 Bad Request: *"Prerequisite not satisfied: ML301 is required"*.

---

### Scenario 4: Admission Lifecycle & Document Verification
- **Approved Dossier (Arif Raza)**:
  - Application status: `APPROVED` (Program: Computer Science & Engineering, Aggregate: 92.5%).
  - Documents: Marksheet, Passport Photo, Aadhaar Card all set to `VERIFIED` by Priya Singh.
- **Pending Dossier (Student 2)**:
  - Application status: `PENDING` (Program: Information Technology).
  - Documents: Marksheet and Photo set to `PENDING`.
- **Rejected Dossier (Student 3)**:
  - Application status: `REJECTED` (`rejectionReason: Academic score is below the minimum program cut-off threshold (65.0%)`).
  - Document status: `REJECTED`.

---

## 🛠️ Executing Seed and Integrity Checks

```bash
# From the database directory:
cd database

# Execute complete clean seed
npm run seed

# Run verification test suite
npm test

# Purge database collections
npm run reset
```
