# 🏛️ University Admission & Course Registration Database Module

This module contains the complete MongoDB database design, Mongoose schemas, indexes, deterministic seed datasets, and automated integrity validation scripts for the **University Admission & Course Registration System**.

---

## 📁 Module Architecture

```
database/
├── schemas/                    # Production-grade Mongoose Schema Definitions
│   ├── UserSchema.js          # Authentication & Role Tiering (STUDENT, FACULTY, ADMIN, OFFICER)
│   ├── ApplicationSchema.js   # Admission dossiers, qualifications & review status
│   ├── DocumentSchema.js      # Identity proofs & verification workflows
│   ├── CourseSchema.js        # Course catalog, capacity limits & lecture schedules
│   ├── RegistrationSchema.js  # Course enrollments, waitlist FIFO queues & drops
│   ├── ResultSchema.js        # Grades, transcripts & prerequisite checks
│   └── index.js               # Barrel exporter for Schemas & Mongoose Models
├── seed/                       # Deterministic Seed Datasets & Seeding Engine
│   ├── usersData.js           # 4 core role actors + 41 student records
│   ├── coursesData.js         # CS301 (cap:40), ML301 (overlap), CS401 (prereq), CS302
│   ├── applicationsData.js    # Approved, Pending, and Rejected admissions
│   ├── documentsData.js       # Verified and Pending identity & marksheet records
│   ├── registrationsData.js   # 40 enrolled in CS301, Student 41 waitlisted
│   ├── resultsData.js         # Completed prerequisites (ML301) & in-progress
│   └── seedAll.js             # Automated database seeding & index builder
├── scripts/                    # Maintenance & Verification Scripts
│   ├── resetDatabase.js       # Cleanly purges all 6 database collections
│   └── verifyDatabase.js      # 27 automated integrity & scenario tests
├── DATABASE_SCHEMA.md         # Full database schema, indexes & foreign key specs
├── SEED_DATA.md               # Seed inventory, credentials & test scenarios
├── .env                       # Database connection configuration
└── package.json               # Module dependencies and scripts
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
cd database
npm install
```

### 2. Environment Configuration
Ensure `.env` points to your running MongoDB instance:
```env
MONGO_URI=mongodb://127.0.0.1:27017/universityDB
```

### 3. Seed Database & Synchronize Indexes
```bash
npm run seed
```

### 4. Run Automated Database Verification Suite
```bash
npm test
```
*Executes 27 automated tests checking collection counts, foreign key integrity, 40-student capacity limit, timetable collision detection, prerequisite validation, and index health.*

### 5. Reset / Purge Database
```bash
npm run reset
```

---

## 👥 Default Login Accounts

All accounts use password: **`password123`**

| Role | Email | Name | Key Test Scenario |
| :--- | :--- | :--- | :--- |
| **STUDENT** | `arif@example.com` | Arif Raza | Approved admission, enrolled in CS301, completed ML301 |
| **FACULTY** | `rahul.sharma@example.com` | Dr. Rahul Sharma | Instructor for all CS & ML courses |
| **ADMISSION_OFFICER** | `priya.singh@example.com` | Priya Singh | Evaluates pending applications & documents |
| **ADMIN** | `admin@example.com` | System Admin | System-wide configuration & supervision |
| **STUDENT (Waitlist)** | `student41@example.com` | Student Forty One | Waitlisted #1 on CS301, missing ML301 prerequisite |

---

## 📑 Documentation Links
- Detailed Schemas and Indexes: [`DATABASE_SCHEMA.md`](file:///c:/Users/arif3/OneDrive/Videos/New%20folder/database/DATABASE_SCHEMA.md)
- Seed Data and Scenario Guides: [`SEED_DATA.md`](file:///c:/Users/arif3/OneDrive/Videos/New%20folder/database/SEED_DATA.md)
