<div align="center">

<img src="https://img.shields.io/badge/Bangladesh-Zero--Trust%20EHR-00b4d8?style=for-the-badge&logo=shield&logoColor=white" alt="Project Banner"/>

# 🏥 Bangladesh Zero-Trust Electronic Health Record (EHR) System

**A production-grade, consent-first Electronic Health Record platform built for Bangladesh's healthcare infrastructure — powered by AI, secured by Zero-Trust architecture.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Frontend-00b4d8?style=for-the-badge&logo=vercel&logoColor=white)](https://zero-trust-ehr-bd.vercel.app)
[![API Status](https://img.shields.io/badge/API%20Status-Live-22c55e?style=for-the-badge&logo=express&logoColor=white)](https://zero-trust-ehr-api.vercel.app/health)
[![License](https://img.shields.io/badge/License-MIT-a855f7?style=for-the-badge)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)

</div>

---

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [🔒 What is Zero-Trust Architecture?](#-what-is-zero-trust-architecture)
- [✨ Core Features](#-core-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🗄️ Database Schema](#️-database-schema)
- [🔌 API Reference](#-api-reference)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started (Local Setup)](#-getting-started-local-setup)
- [⚙️ Environment Variables](#️-environment-variables)
- [☁️ Deployment Guide](#️-deployment-guide)
- [👤 User Roles & Workflows](#-user-roles--workflows)
- [🤖 AI Clinical Scribe — How It Works](#-ai-clinical-scribe--how-it-works)
- [🔐 Security Model](#-security-model)
- [🌐 Bilingual Support](#-bilingual-support)
- [🧪 Testing Credentials](#-testing-credentials)
- [🛠️ Tech Stack](#️-tech-stack)
- [🤝 Contributing](#-contributing)

---

## 🌟 Overview

The **Bangladesh Zero-Trust EHR** is a full-stack Electronic Health Record system designed specifically for the Bangladeshi healthcare context. It addresses a critical real-world problem: **how do you give a doctor access to a patient's medical record securely, while ensuring the patient always retains control over who sees their data?**

This system solves this with a **consent-first OTP gate** — a doctor cannot access any patient record without the patient physically providing a one-time password. Every access attempt, successful or not, is permanently logged in an immutable audit trail.

On top of this security layer, the system integrates a **Google Gemini AI Clinical Scribe** that can parse a doctor's unstructured handwritten-style notes and automatically update the patient's structured medical snapshot — saving time and eliminating transcription errors.

### Why Bangladesh-specific?

- **BMDC registration numbers** as doctor identifiers (Bangladesh Medical and Dental Council)
- **NID / Birth Certificate** as patient identity anchors
- Bangladesh-endemic disease flags: **Tuberculosis, Jaundice (Hepatitis E), Anemia**
- **Betel leaf (পান/জর্দা) chewing** habit tracking — a critical oral cancer risk factor
- **EPI (Expanded Programme on Immunization)** schedule tracking for vaccines like BCG, OPV, Pentavalent
- Fully bilingual: **English and Bengali (বাংলা)** UI

---

## 🔒 What is Zero-Trust Architecture?

> *"Never trust, always verify."*

Traditional EHR systems give doctors blanket access to patient records after a single login. Zero-Trust rejects this model. In this system:

| Traditional EHR | Zero-Trust EHR (This System) |
|---|---|
| Doctor logs in → sees all patient records | Doctor logs in → sees **no** patient records |
| Access based on job title | Access based on **explicit patient consent per session** |
| Access lasts indefinitely | Access window is **exactly 2 hours**, then auto-revoked |
| No audit of who viewed what | **Every action is logged** with timestamp and IP |
| Patient has no visibility | Patient can see the full access history |

### The Consent Flow (Step-by-Step)

```
1. Doctor searches for patient by URN
2. Doctor requests OTP → system generates 6-digit OTP
3. OTP is sent to the patient's registered mobile number
4. Patient physically gives the OTP to the doctor
5. Doctor enters OTP → system verifies & creates 2-hour Access Grant
6. Doctor can now view/edit records — access automatically expires after 2 hours
7. Every action in this window is logged to the Audit Trail
```

---

## ✨ Core Features

### 🔐 Security & Access Control
- **JWT Authentication** — Stateless, signed tokens (12-hour expiry) for both doctors and patients
- **OTP-Gated Record Access** — A cryptographically secure 6-digit OTP (bcrypt-hashed, never stored plaintext) is required before any doctor can view a patient record
- **Time-Limited Access Grants** — Each OTP verification creates a 2-hour access window; grants automatically expire and cannot be reused
- **OTP Replay Protection** — Each OTP is marked as `is_used=true` on first verification; subsequent use attempts are rejected
- **Role-Based Access Control (RBAC)** — Middleware enforces strict `doctor-only` and `patient-only` route protection
- **Rate Limiting** — 100 requests per 15 minutes per IP to prevent brute-force attacks
- **Helmet.js Security Headers** — XSS protection, content security policy, clickjacking prevention

### 🤖 AI Clinical Scribe (Google Gemini 2.5 Flash)
- **Natural Language Processing** — Paste raw clinical notes like *"Patient has TB, chews paan, started on Metformin 500mg OD, allergic to Penicillin"* and the AI automatically extracts structured data
- **Structured Data Extraction** — Identifies disease flags, lifestyle habits, medications, allergies, surgeries, and more
- **Array Deduplication** — New items are appended to existing arrays without creating duplicates
- **Bangla Medical Term Support** — The AI understands Bangla medical terminology (e.g., "TB" = Tuberculosis, "পান" = betel leaf)
- **Audit Logging** — Every AI scribe update is logged with the doctor's BMDC number
- **Graceful Error Handling** — Clear messages for API quota exhaustion, invalid keys, and unparseable notes

### 👨‍⚕️ Doctor Portal
- **BMDC Login** — Doctors authenticate with their Bangladesh Medical and Dental Council registration number
- **Patient URN Lookup** — Search for any patient using their unique Patient URN
- **OTP Request Flow** — Request OTP, see masked mobile number, and enter the received code — all in one guided UI
- **Complete Patient Dashboard** — View medical history, immunization records, test reports, and past prescriptions
- **AI Scribe Panel** — Type or paste clinical notes and let Gemini update the medical snapshot in real-time
- **Prescription Issuance** — Issue structured prescriptions with medication name, dose, frequency, duration, and follow-up dates
- **Report Upload** — Upload patient test reports (PDF/images stored as Base64)
- **Allergy Warning Banner** — Red alert banner shown when patient has known allergies on record
- **HIV High-Risk Banner** — Special warning shown for HIV-positive patients

### 🧑‍🤝‍🧑 Patient Portal
- **Secure Registration** — Register with NID (adults) or Birth Certificate (minors), mobile number, DOB, and blood group
- **Auto-URN Generation** — System automatically generates a unique Patient URN (format: cuid)
- **Patient Dashboard** — View personal medical snapshot, immunization history, uploaded reports, and prescriptions
- **Report Upload** — Patients can upload their own test reports (CBC, X-Ray, ECG, MRI, CT Scan, etc.)
- **Report Management** — View and delete uploaded reports
- **Prescription History** — See all prescriptions issued by doctors, including medication details and follow-up dates
- **Immunization Tracker** — View EPI vaccination schedule with COMPLETED / PENDING / OVERDUE status

### 📊 Medical Data Management
- **Medical Snapshot** — Comprehensive health profile per patient including:
  - Disease flags (Asthma, TB, HIV, Jaundice, Anemia, Diabetes)
  - Lifestyle data (Smoking, Alcohol, Betel Leaf, Cannabis) with NEVER / FORMER / CURRENT status
  - Chronic diseases, Genetic diseases, Major surgeries, Drug history, Allergies
- **Immunization Records** — Full EPI schedule tracking (BCG, OPV, Pentavalent, MR, COVID-19, etc.)
- **Test Reports** — 12 categorized report types: Blood CBC, Biochemistry, Urine, Stool, X-Ray, ECG, Ultrasound, CT Scan, MRI, Pathology, Microbiology, Other
- **Prescriptions** — Structured medication lists with diagnosis, clinical notes, and follow-up scheduling

### 📝 Audit Trail
- **Immutable Access Logs** — Every event is recorded:
  - `OTP_REQUESTED` — Doctor requested OTP
  - `OTP_VERIFIED` — OTP successfully entered
  - `OTP_FAILED` — Wrong OTP entered
  - `OTP_EXPIRED` — OTP not used within 10 minutes
  - `RECORD_VIEWED` — Doctor viewed patient data
  - `SCRIBE_UPDATED` — AI scribe ran and updated data
  - `PRESCRIPTION_CREATED` — Prescription issued
  - `ACCESS_REVOKED` — Patient revoked doctor's access

### 🌐 Bilingual UI (English & বাংলা)
- Full UI translation across all pages
- Language toggle persisted in `localStorage`
- One-click switch between English and Bangla
- All medical terms translated for patient accessibility

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   FRONTEND (Vite + React 18)                    │
│                      Deployed on Vercel                         │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │Landing Page │  │Doctor Portal │  │   Patient Portal     │  │
│  │    (/)      │  │ (/doctor/*)  │  │   (/patient/*)       │  │
│  └─────────────┘  └──────┬───────┘  └──────────┬────────────┘  │
│                           │                      │              │
│           ┌───────────────┘                      │              │
│           ▼                                      ▼              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │         Auth Context (JWT storage in localStorage)     │    │
│  └──────────────────────────┬─────────────────────────────┘    │
└─────────────────────────────│───────────────────────────────────┘
                              │ HTTPS / Axios
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (Express.js)                          │
│                Deployed on Vercel (Serverless)                  │
│                                                                 │
│  Middleware: Helmet → CORS → Rate Limit → JWT → RBAC → Grant   │
│                                                                 │
│  /auth/*          /otp/*           /patient/:urn/*              │
│  /clinical-note/analyze  → Google Gemini 2.5 Flash API         │
└───────────────────────────────┬─────────────────────────────────┘
                                │ Prisma ORM
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              DATABASE (PostgreSQL on Neon.tech)                 │
│                                                                 │
│  Doctor · Patient · PatientMedicalSnapshot · Immunization       │
│  TestReport · Prescription · OtpSession · AccessGrant          │
│  AccessLog                                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

The database uses **PostgreSQL** managed by **Neon.tech** and modeled with **Prisma ORM**.

### Entity Relationship Overview

```
Doctor (bmdc_number PK)
  └─── issues ──► Prescription
  └─── generates ──► AccessLog

Patient (patient_urn PK, cuid)
  └─── has one ──► PatientMedicalSnapshot
  └─── has many ──► Immunization
  └─── has many ──► TestReport
  └─── has many ──► Prescription
  └─── has many ──► OtpSession
  └─── has many ──► AccessLog

OtpSession ──► (verified) ──► AccessGrant (2hr window) ──► Protected Routes
```

### Key Models

| Model | Purpose |
|---|---|
| `Doctor` | Stores BMDC-registered doctors with hashed passwords |
| `Patient` | Stores patients identified by NID/Birth Cert + auto-URN |
| `PatientMedicalSnapshot` | 1-to-1 comprehensive health profile per patient |
| `Immunization` | EPI vaccination records per patient |
| `TestReport` | Uploaded lab/imaging reports (PDF/image as Base64) |
| `Prescription` | Structured prescriptions issued by doctors |
| `OtpSession` | Short-lived OTP sessions (10-minute TTL) |
| `AccessGrant` | 2-hour access windows created after OTP verification |
| `AccessLog` | Immutable audit trail of all access events |

### Enums

| Enum | Values |
|---|---|
| `BloodGroup` | A_POS, A_NEG, B_POS, B_NEG, AB_POS, AB_NEG, O_POS, O_NEG |
| `LifestyleStatus` | NEVER, FORMER, CURRENT |
| `ImmunizationStatus` | COMPLETED, PENDING, OVERDUE |
| `ReportType` | BLOOD_CBC, BLOOD_BIOCHEMISTRY, URINE_ROUTINE, STOOL_ROUTINE, XRAY, ECG, ULTRASOUND, CT_SCAN, MRI, PATHOLOGY, MICROBIOLOGY, OTHER |
| `AccessEvent` | OTP_REQUESTED, OTP_VERIFIED, OTP_FAILED, OTP_EXPIRED, RECORD_VIEWED, SCRIBE_UPDATED, PRESCRIPTION_CREATED, ACCESS_REVOKED |

---

## 🔌 API Reference

**Base URL (Production):** `https://zero-trust-ehr-api.vercel.app/api`  
**Base URL (Local):** `http://localhost:3001/api`

All protected routes require the header: `Authorization: Bearer <JWT_TOKEN>`

### Auth Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/doctor/login` | ❌ Public | Doctor login with BMDC number + password |
| `POST` | `/auth/patient/register` | ❌ Public | Register a new patient |
| `POST` | `/auth/patient/login` | ❌ Public | Patient login with URN + password |

**Doctor Login:**
```json
POST /api/auth/doctor/login
{
  "bmdc_number": "A-99999",
  "password": "doctor123"
}
```
```json
// Response 200
{
  "token": "<jwt>",
  "doctor": {
    "bmdc_number": "A-99999",
    "full_name": "Dr. Rahman",
    "specialty": "General Practice"
  }
}
```

**Patient Registration:**
```json
POST /api/auth/patient/register
{
  "nid_or_birth_cert": "1234567890123",
  "mobile_number": "+8801712345678",
  "password": "securepass",
  "full_name": "Fatima Khatun",
  "dob": "1990-05-15",
  "blood_group": "B_POS"
}
```
```json
// Response 201
{
  "token": "<jwt>",
  "patient": {
    "patient_urn": "cmox9eiqf0000qabwk6gh3eix",
    "full_name": "Fatima Khatun",
    "blood_group": "B_POS"
  }
}
```

### OTP Routes (Doctor Only)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/otp/request` | 🔒 Doctor | Request OTP for patient access |
| `POST` | `/otp/verify` | 🔒 Doctor | Verify OTP → creates 2-hour access grant |

**Request OTP:**
```json
POST /api/otp/request
Authorization: Bearer <doctor_token>
{ "patient_urn": "cmox9eiqf0000qabwk6gh3eix" }
```
```json
// Response 200
{
  "message": "OTP sent to patient's mobile",
  "patient_name": "Fatima Khatun",
  "mobile_masked": "*********2004",
  "demo_otp": "847291"
}
```

**Verify OTP:**
```json
POST /api/otp/verify
Authorization: Bearer <doctor_token>
{
  "patient_urn": "cmox9eiqf0000qabwk6gh3eix",
  "otp": "847291"
}
```
```json
// Response 200
{
  "message": "Access granted",
  "grant": {
    "patient_urn": "cmox9eiqf0000qabwk6gh3eix",
    "expires_at": "2026-09-19T03:00:00.000Z"
  }
}
```

### Patient Data Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/patient/:urn/snapshot` | 🔒 Doctor + Active Grant | Get full patient medical record |
| `GET` | `/my/dashboard` | 🔒 Patient | Patient views their own record |
| `POST` | `/patient/:urn/report` | 🔒 Doctor or Patient | Upload a test report |
| `DELETE` | `/patient/:urn/report/:id` | 🔒 Doctor or Patient | Delete a test report |

**Upload Report:**
```json
POST /api/patient/cmox9eiqf0000qabwk6gh3eix/report
Authorization: Bearer <token>
{
  "file_name": "blood_test_2026.pdf",
  "file_data": "<base64_encoded_file_content>",
  "report_type": "BLOOD_CBC",
  "test_date": "2026-09-15"
}
```

### AI Scribe Route (Doctor Only)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/clinical-note/analyze` | 🔒 Doctor | Parse clinical note with Gemini AI and update snapshot |

```json
POST /api/clinical-note/analyze
Authorization: Bearer <doctor_token>
{
  "patient_urn": "cmox9eiqf0000qabwk6gh3eix",
  "text": "Patient has Type 2 diabetes and hypertension. Chews paan daily. Started on Metformin 500mg OD and Amlodipine 5mg OD. Allergic to Penicillin. Had appendectomy in 2018."
}
```
```json
// Response 200
{
  "message": "Medical snapshot updated successfully",
  "ai_extracted": {
    "has_diabetes": true,
    "chews_betel_leaf": "CURRENT",
    "chronic_diseases_add": ["Hypertension"],
    "drug_history_add": ["Metformin 500mg OD", "Amlodipine 5mg OD"],
    "allergies_add": ["Penicillin"],
    "major_surgeries_add": ["Appendectomy 2018"]
  },
  "fields_updated": ["has_diabetes", "chews_betel_leaf", "chronic_diseases", "drug_history", "allergies", "major_surgeries"]
}
```

### Health Check

```
GET /health
```
```json
{ "status": "ok", "timestamp": "2026-09-19T00:00:00.000Z", "service": "ehr-api" }
```

---

## 📁 Project Structure

```
zero-trust-ehr-bangladesh/
│
├── README.md
├── .env.example                  ← Template for all required environment variables
├── ehr-schema.prisma             ← Full Prisma schema (reference copy at root)
├── .gitignore
│
├── backend/                      ← Express.js API Server
│   ├── server.js                 ← Entry point — middleware stack, routes, error handlers
│   ├── package.json
│   ├── vercel.json               ← Vercel serverless deployment config
│   ├── Procfile                  ← Heroku / Railway deployment config
│   │
│   ├── routes/
│   │   └── index.js              ← All API route definitions
│   │
│   ├── controllers/
│   │   ├── auth.controller.js    ← Doctor login, patient register & login
│   │   ├── otp.controller.js     ← OTP request & verification logic
│   │   └── ai-scribe.controller.js  ← Gemini AI clinical note analysis
│   │
│   ├── middleware/
│   │   └── auth.js               ← JWT auth, RBAC, AccessGrant verification
│   │
│   └── prisma/
│       ├── schema.prisma         ← Prisma schema (database models)
│       └── client.js             ← Prisma client singleton
│
├── frontend/                     ← React 18 + Vite Frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   ├── vercel.json
│   │
│   └── src/
│       ├── App.jsx               ← Root — route definitions & auth guards
│       ├── main.jsx              ← React DOM entry point
│       ├── index.css             ← Global styles & Tailwind directives
│       │
│       ├── api/                  ← Axios API client config
│       │
│       ├── context/
│       │   ├── AuthContext.jsx        ← JWT auth state management
│       │   └── LanguageContext.jsx    ← Bilingual (EN/BN) state management
│       │
│       ├── i18n/
│       │   └── dictionary.js          ← All English ↔ Bengali translations
│       │
│       ├── pages/
│       │   ├── LandingPage.jsx        ← Entry portal selection
│       │   ├── DoctorLogin.jsx        ← BMDC login form
│       │   ├── OtpGate.jsx            ← 2-step OTP consent flow
│       │   ├── PatientLogin.jsx       ← Patient login + registration
│       │   └── PatientDashboard.jsx   ← Patient's self-view health record
│       │
│       └── components/
│           ├── DoctorDashboard.jsx    ← Full doctor view with AI scribe
│           └── ReportUploadModal.jsx  ← Report upload interface
│
└── Screenshots/
    └── output/                   ← UI screenshots (10 pages captured)
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites

Ensure you have the following installed:

- **Node.js** ≥ 18.0 → [Download](https://nodejs.org)
- **npm** ≥ 9.0 (comes with Node.js)
- **Git** → [Download](https://git-scm.com)
- **A Neon.tech account** (free PostgreSQL) → [Sign up](https://neon.tech)
- **A Google AI Studio account** (free Gemini API key) → [Get key](https://aistudio.google.com/app/apikey)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/AZMSharif/Zero-Trust-EHR-Bangladesh.git
cd Zero-Trust-EHR-Bangladesh
```

### Step 2 — Setup the Backend

```bash
cd backend
npm install
```

Create your environment file:
```bash
# Windows
copy ..\.env.example .env

# Mac/Linux
cp ../.env.example .env
```

Edit `.env` with your actual credentials (see [Environment Variables](#️-environment-variables) below).

### Step 3 — Initialize the Database

```bash
# Push the Prisma schema to your Neon PostgreSQL database
npm run db:push

# Generate the Prisma client
npm run db:generate

# (Optional) Open Prisma Studio to browse/manage data
npm run db:studio
```

> **Note:** You need at least one Doctor record in the database to test the doctor flow. You can insert one manually via Prisma Studio. Use the test credentials listed in the [Testing Credentials](#-testing-credentials) section.

### Step 4 — Start the Backend Server

```bash
# Development mode (hot reload with nodemon)
npm run dev

# Production mode
npm start
```

The API runs at: **`http://localhost:3001`**

Verify it's live: `http://localhost:3001/health`

### Step 5 — Setup the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
```

Create the frontend environment file:
```bash
# Create frontend/.env
echo VITE_API_URL=http://localhost:3001/api > .env
```

### Step 6 — Start the Frontend

```bash
npm run dev
```

The app opens at: **`http://localhost:5173`**

### Step 7 — Test the Application

1. Open `http://localhost:5173`
2. Use the [Test Credentials](#-testing-credentials) provided below
3. Follow the [Doctor Workflow](#-user-roles--workflows) to explore all features

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
# ── Database (Neon PostgreSQL) ──
# Get from: https://neon.tech → Create Project → Connection String
DATABASE_URL="postgresql://USER:PASSWORD@HOST-pooler.REGION.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST.REGION.aws.neon.tech/neondb?sslmode=require"

# ── JWT Secret ──
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"

# ── Google Gemini AI ──
# Get from: https://aistudio.google.com/app/apikey (free tier available)
GEMINI_API_KEY="AIza..."

# ── CORS ──
# Development: http://localhost:5173
# Production: your Vercel frontend URL (comma-separated for multiple)
FRONTEND_URL="http://localhost:5173"

# ── Server ──
PORT=3001
NODE_ENV=development
```

### Frontend (`frontend/.env`)

```env
# Backend API URL
VITE_API_URL=http://localhost:3001/api
```

### Frontend Production (`frontend/.env.production`)

```env
VITE_API_URL=https://your-backend-name.vercel.app/api
```

---

## ☁️ Deployment Guide

Both services are configured for **Vercel** (zero-config deployment).

### Deploy the Backend

```bash
cd backend

# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Add environment variables via CLI or the Vercel dashboard
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production
vercel env add JWT_SECRET production
vercel env add GEMINI_API_KEY production
vercel env add FRONTEND_URL production   # Your frontend Vercel URL
vercel env add NODE_ENV production       # Set to: production
```

### Deploy the Frontend

```bash
cd frontend

# Deploy to Vercel
vercel --prod

# Add environment variable
vercel env add VITE_API_URL production   # Your backend Vercel URL + /api
```

### Alternative: Railway / Render

For non-Vercel deployment, the included `Procfile` is compatible with Railway and Render:

```
web: node server.js
```

Set the same environment variables in your Railway/Render service dashboard.

---

## 👤 User Roles & Workflows

### 👨‍⚕️ Doctor Workflow

```
1.  Visit the app → Click "Doctor Portal"
2.  Enter BMDC Number + Password → Click "Login"
3.  OTP Gate appears → Enter the patient's URN in the search box
4.  Click "Request OTP"
    - System generates a cryptographically secure 6-digit OTP
    - OTP is (in demo mode) shown on screen for testing
    - In production: OTP sent to patient's registered mobile number
5.  Patient receives OTP and reads it out to the doctor
6.  Doctor enters the OTP → Click "Verify OTP"
    - System verifies, marks OTP as used, creates 2-hour Access Grant
7.  Doctor Dashboard loads with the complete patient record:
    ├── Patient Info (name, blood group, DOB, URN, mobile)
    ├── Medical Snapshot (disease flags, lifestyle, allergies, medications)
    ├── Immunization Records (with COMPLETED/PENDING/OVERDUE badges)
    ├── Recent Test Reports (viewable, downloadable)
    ├── Prescription History (all past prescriptions)
    └── AI Clinical Scribe Panel + Prescription Issuer
8.  AI Scribe: Type/paste free-form clinical notes → Click "Analyze with AI"
    → Medical snapshot automatically updates in the database
9.  Prescription: Fill medication details → Click "Issue Prescription"
10. Report Upload: Click upload → Choose file + report type → Submit
11. Access automatically and silently expires after 2 hours
```

### 🧑‍🤝‍🧑 Patient Workflow

```
1.  Visit the app → Click "Patient Portal"
2.  New patient? → Click "Register as New Patient"
    → Fill NID or Birth Certificate, mobile number, full name, DOB, blood group
    → System creates account + auto-generates a unique Patient URN
    → SAVE YOUR URN — you need it every time you log in
3.  Existing patient? → Enter URN + Password → Click "Login"
4.  Patient Dashboard shows:
    ├── Personal Info (URN, blood group, DOB)
    ├── Medical Snapshot (view your health profile)
    ├── Immunization Records (EPI schedule status)
    ├── Test Reports (view, upload, delete your own reports)
    └── Prescription History (all prescriptions from doctors)
5.  Upload a Test Report:
    → Click the upload button
    → Choose file (PDF or image)
    → Select report type (CBC, X-Ray, ECG, etc.)
    → Submit
6.  When a doctor needs access:
    → Doctor requests OTP through their system
    → You receive a 6-digit OTP on your mobile
    → Read the OTP to the doctor — this grants them 2 hours of access
7.  After the session: the doctor's access automatically expires
```

---

## 🤖 AI Clinical Scribe — How It Works

The AI Clinical Scribe is powered by **Google Gemini 2.5 Flash** — Google's fastest reasoning model optimized for structured extraction tasks.

### Processing Pipeline

```
Doctor types raw clinical notes
          │
          ▼
POST /api/clinical-note/analyze
          │
          ▼
┌──────────────────────────────────────────────┐
│  Backend fetches existing PatientSnapshot    │
│  (to know what data is already there)        │
└──────────────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────────────┐
│  Gemini 2.5 Flash receives:                  │
│  - System prompt (Bangladesh EHR context)    │
│  - Doctor's raw note text                    │
│  Returns ONLY a valid JSON object            │
└──────────────────────────────────────────────┘
          │
          ▼
Backend validates & sanitizes the JSON
- Booleans validated as true/false
- Enums validated against NEVER/FORMER/CURRENT
- Arrays validated as string arrays
          │
          ▼
For BOOLEAN fields → overwrite with new value
For ENUM fields → overwrite with new value
For ARRAY fields → APPEND + deduplicate (no data lost)
          │
          ▼
PatientMedicalSnapshot updated in PostgreSQL
AccessLog entry created: SCRIBE_UPDATED
          │
          ▼
Response returned with ai_extracted + fields_updated
```

### Live Example

**Doctor types:**
> *"54yo male. Type 2 DM and HTN. Quit smoking in 2019. Chews paan daily. Appendectomy 2015. Allergic to sulfa. On Metformin 1g BD and Lisinopril 10mg OD."*

**AI extracts:**
```json
{
  "has_diabetes": true,
  "smoking_status": "FORMER",
  "chews_betel_leaf": "CURRENT",
  "chronic_diseases_add": ["Hypertension"],
  "major_surgeries_add": ["Appendectomy 2015"],
  "allergies_add": ["Sulfa drugs"],
  "drug_history_add": ["Metformin 1g BD", "Lisinopril 10mg OD"]
}
```

**Database result:** Patient snapshot updated. Previous data preserved. New data appended.

### Supported Extractions

| Category | Fields |
|---|---|
| Disease Flags | Asthma, Tuberculosis, HIV, Jaundice, Anemia, Diabetes |
| Lifestyle Status | Smoking, Alcohol, Betel Leaf, Cannabis (NEVER/FORMER/CURRENT) |
| Medications | Appended to `drug_history` |
| Allergies | Appended to `allergies` |
| Surgeries | Appended to `major_surgeries` |
| Chronic Conditions | Appended to `chronic_diseases` |
| Genetic Conditions | Appended to `genetic_diseases` |

---

## 🔐 Security Model

### Authentication Security
- JWT tokens signed with **HS256** using a secret key (min 32 chars recommended)
- **12-hour token expiry** — tokens automatically invalidate
- Token stored in browser `localStorage`
- `Authorization: Bearer <token>` required on all protected routes

### OTP Security
- Generated using **`crypto.randomInt()`** — cryptographically secure random numbers
- **bcrypt-hashed** before database storage (never stored as plaintext)
- **10-minute TTL** — expired OTPs rejected at the database query level
- **Single-use enforcement** — `is_used` flag set to `true` on first valid use
- Failed OTP attempts logged as `OTP_FAILED` events

### Access Grant Security
- Each successful OTP verification creates/refreshes an `AccessGrant` record
- **Hard 2-hour expiry** enforced by `expires_at` timestamp check on every request
- `verifyAccessGrant` middleware runs before every doctor→patient route
- `UNIQUE(patient_urn, doctor_bmdc)` constraint: only one grant per doctor-patient pair at a time
- Grant can be manually revoked (sets `is_revoked = true`)

### API Security Layers

```
Incoming Request
       │
       ▼  1. Helmet.js          Security headers (XSS, CSP, no-sniff, etc.)
       │
       ▼  2. CORS               Only allowed frontend origins accepted
       │
       ▼  3. Rate Limiter       100 requests per 15 minutes per IP
       │
       ▼  4. JWT Authentication Valid, non-expired token required
       │
       ▼  5. RBAC               doctorOnly or patientOnly role check
       │
       ▼  6. AccessGrant Check  Valid 2-hour grant required (doctor→patient routes only)
       │
       ▼  Route Handler         Business logic executes
```

### Password Security
- Patient passwords: bcrypt with **cost factor 12**
- OTP hashing: bcrypt with **cost factor 10** (faster for short-lived tokens)
- `password_hash` is always stripped from API responses before sending to client
- No plaintext passwords stored anywhere in the system

---

## 🌐 Bilingual Support

The entire UI supports **English** and **বাংলা (Bengali)** with instant, seamless switching.

### How It Works

1. All UI strings defined in `frontend/src/i18n/dictionary.js` as `{ en: "...", bn: "..." }` pairs
2. `LanguageContext` provides a `t(key)` function to all components
3. Language preference stored in `localStorage` under key `"ehr-lang"`
4. A single toggle button (top-right corner) switches between languages
5. No page reload required — instant UI update via React state

### Pages with Full Bilingual Coverage

| Page | EN | BN |
|---|---|---|
| Landing Page | ✅ | ✅ |
| Doctor Login | ✅ | ✅ |
| OTP Gate (all steps) | ✅ | ✅ |
| Doctor Dashboard | ✅ | ✅ |
| Patient Login & Registration | ✅ | ✅ |
| Patient Dashboard | ✅ | ✅ |
| Report Upload Modal | ✅ | ✅ |
| Error Messages & Alerts | ✅ | ✅ |

---

## 🧪 Testing Credentials

Use these to test the live demo or your local development instance:

### 👨‍⚕️ Doctor Account
| Field | Value |
|---|---|
| **BMDC Number** | `A-99999` |
| **Password** | `doctor123` |

### 🧑‍🤝‍🧑 Patient Account
| Field | Value |
|---|---|
| **Patient URN** | `cmox9eiqf0000qabwk6gh3eix` |
| **Password** | `patient123` |
| **Registered Mobile** | `+8801722222004` |

### Quick Test Walkthrough

```
1. Go to the app → Doctor Portal
2. Login: BMDC = A-99999 | Password = doctor123
3. Enter Patient URN: cmox9eiqf0000qabwk6gh3eix
4. Click "Request OTP" → note the OTP shown on screen (demo mode)
5. Enter the OTP → Click "Verify"
6. Explore the patient dashboard!
7. Try the AI Scribe — type a clinical note and click "Analyze with AI"
```

> **Demo Mode Note:** In this demo deployment, the OTP is returned in the API response and displayed on the UI so you can test without an SMS provider. In a real production deployment, this `demo_otp` field would be removed and the OTP would only be sent via SMS to the patient's mobile number.

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev) | 18.3.1 | UI component framework |
| [Vite](https://vitejs.dev) | 6.0.7 | Build tool & dev server |
| [React Router DOM](https://reactrouter.com) | 7.1.1 | Client-side routing + auth guards |
| [Tailwind CSS](https://tailwindcss.com) | 3.4.17 | Utility-first styling |
| [Axios](https://axios-http.com) | 1.16.0 | HTTP API client |
| [Lucide React](https://lucide.dev) | 0.469.0 | Icon library |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| [Node.js](https://nodejs.org) | ≥ 18 | JavaScript runtime |
| [Express.js](https://expressjs.com) | 4.21.2 | HTTP web framework |
| [Prisma](https://www.prisma.io) | 6.5.0 | Type-safe ORM & migrations |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | 2.4.3 | Password & OTP hashing |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | 9.0.2 | JWT signing & verification |
| [Helmet](https://helmetjs.github.io) | 8.0.0 | Security HTTP headers |
| [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) | 7.5.0 | API rate limiting |
| [multer](https://github.com/expressjs/multer) | 1.4.5 | File upload handling |
| [cors](https://github.com/expressjs/cors) | 2.8.5 | Cross-origin request handling |
| [dotenv](https://github.com/motdotla/dotenv) | 16.4.7 | Environment variable loading |

### AI & Infrastructure

| Service | Purpose |
|---|---|
| [Google Gemini 2.5 Flash](https://ai.google.dev) | Clinical NLP & structured data extraction |
| [PostgreSQL](https://www.postgresql.org) | Relational database |
| [Neon.tech](https://neon.tech) | Serverless PostgreSQL hosting |
| [Vercel](https://vercel.com) | Frontend + backend deployment (serverless) |

---

## 🤝 Contributing

Contributions are welcome and appreciated!

1. **Fork** this repository
2. **Create** your feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'feat: add SMS gateway integration'`
4. **Push** to your branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

### Ideas for Contribution

- 📱 **SMS Gateway** — Replace demo OTP with real SMS (Twilio, Bangladesh local providers)
- 📄 **PDF Prescription Generator** — Export prescriptions as printable PDFs
- 🔍 **Advanced Patient Search** — Search by name, NID, or mobile number
- 📈 **Doctor Analytics Dashboard** — Patient statistics and appointment tracking
- 🏥 **Multi-Doctor Practice Support** — Clinic/hospital-level access management
- 📊 **Export Records** — Export patient health record as PDF or CSV
- 🧪 **Automated Tests** — Jest/Vitest unit tests + Supertest API integration tests
- 🐳 **Docker Setup** — `docker-compose.yml` for one-command local dev environment
- 🔔 **Push Notifications** — Notify patients when a doctor requests access

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

**Built with ❤️ for Bangladesh's Healthcare System**

*"Secure health records. Patient-first access. AI-powered efficiency."*

[![GitHub](https://img.shields.io/badge/GitHub-AZMSharif-181717?style=for-the-badge&logo=github)](https://github.com/AZMSharif/Zero-Trust-EHR-Bangladesh)

</div>
