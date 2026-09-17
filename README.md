# 🏛️ University Admission & Course Registration Portal

A full-stack, enterprise-grade **MERN** (MongoDB, Express.js, React, Node.js) system for managing university admissions, student dossier verification, dynamic course catalogs, capacity-managed registration with waitlist queues, timetable collision detection, prerequisite enforcement, and grading transcripts.

---

## 🏗️ Architecture Overview

The repository is structured into three dedicated, modular layers:

```
├── frontend/    # React 18 + Vite SPA with Glassmorphism UI & Role Portals
├── backend/     # Express.js REST API with JWT Auth, Multer & Business Engines
├── database/    # Mongoose Schemas, Seed Engines, Indexes & Test Suites
```

---

## 👥 Supported User Roles

1. **🎓 STUDENT**: Submit admission applications, upload identity proofs/marksheets, browse course catalogs, register with real-time timetable conflict checks, view waitlist positions, and inspect grading transcripts.
2. **🔬 FACULTY**: View enrolled student cohorts, manage assigned lecture schedules, and submit/publish student grades and remarks.
3. **📋 ADMISSION OFFICER**: Review submitted student admission dossiers, verify/reject uploaded identity documents, and update applicant statuses.
4. **🛡️ ADMIN**: Full administrative overview of user accounts, course configurations, enrollment quotas, and system health.

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally on `mongodb://127.0.0.1:27017`

### 2. Database Setup & Seeding
```bash
cd database
npm install
npm run seed      # Seeds 50 users, 4 courses, applications, documents, registrations, results
npm test          # Runs 27 automated database integrity and constraint tests
```

### 3. Backend Setup & Run
```bash
cd ../backend
npm install
npm start         # Runs Express API on http://localhost:5000
```

### 4. Frontend Setup & Run
```bash
cd ../frontend
npm install
npm run dev       # Runs Vite dev server on http://localhost:5173
```

---

## 🔑 Demo Accounts

All seeded accounts share the password: **`password123`**

| Role | Email | Name |
| :--- | :--- | :--- |
| **STUDENT** | `arif@example.com` | Arif Raza |
| **ADMISSION OFFICER** | `officer@example.com` | Priya Singh |
| **FACULTY** | `faculty@example.com` | Dr. Rahul Sharma |
| **ADMIN** | `admin@example.com` | System Admin |

---

## 📜 License
MIT License. Built with ❤️ by the University Portal Team.
