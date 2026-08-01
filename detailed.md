# KodetoCareer Platform — Comprehensive Project Documentation

> **Last Updated**: July 21, 2026  
> **Version**: 1.0.0  
> **Author**: Development Team  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & Technology Stack](#2-architecture--technology-stack)
3. [Project Structure](#3-project-structure)
4. [Backend API — Complete Breakdown](#4-backend-api--complete-breakdown)
   - [Server Entrypoint & Lifecycle](#41-server-entrypoint--lifecycle)
   - [Configuration Layer](#42-configuration-layer)
   - [Middleware Pipeline](#43-middleware-pipeline)
   - [Service Layer](#44-service-layer)
   - [API Modules & Endpoints](#45-api-modules--endpoints)
   - [Database Schema — Prisma ORM](#46-database-schema--prisma-orm)
   - [Background Job Queue](#47-background-job-queue)
5. [Frontend Web Admin — Complete Breakdown](#5-frontend-web-admin--complete-breakdown)
   - [Routing & Layout](#51-routing--layout)
   - [State Management](#52-state-management)
   - [Pages — Full List](#53-pages--full-list)
   - [Reusable Components](#54-reusable-components)
6. [Mobile Student App — Complete Breakdown](#6-mobile-student-app--complete-breakdown)
   - [App Shell & Navigation](#61-app-shell--navigation)
   - [Feature Modules](#62-feature-modules)
   - [Local Storage & Sync](#63-local-storage--sync)
7. [Authentication & Security](#7-authentication--security)
8. [Real-time Features — Socket.io](#8-real-time-features--socketio)
9. [Live Streaming — YouTube Low-Latency](#9-live-streaming--youtube-low-latency)
10. [Reporting & Analytics](#10-reporting--analytics)
11. [AI-Powered Features](#11-ai-powered-features)
12. [Communication Services](#12-communication-services)
13. [File Storage & CDN](#13-file-storage--cdn)
14. [Seeded Test Data](#14-seeded-test-data)
15. [Build & Verification Status](#15-build--verification-status)
16. [Future Improvements](#16-future-improvements)

---

## 1. Project Overview

**KodetoCareer (KTC)** is a full-stack **Training & Placement Management Platform** designed for educational institutions to manage their entire student training lifecycle — from course delivery and batch management to job placements and certificate generation.

The platform serves **five distinct user roles**:

| Role | Description | Access |
|------|-------------|--------|
| **SUPER_ADMIN** | Platform owner/operator | Full access to everything across all colleges |
| **COLLEGE_ADMIN** | Institution principal/coordinator | Scoped to their own college's data — students, reports, batches |
| **TRAINER** | Course instructor/faculty | Manages attendance, grading, live classes, content delivery |
| **STUDENT** | Learner/trainee | Accesses courses, quizzes, placements via mobile app |
| **RECRUITER** | Hiring partner/company | Searches student profiles, posts jobs, reviews candidates |

### Core Capabilities

- 🎓 **Learning Management System (LMS)** — Courses → Modules → Lessons → Videos/PDFs with sequential learning
- 📊 **Attendance & Session Management** — Class sessions, QR-based marking, per-student tracking
- 📝 **Quizzes & Assignments** — MCQ/True-False/Short-text quizzes with auto-grading, timed attempts, file-based assignments
- 🎖️ **Certificate Generation** — PDF certificate generation with QR codes and public verification URLs
- 💼 **Placement CRM** — Placement records, offer letters, verification, company-level analytics
- 💻 **Job Board** — Recruiters post opportunities, students express interest, application tracking
- 📱 **Native Mobile App** — Capacitor-based mobile app for students with offline caching
- 🔴 **Live Streaming** — YouTube Low-Latency live class broadcasts with real-time Q&A chat
- 💬 **Real-time Chat** — Socket.io powered instant messaging between all user types
- 📈 **Advanced Reporting** — CSV exports, email digests, executive summary reports

---

## 2. Architecture & Technology Stack

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTS                                   │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────┐    │
│  │ Web Admin    │   │ Mobile App   │   │ Recruiter Portal │    │
│  │ React + Vite │   │ Capacitor    │   │ React + Vite     │    │
│  │ TailwindCSS  │   │ React SPA    │   │ TailwindCSS      │    │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────────┘    │
│         │                  │                   │                 │
│         └──────────────────┼───────────────────┘                 │
│                            │                                     │
│                    REST API + Socket.io                           │
├────────────────────────────┼─────────────────────────────────────┤
│                     ┌──────▼───────┐                             │
│                     │  Express.js  │                             │
│                     │  Backend API │                             │
│                     └──────┬───────┘                             │
│                            │                                     │
│      ┌─────────┬───────────┼───────────┬──────────┐             │
│      ▼         ▼           ▼           ▼          ▼             │
│  ┌───────┐ ┌───────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐     │
│  │Prisma │ │ Redis │ │BullMQ   │ │Resend   │ │Cloudflare│     │
│  │+ PgSQL│ │Cache  │ │Job Queue│ │Email API│ │R2 Storage│     │
│  └───────┘ └───────┘ └─────────┘ └─────────┘ └──────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack — Detailed

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Backend Runtime** | Node.js + TypeScript | TS 5.4 | Type-safe server-side logic |
| **Web Framework** | Express.js | 4.18 | HTTP REST API routing |
| **ORM** | Prisma Client | 5.11 | Type-safe PostgreSQL query builder |
| **Database** | PostgreSQL (Supabase) | 15 | Relational data store with connection pooling |
| **Cache & Queue** | Redis (ioredis) | 5.3 | Session caching, BullMQ job queue backend |
| **Job Queue** | BullMQ | 5.4 | Background email delivery, notifications |
| **Real-time** | Socket.io | 4.7 | WebSocket-based live chat & streaming alerts |
| **Email** | Resend API | 3.2 | Transactional emails (OTP, welcome, digests) |
| **WhatsApp** | Twilio API | — | Attendance alerts, job notifications |
| **AI / ML** | Google Gemini 1.5 Flash | — | Mock interview evaluation, resume parsing |
| **Object Storage** | Cloudflare R2 (S3-compat) | — | File uploads (resumes, videos, PDFs) |
| **PDF Generation** | PDFKit | 0.15 | Certificate PDF generation with QR codes |
| **QR Codes** | qrcode | 1.5 | Certificate verification QR codes |
| **PDF Parsing** | pdf-parse | 1.1 | Resume text extraction for skill matching |
| **Validation** | Zod | 3.22 | Request body schema validation |
| **Auth** | JWT (RS256) + bcrypt | — | Asymmetric key auth, password hashing |
| **Logging** | Winston | 3.12 | Structured application logging |
| **Rate Limiting** | express-rate-limit | 7.2 | API abuse prevention |
| **Security** | Helmet + CORS | — | HTTP header hardening, cross-origin control |
| **Frontend Framework** | React 19 | 19.2 | Component-based admin UI |
| **Build Tool** | Vite | 8.x | Fast HMR development server + production bundler |
| **CSS Framework** | TailwindCSS | 3.4 | Utility-first responsive styling |
| **State Management** | Zustand | 5.0 | Lightweight global state (auth, UI) |
| **Data Fetching** | TanStack React Query | 5.x | Server state management, caching, mutations |
| **Charts** | Recharts | 3.8 | Dashboard analytics visualizations |
| **HTTP Client** | Axios | 1.18 | API calls with interceptors (token refresh) |
| **UI Primitives** | Radix UI | — | Accessible dialogs, dropdowns, tabs, selects |
| **Icons** | Lucide React | 1.21+ | Consistent iconography across web & mobile |
| **Forms** | React Hook Form + Zod | — | Performant form handling with schema validation |
| **Mobile Framework** | Capacitor | 8.4 | Native iOS/Android wrapper for React SPA |
| **Mobile Router** | React Router (HashRouter) | 7.18 | Client-side routing for Capacitor |

---

## 3. Project Structure

```
ktcapp/
├── backend/                          # Express.js REST API
│   ├── prisma/
│   │   ├── schema.prisma             # Complete database schema (1210 lines, 30+ models)
│   │   ├── seed.ts                   # Database seeding script
│   │   └── migrations/              # SQL migration files
│   ├── src/
│   │   ├── index.ts                  # Server entrypoint — HTTP + Socket.io
│   │   ├── config/
│   │   │   ├── app.ts               # Express app factory (CORS, helmet, compression)
│   │   │   ├── database.ts          # Prisma client singleton
│   │   │   ├── env.ts               # Zod environment variable validation
│   │   │   ├── email.ts             # Resend API client
│   │   │   ├── redis.ts             # ioredis client with lazy connection
│   │   │   └── storage.ts           # Cloudflare R2 / S3 client
│   │   ├── middleware/
│   │   │   ├── auth.ts              # JWT token verification
│   │   │   ├── rbac.ts              # Role-Based Access Control
│   │   │   ├── validate.ts          # Zod schema request validation
│   │   │   ├── rateLimiter.ts       # API rate limiting
│   │   │   ├── errorHandler.ts      # Global error handler with AppError class
│   │   │   └── auditLog.ts          # Action audit trail logging
│   │   ├── services/
│   │   │   ├── socket.service.ts    # Socket.io server + live stream management
│   │   │   ├── email.service.ts     # Email templates (OTP, welcome, password reset)
│   │   │   ├── whatsapp.service.ts  # Twilio WhatsApp alerts
│   │   │   ├── ai.service.ts        # Gemini AI mock interview evaluation
│   │   │   ├── resume.service.ts    # PDF resume parsing + AI skill extraction
│   │   │   ├── pdf.service.ts       # Certificate PDF generation (PDFKit)
│   │   │   ├── storage.service.ts   # R2 file upload, presigned URLs, HLS
│   │   │   ├── queue.service.ts     # BullMQ background job queue
│   │   │   └── report.service.ts    # Executive summary report generation
│   │   ├── utils/
│   │   │   ├── logger.ts            # Winston logger configuration
│   │   │   ├── response.ts          # Standardized API response helpers
│   │   │   ├── pagination.ts        # Cursor/offset pagination utility
│   │   │   ├── codeGenerator.ts     # Unique code generation (student, certificate)
│   │   │   └── dbRetry.ts           # Database operation retry logic
│   │   └── modules/                 # 18 feature modules (see §4.5)
│   │       ├── auth/               ├── batch/          ├── certificate/
│   │       ├── college/            ├── course/         ├── student/
│   │       ├── trainer/            ├── attendance/     ├── quiz/
│   │       ├── assignment/         ├── job/            ├── placement/
│   │       ├── notification/       ├── upload/         ├── recruiter/
│   │       ├── livestream/         ├── reports/        └── user/
│   └── package.json
│
├── frontend/                         # React Admin Dashboard (Vite + TypeScript)
│   ├── src/
│   │   ├── App.tsx                  # Root router with protected routes
│   │   ├── main.tsx                 # React DOM entry point
│   │   ├── index.css                # Global styles + Tailwind imports
│   │   ├── config/
│   │   │   └── axios.ts            # Axios instance with auth interceptors
│   │   ├── store/
│   │   │   └── authStore.ts        # Zustand auth state (login, tokens, user)
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── DashboardLayout.tsx   # Sidebar + top bar + content area
│   │   │   │   └── ProtectedRoute.tsx    # Auth guard component
│   │   │   ├── chat/
│   │   │   │   └── LiveChatDrawer.tsx    # Socket.io real-time chat panel
│   │   │   └── livestream/
│   │   │       └── LiveStreamModal.tsx   # YouTube Live broadcast modal
│   │   └── pages/                   # 17 page components (see §5.3)
│   └── package.json
│
├── mobile/                           # Capacitor Mobile App (React + Vite)
│   ├── src/
│   │   ├── App.jsx                  # Root HashRouter with all routes
│   │   ├── main.jsx                 # React DOM entry
│   │   ├── index.css                # Mobile-first global styles
│   │   ├── core/
│   │   │   ├── api/
│   │   │   │   └── apiClient.js    # Axios client with token management
│   │   │   └── database/
│   │   │       └── storageManager.js  # LocalStorage-based data cache
│   │   └── features/
│   │       ├── auth/               # Login, Register, OTP, Profile Setup
│   │       ├── home/               # HomeScreen, Notifications, Chat Drawer
│   │       ├── courses/            # Learn, Syllabus, Lessons, Attendance, Live Stream
│   │       ├── quizzes/            # Quiz List, Attempt, Answer Review
│   │       ├── profile/            # Profile, Mock Interview, Placements
│   │       └── sync/               # Offline data sync service
│   └── package.json
│
├── Documentstofollow/               # 14 planning documents (PRD, TRD, Schema, etc.)
├── logindetails.md                  # All test credentials and connection details
├── README.md                        # Project overview and setup instructions
└── project_analysis.md              # Technical analysis document
```

---

## 4. Backend API — Complete Breakdown

### 4.1 Server Entrypoint & Lifecycle

The server is bootstrapped in [`index.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/backend/src/index.ts) with the following startup sequence:

1. **Environment Validation** — Zod schema validates all critical env vars (`DATABASE_URL`, `JWT_PRIVATE_KEY`, `JWT_PUBLIC_KEY`, `REFRESH_TOKEN_SECRET`). Server crashes immediately if any are missing.
2. **Express App Factory** — Creates the Express app with security middleware (Helmet, CORS, compression, rate limiting, cookie parsing).
3. **HTTP Server + Socket.io** — `http.createServer(app)` wraps Express, then `initSocketServer(server)` attaches Socket.io for real-time communication.
4. **Database Connection** — Prisma connects to PostgreSQL (Supabase) with connection pooling.
5. **Redis Connection** — Lazy connection to Redis for caching and BullMQ job queue (graceful fallback if offline).
6. **Background Queue Init** — BullMQ worker starts processing email and notification jobs.
7. **Route Registration** — 18 API route groups are mounted under `/api/v1/`.
8. **Graceful Shutdown** — Handles `SIGTERM` and `SIGINT` signals, closing HTTP server, Prisma, and Redis connections with a 10-second timeout.

### 4.2 Configuration Layer

| File | Purpose |
|------|---------|
| [`app.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/backend/src/config/app.ts) | Express app factory — Helmet security headers, gzip compression, global rate limiter, CORS with origin whitelist, body parsing (10MB limit), cookie parsing, health check endpoint |
| [`database.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/backend/src/config/database.ts) | Prisma client singleton with pooled + direct connection URLs |
| [`env.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/backend/src/config/env.ts) | Zod schema validation for all required environment variables — fail-fast pattern |
| [`email.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/backend/src/config/email.ts) | Resend API client initialization with sender address config |
| [`redis.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/backend/src/config/redis.ts) | ioredis client with lazy connection, auto-reconnect, and error handling |
| [`storage.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/backend/src/config/storage.ts) | Cloudflare R2 (S3-compatible) client with bucket name and public CDN URL |

### 4.3 Middleware Pipeline

Every request flows through this pipeline:

```
Request → Helmet → Compression → Rate Limiter → CORS → Body Parser
        → Cookie Parser → [Route-specific: Auth → RBAC → Validate]
        → Controller → Error Handler → Response
```

| Middleware | File | Description |
|-----------|------|-------------|
| **Authentication** | [`auth.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/backend/src/middleware/auth.ts) | Verifies JWT access tokens (RS256 algorithm). Extracts `userId`, `role`, `email`, `collegeId` from token payload and attaches to `req.user`. Supports both required and optional authentication. |
| **RBAC** | [`rbac.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/backend/src/middleware/rbac.ts) | Role-based access control with three strategies: `requireRole(...)` for exact role match, `requireMinRole(...)` for hierarchical access (SUPER_ADMIN > COLLEGE_ADMIN > TRAINER > STUDENT), and `requireCollegeScope(...)` for data isolation between colleges. |
| **Validation** | [`validate.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/backend/src/middleware/validate.ts) | Zod schema validation for request body, query params, and URL params. Returns structured validation errors. |
| **Rate Limiting** | [`rateLimiter.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/backend/src/middleware/rateLimiter.ts) | Global rate limiter + stricter limits for auth endpoints (login, register, OTP). |
| **Error Handler** | [`errorHandler.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/backend/src/middleware/errorHandler.ts) | Global error handler with custom `AppError` class supporting HTTP status codes, error codes, and operational vs. programming error distinction. |
| **Audit Log** | [`auditLog.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/backend/src/middleware/auditLog.ts) | Records user actions (create, update, delete) with old/new values, IP address, and user agent to the `audit_logs` table for compliance. |

### 4.4 Service Layer

| Service | File | Description |
|---------|------|-------------|
| **Socket.io** | [`socket.service.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/backend/src/services/socket.service.ts) | WebSocket server for real-time chat (room-based join/leave/message), live stream start/stop notifications, and in-memory chat history (last 100 messages per room). |
| **Email** | [`email.service.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/backend/src/services/email.service.ts) | Transactional email delivery via Resend API with HTML templates for: OTP verification, password reset, welcome emails with temporary passwords. Smart dev-mode bypass when API key is missing. |
| **WhatsApp** | [`whatsapp.service.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/backend/src/services/whatsapp.service.ts) | Twilio WhatsApp messaging for: OTP delivery, low-attendance alerts (< 75%), job opportunity notifications. Smart dev-mode bypass. |
| **AI Mock Interview** | [`ai.service.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/backend/src/services/ai.service.ts) | Google Gemini 1.5 Flash powered mock interview evaluator. Takes question + candidate answer, returns structured JSON with score (0–100), feedback, strengths, and improvements. Falls back to keyword-based local evaluator if API key missing. |
| **Resume Parser** | [`resume.service.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/backend/src/services/resume.service.ts) | PDF resume parsing pipeline: extracts text via `pdf-parse`, then uses Gemini AI to identify skills, CGPA, graduation year, experience, and education summaries. Falls back to regex-based skill dictionary matching (40+ tech keywords). |
| **PDF Generator** | [`pdf.service.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/backend/src/services/pdf.service.ts) | Professional certificate PDF generation using PDFKit. Landscape A4 layout with decorative golden corners, double-border frame, student name, course name, verification code, authorized signatory section. |
| **Object Storage** | [`storage.service.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/backend/src/services/storage.service.ts) | Cloudflare R2 file management: presigned upload URLs for direct client uploads, file deletion, public CDN URL generation, unique file key generation with date-based paths, raw buffer uploads, and HLS adaptive streaming URL resolution. |
| **Job Queue** | [`queue.service.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/backend/src/services/queue.service.ts) | BullMQ background job processor with 4 job types: verification email, password reset email, welcome email, notification dispatch. Auto-retries (3 attempts with exponential backoff). Falls back to synchronous execution when Redis is offline. |
| **Report Generator** | [`report.service.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/backend/src/services/report.service.ts) | Executive summary report aggregation: total students, placed students, placement percentage, batch counts, session counts, average attendance, top-performing students — scoped per college or platform-wide. |

### 4.5 API Modules & Endpoints

The backend has **18 feature modules**, each following the pattern: `router → controller → service → Prisma queries`.

| # | Module | Base Route | Key Endpoints | Access |
|---|--------|-----------|---------------|--------|
| 1 | **Auth** | `/api/v1/auth` | `POST /register`, `POST /verify-email`, `POST /login`, `POST /refresh`, `POST /forgot-password`, `POST /reset-password`, `POST /change-password`, `POST /logout`, `POST /verify-mfa-otp`, `POST /resend-otp`, `GET /me` | Public / Authenticated |
| 2 | **Users** | `/api/v1/users` | User CRUD, profile updates, avatar management | Super Admin |
| 3 | **Colleges** | `/api/v1/colleges` | College CRUD, admin assignment, student list, batch overview | Super Admin / College Admin |
| 4 | **Students** | `/api/v1/students` | Student CRUD, bulk import, resume upload + AI parsing, profile completion, placement status, skill management | Admin / Trainer |
| 5 | **Trainers** | `/api/v1/trainers` | Trainer CRUD, specialization management, batch assignment, performance metrics | Super Admin |
| 6 | **Courses** | `/api/v1/courses` | Course CRUD, module/lesson management, video upload, status workflow (DRAFT → REVIEW → PUBLISHED → ARCHIVED), syllabus builder | Admin / Trainer |
| 7 | **Batches** | `/api/v1/batches` | Batch CRUD, student enrollment/unenrollment, trainer assignment, schedule management, progress overview | Admin / Trainer |
| 8 | **Attendance** | `/api/v1/attendance` | Class session creation, attendance marking (PRESENT/ABSENT/LATE/EXCUSED), bulk marking, student attendance history, attendance percentage calculation | Trainer / Admin |
| 9 | **Quizzes** | `/api/v1/quizzes` | Quiz CRUD, question bank management (MCQ_SINGLE, MCQ_MULTIPLE, TRUE_FALSE, SHORT_TEXT), quiz publishing, attempt start/submit/auto-grade, answer review, leaderboard | Trainer / Student |
| 10 | **Assignments** | `/api/v1/assignments` | Assignment CRUD, file/text/link submission, grading with feedback, late submission handling, submission status workflow | Trainer / Student |
| 11 | **Certificates** | `/api/v1/certificates` | Certificate generation (PDF + QR), certificate listing, public verification endpoint, revocation | Admin / Public |
| 12 | **Jobs** | `/api/v1/jobs` | Job opportunity CRUD, skill-based targeting, student interest marking, application tracking | Recruiter / Admin / Student |
| 13 | **Placements** | `/api/v1/placements` | Placement record CRUD, offer letter document linking, verification workflow, placement analytics (by company, salary range, batch) | Admin / Trainer |
| 14 | **Notifications** | `/api/v1/notifications` | Send notifications (ALL/COLLEGE/BATCH/INDIVIDUAL scope), mark as read, notification history, push/email delivery tracking | All roles |
| 15 | **Uploads** | `/api/v1/uploads` | Presigned URL generation for direct R2 uploads, file metadata management, multi-part upload support | Authenticated |
| 16 | **Recruiters** | `/api/v1/recruiters` | Recruiter registration, approval workflow, student search (skills, CGPA, branch, graduation year), candidate shortlisting | Recruiter / Admin |
| 17 | **Live Stream** | `/api/v1/livestream` | `POST /start` (start broadcast), `POST /stop` (end broadcast), `GET /active` (list active streams) | Trainer / Admin |
| 18 | **Reports** | `/api/v1/reports` | `GET /executive-summary` (analytics), `GET /attendance-csv` (CSV export), `POST /email-digest` (send digest to college contacts) | Admin |

### 4.6 Database Schema — Prisma ORM

The database schema ([`schema.prisma`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/backend/prisma/schema.prisma)) contains **1,210 lines** defining **30+ models** and **20+ enums**.

#### Enums (20)

| Enum | Values | Used In |
|------|--------|---------|
| `UserRole` | SUPER_ADMIN, COLLEGE_ADMIN, TRAINER, STUDENT, RECRUITER | User |
| `VerificationType` | EMAIL_VERIFY, PASSWORD_RESET | EmailVerification |
| `CourseStatus` | DRAFT, REVIEW, PUBLISHED, ARCHIVED | Course |
| `CourseDifficulty` | BEGINNER, INTERMEDIATE, ADVANCED | Course |
| `LessonType` | VIDEO, PDF, TEXT, EXTERNAL_LINK, MIXED | Lesson |
| `VideoSourceType` | UPLOAD, YOUTUBE, VIMEO, GOOGLE_DRIVE | LessonVideo |
| `VideoStatus` | PENDING, PROCESSING, READY, FAILED | LessonVideo |
| `BatchMode` | ONLINE, OFFLINE, HYBRID | Batch |
| `BatchStatus` | UPCOMING, ACTIVE, COMPLETED, CANCELLED | Batch |
| `EnrollmentStatus` | ACTIVE, INACTIVE, DROPPED, COMPLETED | BatchStudent |
| `SessionMode` | ONLINE, OFFLINE, HYBRID | ClassSession |
| `AttendanceStatus` | PRESENT, ABSENT, LATE, EXCUSED | AttendanceRecord |
| `QuestionType` | MCQ_SINGLE, MCQ_MULTIPLE, TRUE_FALSE, SHORT_TEXT | QuizQuestion |
| `QuestionDifficulty` | EASY, MEDIUM, HARD | QuizQuestion |
| `QuizStatus` | DRAFT, PUBLISHED, CLOSED | Quiz |
| `AttemptStatus` | IN_PROGRESS, SUBMITTED, TIMED_OUT, ABANDONED | QuizAttempt |
| `AssignmentStatus` | DRAFT, PUBLISHED, CLOSED | Assignment |
| `SubmissionStatus` | SUBMITTED, UNDER_REVIEW, GRADED, RETURNED | AssignmentSubmission |
| `PlacementStatus` | NOT_STARTED, PREPARING, ACTIVELY_APPLYING, PLACED, ON_HOLD, NOT_INTERESTED | Student |
| `OfferType` | FULL_TIME, INTERNSHIP, CONTRACT, FREELANCE | PlacementRecord |
| `PlacementSource` | COLLEGE_DRIVE, JOB_BOARD, REFERRAL, SELF, OTHER | PlacementRecord |
| `JobType` | FULL_TIME, INTERNSHIP, CONTRACT | JobOpportunity |
| `JobInterestStatus` | INTERESTED, APPLIED, SHORTLISTED, REJECTED, HIRED | JobInterest |
| `DocumentType` | OFFER_LETTER, INTERNSHIP_LETTER, COMPLETION_LETTER, RECOMMENDATION_LETTER, OTHER | StudentDocument |
| `NotificationScope` | ALL, COLLEGE, BATCH, INDIVIDUAL | Notification |
| `ActivityType` | LESSON_VIEWED, VIDEO_WATCHED, QUIZ_ATTEMPTED, ASSIGNMENT_SUBMITTED, NOTE_WRITTEN, LOGIN | StudentActivityLog |

#### Models (30+)

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **User** | Base authentication for all user types | email, passwordHash, role, firstName, lastName, phone, avatarUrl, isActive, isEmailVerified |
| **EmailVerification** | OTP-based email/password reset verification | otp, type, expiresAt, usedAt |
| **RefreshToken** | JWT refresh token management | tokenHash, deviceInfo, expiresAt, revokedAt |
| **College** | Partner educational institution | name, code, address, city, contactEmail, contractStart/End, metadata |
| **CollegeAdmin** | Admin-to-college assignment (M2M) | permissions (JSON), userId, collegeId |
| **Trainer** | Instructor profile | bio, specialisations[], experienceYears, linkedinUrl, githubUrl, rating |
| **Student** | Student profile with placement tracking | studentCode, collegeId, branch, graduationYear, cgpa, skills[], resumeUrl, placementStatus, profileCompleted |
| **Course** | Training course definition | title, slug, description, category, difficulty, durationHours, status, isSequential, minAttendancePct, minQuizAvgPct |
| **Module** | Chapter within a course | title, description, sortOrder, isLocked |
| **Lesson** | Individual lesson within a module | title, lessonType, contentText, externalUrl, durationMinutes, isPreview, isMandatory |
| **LessonVideo** | Video attachment per lesson | sourceType, rawUrl, cdnUrl, thumbnailUrl, durationSeconds, fileSizeBytes, status |
| **LessonNote** | PDF/document attachment per lesson | title, fileUrl, fileSizeBytes, sortOrder |
| **Batch** | Training batch linking college + course | name, code, collegeId, courseId, startDate, endDate, mode, scheduleDays[], scheduleTime, capacity, meetLink |
| **BatchTrainer** | Trainer-to-batch assignment (M2M) | isPrimary |
| **BatchStudent** | Student enrollment in batch (M2M) | enrolledAt, status, completionPct, lastActiveAt |
| **ClassSession** | Individual class session | sessionDate, startTime, endTime, topicCovered, mode, recordingUrl, totalStudents, presentCount |
| **AttendanceRecord** | Per-student attendance per session | status, markedBy, overrideReason |
| **Quiz** | Quiz definition | title, courseId, batchId, timeLimitMins, totalMarks, passMarks, attemptsAllowed, shuffleQuestions/Options, availableFrom/Until |
| **QuizQuestion** | Individual quiz question | questionText, questionType, marks, difficulty, topicTag, explanation |
| **QuestionOption** | MCQ options | optionText, isCorrect, sortOrder |
| **QuizAttempt** | Student's quiz attempt | attemptNumber, startedAt, submittedAt, timeTakenSecs, score, maxScore, percentage, passed, status |
| **QuizAnswer** | Individual answer in attempt | selectedOptionIds[], textAnswer, isCorrect, marksAwarded |
| **Assignment** | Assignment definition | title, totalMarks, passMarks, deadlineAt, allowLate, submissionType, instructions, resourceUrl |
| **AssignmentSubmission** | Student's submission | submissionText, fileUrl, submissionLink, isLate, marksAwarded, feedback, gradedBy |
| **StudentProgress** | Per-lesson completion tracking | startedAt, completedAt, videoProgressSecs, videoCompletedPct, isCompleted |
| **StudentNote** | Personal notes on lessons | content |
| **StudentActivityLog** | Activity log for streaks/heatmaps | activityType, entityId, durationSecs, activityDate |
| **Certificate** | Completion certificate | certificateCode, pdfUrl, isValid, revokedAt, revokeReason, metadata |
| **StudentDocument** | Offer/internship letters | documentType, title, fileUrl, companyName, issueDate |
| **PlacementRecord** | Placement details | companyName, roleTitle, offerType, ctcAnnual, stipendMonthly, offerDate, joiningDate, isVerified, source |
| **JobOpportunity** | Job postings | title, companyName, jobType, skillsRequired[], ctcMin/Max, location, isRemote, applicationLink, targetBatches[], targetColleges[] |
| **JobInterest** | Student's interest in a job | status (INTERESTED → APPLIED → SHORTLISTED → REJECTED/HIRED) |
| **Notification** | Platform notifications | type, title, body, data (JSON), targetScope, targetId |
| **NotificationRecipient** | Per-user notification delivery | isRead, readAt, pushSent, emailSent |
| **AuditLog** | Action audit trail | action, entityType, entityId, oldValues, newValues, ipAddress, userAgent |
| **SystemSetting** | Key-value system configuration | key, value, description |
| **Recruiter** | Recruiter/company profile | companyName, designation, website, isApproved |

### 4.7 Background Job Queue

BullMQ processes these jobs asynchronously via Redis:

| Job Name | Data | Description |
|----------|------|-------------|
| `SEND_VERIFICATION_EMAIL` | `{ email, otp, firstName }` | OTP email during registration |
| `SEND_RESET_EMAIL` | `{ email, otp, firstName }` | OTP email during password reset |
| `SEND_WELCOME_EMAIL` | `{ email, firstName, tempPassword, role }` | Welcome email for admin-created accounts |
| `DISPATCH_NOTIFICATION` | `{ data, creatorId }` | Platform notification creation and delivery |

**Retry Policy**: 3 attempts with exponential backoff (1s → 2s → 4s).  
**Fallback**: If Redis is offline, jobs execute synchronously in the request lifecycle.

---

## 5. Frontend Web Admin — Complete Breakdown

### 5.1 Routing & Layout

The frontend uses React Router v7 with a two-tier routing structure:

- **Public Routes**: `/login`, `/verify/:code`
- **Protected Routes** (wrapped in `ProtectedRoute` + `DashboardLayout`):
  - Dashboard, Colleges, Students, Trainers, Courses, Batches, Certificate Designer
  - Placements, Jobs, Recruiter Search, Communication
  - Reports (Attendance, Progress)
  - Attendance (Trainer), Grading (Trainer)

The [`DashboardLayout.tsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/components/layout/DashboardLayout.tsx) provides:
- **Collapsible Sidebar** — Role-based navigation links (different menus for Super Admin, College Admin, Trainer, Recruiter)
- **Top Navbar** — User avatar, role badge, notifications bell, live chat trigger button
- **Content Area** — Main page content with proper scrolling
- **Live Chat Drawer** — Persistent Socket.io chat panel accessible from any page

### 5.2 State Management

| Store | File | Purpose |
|-------|------|---------|
| **Auth Store** | [`authStore.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/store/authStore.ts) | Zustand store managing: login state, JWT tokens (access + refresh), user profile data, session persistence via localStorage, automatic session loading on app mount |

**Data Fetching**: TanStack React Query handles all server state with automatic caching, background refetching, optimistic updates, and cache invalidation.

**HTTP Client**: [`axios.ts`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/config/axios.ts) — Axios instance with:
- Base URL configuration
- Authorization header injection (Bearer token)
- 401 response interceptor → automatic token refresh → retry failed request
- Request/response logging in development

### 5.3 Pages — Full List

| # | Page | File | Features |
|---|------|------|----------|
| 1 | **Login** | [`Login.tsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/pages/Login.tsx) | Email/password login form, MFA OTP verification, password change prompt for temp passwords, animated background, role-based redirect |
| 2 | **Dashboard** | [`Dashboard.tsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/pages/Dashboard.tsx) | KPI cards (students, placements, revenue, attendance), trend charts (Recharts), recent activity feed, upcoming sessions, batch status overview |
| 3 | **Colleges** | [`Colleges.tsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/pages/Colleges.tsx) | College list with search/filter, create/edit modal, admin assignment, contract dates, active/inactive toggle, student count per college |
| 4 | **Students** | [`Students.tsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/pages/Students.tsx) | Student list with advanced filtering (college, batch, branch, placement status), create/edit/view modals, resume upload with AI skill extraction, bulk import, placement status tracking, profile completion indicators |
| 5 | **Trainers** | [`Trainers.tsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/pages/Trainers.tsx) | Trainer list, create/edit modal with specializations, batch assignment overview, experience years, LinkedIn/GitHub profile links |
| 6 | **Courses** | [`Courses.tsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/pages/Courses.tsx) | Course management with full syllabus builder (modules → lessons → videos), drag-and-drop reordering, video upload with source type selection, lesson content editor, course status workflow, **trainer video upload**, **Live Stream broadcast trigger** |
| 7 | **Batches** | [`Batches.tsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/pages/Batches.tsx) | Batch CRUD, student enrollment/unenrollment, trainer assignment, schedule configuration (days + time), capacity management, Google Meet link |
| 8 | **Attendance** | [`Attendance.tsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/pages/Attendance.tsx) | Session creation, attendance marking grid (PRESENT/ABSENT/LATE/EXCUSED), bulk marking, session history, attendance summary, **Live Stream broadcast button** |
| 9 | **Grading** | [`Grading.tsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/pages/Grading.tsx) | Assignment submission review, grade assignment with feedback, marks entry, submission status tracking, late submission flagging |
| 10 | **Placements** | [`Placements.tsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/pages/Placements.tsx) | Placement record management, offer details (CTC, stipend, company, role), document linking, verification workflow, analytics by company/salary |
| 11 | **Jobs** | [`Jobs.tsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/pages/Jobs.tsx) | Job posting CRUD, skill requirements, salary range, location/remote, application deadline, target batches/colleges, student interest tracking |
| 12 | **Communication** | [`Communication.tsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/pages/Communication.tsx) | Notification composer, scope selection (ALL/COLLEGE/BATCH/INDIVIDUAL), notification history, delivery status (push, email) |
| 13 | **Reports: Attendance** | [`ReportsAttendance.tsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/pages/ReportsAttendance.tsx) | Attendance reports by batch/date range, percentage breakdowns, student-level drill-down, **CSV Export download**, **Email Digest trigger** |
| 14 | **Reports: Progress** | [`ReportsProgress.tsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/pages/ReportsProgress.tsx) | Course completion progress, quiz score analytics, assignment completion rates, student activity heatmaps |
| 15 | **Certificate Designer** | [`CertificateDesigner.tsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/pages/CertificateDesigner.tsx) | Certificate template preview, batch-based generation, QR code embedding, certificate listing with download/revoke actions |
| 16 | **Verify Certificate** | [`VerifyCertificate.tsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/pages/VerifyCertificate.tsx) | Public-facing certificate verification page — enter code or scan QR to validate authenticity |
| 17 | **Recruiter Dashboard** | [`RecruiterDashboard.tsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/pages/RecruiterDashboard.tsx) | Advanced student search (skills, CGPA, branch, graduation year), candidate profiles with resume preview, shortlisting, job posting management |

### 5.4 Reusable Components

| Component | File | Description |
|-----------|------|-------------|
| **DashboardLayout** | [`DashboardLayout.tsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/components/layout/DashboardLayout.tsx) | Full admin layout with collapsible sidebar, top navbar, role-based navigation, live chat trigger |
| **ProtectedRoute** | [`ProtectedRoute.tsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/components/layout/ProtectedRoute.tsx) | Auth guard — redirects to login if unauthenticated |
| **LiveChatDrawer** | [`LiveChatDrawer.tsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/components/chat/LiveChatDrawer.tsx) | Socket.io real-time chat side panel with room selection, message history, typing indicator, auto-scroll |
| **LiveStreamModal** | [`LiveStreamModal.tsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/frontend/src/components/livestream/LiveStreamModal.tsx) | YouTube Live broadcast modal — paste stream URL/ID, start/stop broadcast, live viewer count, real-time Q&A chat |

---

## 6. Mobile Student App — Complete Breakdown

### 6.1 App Shell & Navigation

The mobile app uses **Capacitor** to wrap a React SPA into native iOS/Android apps. It uses `HashRouter` for Capacitor compatibility.

**Navigation Structure**:
- **Splash Screen** → Auto-redirect based on auth state
- **Auth Stack**: Login → Register → Email Verification → Profile Setup → Forgot Password
- **Main Shell** (bottom tab navigation):
  - 🏠 Home — Dashboard with upcoming events, live class banner, announcements
  - 📚 Learn — Course catalog, syllabus, lesson viewer
  - 📝 Quizzes — Quiz list, attempt screen, answer review
  - 💼 Placement — Placement profile, job listings, mock interviews
  - 👤 Profile — Full profile editor with settings
- **Sub-pages** (push navigation):
  - Course Syllabus, Lesson Viewer, Attendance, Assignments, Quiz Attempt, Quiz Review, Mock Interview, Notifications, **Live Stream Viewer**

### 6.2 Feature Modules

#### Auth Feature
| Screen | File | Features |
|--------|------|----------|
| **Splash** | [`SplashScreen.jsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/auth/views/SplashScreen.jsx) | Animated KTC logo, auto-redirect to login or home based on saved token |
| **Login** | [`LoginScreen.jsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/auth/views/LoginScreen.jsx) | Email/password form, student-only role restriction, pre-filled dev credentials, loading states |
| **Register** | [`RegisterScreen.jsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/auth/views/RegisterScreen.jsx) | Full registration form, terms acceptance, auto-redirect to OTP verification |
| **Email Verification** | [`EmailVerificationScreen.jsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/auth/views/EmailVerificationScreen.jsx) | 6-digit OTP input, resend timer, auto-verify and proceed |
| **Forgot Password** | [`ForgotPasswordScreen.jsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/auth/views/ForgotPasswordScreen.jsx) | Multi-step flow: email input → OTP verification → new password entry |
| **Profile Setup** | [`ProfileSetupScreen.jsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/auth/views/ProfileSetupScreen.jsx) | Multi-step profile wizard: personal details → academic info → skills → resume upload |

#### Home Feature
| Screen | File | Features |
|--------|------|----------|
| **Home** | [`HomeScreen.jsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/home/views/HomeScreen.jsx) | Hero greeting with progress ring, XP bar, streak counter, **animated LIVE CLASS banner** (pulses when active), quick-action cards (Attendance, Quizzes, Assignments, Placement), upcoming events calendar, announcements feed, **real-time chat trigger** |
| **Main Shell** | [`MainShellLayout.jsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/home/views/MainShellLayout.jsx) | Bottom tab navigation bar with 5 tabs, active state indicators, haptic feedback |
| **Notifications** | [`NotificationScreen.jsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/home/views/NotificationScreen.jsx) | Notification list with read/unread states, grouped by date, swipe actions |
| **Chat Drawer** | [`MobileChatDrawer.jsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/home/views/MobileChatDrawer.jsx) | Bottom-sheet Socket.io chat panel, message bubbles with timestamps, auto-scroll, room-based messaging |

#### Courses Feature
| Screen | File | Features |
|--------|------|----------|
| **Learn** | [`LearnScreen.jsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/courses/views/LearnScreen.jsx) | Enrolled course cards with progress bars, module overview, continue-learning shortcut |
| **Course Syllabus** | [`CourseSyllabusScreen.jsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/courses/views/CourseSyllabusScreen.jsx) | Full syllabus tree (modules → lessons), completion checkmarks, locked/unlocked indicators, lesson type icons |
| **Lesson Viewer** | [`LessonViewerScreen.jsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/courses/views/LessonViewerScreen.jsx) | Video player with progress tracking, PDF viewer, text content renderer, lesson notes, mark-as-complete |
| **Attendance** | [`AttendanceScreen.jsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/courses/views/AttendanceScreen.jsx) | Attendance history calendar view, percentage indicator, session details with status badges |
| **Assignments** | [`AssignmentsScreen.jsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/courses/views/AssignmentsScreen.jsx) | Assignment list, submission form (text/file/link), grade and feedback view, deadline countdown |
| **Live Stream** | [`LiveStreamViewerScreen.jsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/courses/views/LiveStreamViewerScreen.jsx) | YouTube Live embedded player (low-latency), real-time Q&A chat via Socket.io, stream info header, live viewer count |

#### Quizzes Feature
| Screen | File | Features |
|--------|------|----------|
| **Quiz List** | [`QuizzesScreen.jsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/quizzes/views/QuizzesScreen.jsx) | Available quizzes with status badges, time limit, marks, attempts remaining |
| **Quiz Attempt** | [`QuizAttemptScreen.jsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/quizzes/views/QuizAttemptScreen.jsx) | Timed quiz interface, question navigation, answer selection (MCQ/True-False/Short text), auto-save, submit confirmation |
| **Answer Review** | [`QuizAnswerReviewScreen.jsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/quizzes/views/QuizAnswerReviewScreen.jsx) | Post-submission review with correct/incorrect highlighting, explanations, score breakdown |

#### Profile Feature
| Screen | File | Features |
|--------|------|----------|
| **Profile** | [`ProfileScreen.jsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/profile/views/ProfileScreen.jsx) | Full profile editor (personal, academic, skills, resume), achievement badges, course completion stats, activity heatmap, settings (dark mode, notifications) |
| **Placement** | [`PlacementScreen.jsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/profile/views/PlacementScreen.jsx) | Placement profile, job listings with interest marking, application history, placement status tracker, company details |
| **Mock Interview** | [`MockInterviewScreen.jsx`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/profile/views/MockInterviewScreen.jsx) | AI-powered mock interview practice — question prompts, voice/text answer recording, Gemini AI evaluation with score, strengths, and improvement suggestions |

### 6.3 Local Storage & Sync

| File | Purpose |
|------|---------|
| [`storageManager.js`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/core/database/storageManager.js) | LocalStorage-based data cache manager — stores user profile, course data, quiz attempts, and API responses for offline access. Provides TTL-based cache expiration and cache invalidation utilities. |
| [`syncService.js`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/sync/services/syncService.js) | Background sync service — queues offline actions (quiz submissions, attendance checks) and syncs when network is restored. Handles conflict resolution for concurrent edits. |
| [`apiClient.js`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/core/api/apiClient.js) | Axios HTTP client with: base URL configuration, token injection from auth store, 401 interceptor with automatic token refresh, request queuing during token refresh, response caching hooks. |
| [`authStore.js`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/auth/stores/authStore.js) | Zustand auth state — login/logout actions, token persistence, user profile data, session validation on app mount. |
| [`courseStore.js`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/courses/stores/courseStore.js) | Zustand course state — enrolled courses, current lesson progress, module navigation state. |
| [`quizStore.js`](file:///c:/Users/FARAZ%20KHAN/Desktop/Work/ktcapp/mobile/src/features/quizzes/stores/quizStore.js) | Zustand quiz state — active quiz attempt, answer tracking, timer management, submission state. |

---

## 7. Authentication & Security

### Auth Flow

```
Registration → OTP Email Sent → OTP Verification → Account Active
Login → Password Verify → (MFA OTP if enabled) → JWT Access Token + Refresh Token (cookie)
```

### Token Strategy

| Token | Algorithm | Storage | Lifetime | Purpose |
|-------|-----------|---------|----------|---------|
| **Access Token** | RS256 (asymmetric) | Client memory / localStorage | 15 minutes | API authentication — sent as `Bearer` header |
| **Refresh Token** | HMAC-SHA256 | HTTP-only cookie + database | 7 days | Silent token renewal — stored as bcrypt hash in DB |

### Security Measures

- **RS256 JWT** — Asymmetric RSA key pair (private key signs, public key verifies) — no shared secret
- **bcrypt password hashing** — 12 salt rounds
- **HTTP-only cookies** — Refresh tokens are `httpOnly`, `secure` (in production), `sameSite: lax`
- **Helmet** — Sets security headers (X-Frame-Options, X-Content-Type-Options, CSP, etc.)
- **CORS** — Whitelist-based origin control with credentials support
- **Rate Limiting** — Global API limits + stricter limits on auth endpoints
- **Zod Validation** — All request bodies validated before processing
- **Audit Logging** — All create/update/delete actions logged with old/new values
- **Token Blacklisting** — Revoked refresh tokens tracked in database
- **College Scope Isolation** — College admins can only access their own college's data

---

## 8. Real-time Features — Socket.io

### Architecture

The Socket.io server runs on the same HTTP server as Express, handling:

1. **Room-Based Chat** — Users join rooms (e.g., `global_community`, `batch_alpha`) and send/receive messages in real-time
2. **Live Stream Notifications** — Broadcasts `live_stream_started` and `live_stream_ended` events to all connected clients
3. **In-Memory History** — Last 100 messages per room stored in memory for instant history on join

### Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `join_room` | Client → Server | `{ roomId, userId, userName }` | Join a chat room |
| `leave_room` | Client → Server | `{ roomId }` | Leave a chat room |
| `send_message` | Client → Server | `{ roomId, senderId, senderName, senderRole, text }` | Send a message |
| `receive_message` | Server → Client | `ChatMessage` object | Receive a message broadcast |
| `chat_history` | Server → Client | `ChatMessage[]` | Receive room history on join |
| `live_stream_started` | Server → Client | `{ batchId, streamUrl, title, trainerName, startedAt }` | Live class broadcast started |
| `live_stream_ended` | Server → Client | `{ batchId }` | Live class broadcast ended |

### Client Implementations

- **Web Admin**: `LiveChatDrawer.tsx` — Side panel drawer accessible from the top navbar with Socket.io client
- **Mobile App**: `MobileChatDrawer.jsx` — Bottom-sheet drawer accessible from HomeScreen with Socket.io client

---

## 9. Live Streaming — YouTube Low-Latency

### How It Works

1. **Trainer** starts a YouTube Live stream from their YouTube Studio (OBS, Streamyard, etc.)
2. **Trainer** pastes the YouTube Live URL or Video ID into the platform's `LiveStreamModal`
3. **Backend** stores the stream info and broadcasts `live_stream_started` to all connected clients via Socket.io
4. **Students** see an animated "LIVE CLASS BROADCAST IN PROGRESS" banner on their HomeScreen
5. **Students** tap to open `LiveStreamViewerScreen` — embedded YouTube player (low-latency mode) + real-time Q&A chat
6. **Trainer** ends the broadcast — backend broadcasts `live_stream_ended`, banner disappears

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/livestream/start` | Start a live broadcast |
| `POST` | `/api/v1/livestream/stop` | Stop a live broadcast |
| `GET` | `/api/v1/livestream/active` | Get all active live streams |

---

## 10. Reporting & Analytics

### Dashboard Analytics (Real-time)

The Dashboard page aggregates:
- Total students, active batches, placement rate
- Attendance trend charts (weekly/monthly)
- Revenue/enrollment growth curves
- Recent activity feed
- Top-performing students

### Report Exports

| Report Type | Format | Trigger |
|-------------|--------|---------|
| **Attendance Report** | CSV | Download button on Reports page |
| **Executive Summary** | JSON (rendered in UI) | Auto-generated on Reports page load |
| **Email Digest** | HTML Email | Manual trigger button — sends to college admin/principal email |

### Executive Summary Metrics

- Total students (filtered by college if scoped)
- Placed students count & placement percentage
- Total & active batches
- Total sessions with marked attendance
- Average attendance percentage
- Top 5 performing students (by CGPA)

---

## 11. AI-Powered Features

### Mock Interview Evaluator

- **Engine**: Google Gemini 1.5 Flash
- **Input**: Interview question + candidate's answer
- **Output**: Structured JSON evaluation
  - `score`: 0–100 integer
  - `feedback`: 1–2 sentence summary
  - `strengths`: 1–3 specific strengths
  - `improvements`: 1–3 actionable improvement areas
- **Fallback**: Local keyword-based pattern matching when API key is unavailable

### Resume AI Parser

- **Engine**: Google Gemini 1.5 Flash with structured output schema
- **Input**: PDF resume buffer
- **Output**: Extracted skills, CGPA (normalized to 10.0 scale), graduation year, experience summary, education summary
- **Fallback**: Regex-based skill dictionary matching against 40+ tech keywords (JavaScript, TypeScript, Python, Java, React, Node.js, PostgreSQL, Docker, Kubernetes, etc.)

---

## 12. Communication Services

### Email (Resend API)

| Template | Purpose |
|----------|---------|
| **Verification OTP** | 6-digit OTP with branded HTML template, 10-minute expiry |
| **Password Reset OTP** | 6-digit OTP with warning-colored template |
| **Welcome Email** | Temporary password delivery for admin-created accounts |
| **Email Digest** | Executive summary HTML report for college principals |

### WhatsApp (Twilio)

| Message Type | Purpose |
|-------------|---------|
| **OTP** | Verification code delivery via WhatsApp |
| **Attendance Alert** | Warning when student's attendance drops below 75% |
| **Job Alert** | New job matching student's skill profile |

### In-App Notifications

- **Scoped Delivery**: ALL (platform-wide), COLLEGE, BATCH, or INDIVIDUAL
- **Delivery Channels**: In-app (bell icon), email, push notification tracking
- **Read Tracking**: Per-recipient read/unread status with timestamps

---

## 13. File Storage & CDN

### Cloudflare R2 (S3-Compatible)

- **Upload Method**: Presigned URLs — client uploads directly to R2, server never touches the file
- **File Key Pattern**: `{context}/{year}/{month}/{uuid}-{filename}`
- **CDN**: Public URL via Cloudflare CDN for fast global delivery
- **File Types**: Resumes (PDF), profile photos (JPG/PNG), lesson videos (MP4), lesson notes (PDF), offer letters, assignment submissions
- **HLS Streaming**: Automatic `.m3u8` manifest URL generation for adaptive video streaming

---

## 14. Seeded Test Data

The database seed script creates the following test data:

| Entity | Details |
|--------|---------|
| **Super Admin** | `superadmin@kodetocareer.com` / `Password123!` — Full platform access |
| **College Admin** | `collegeadmin@kodetocareer.com` / `Password123!` — KTC Engineering Institute |
| **Trainer** | `trainer@kodetocareer.com` / `Password123!` — Jane Smith (TypeScript, React, Node.js) |
| **Student** | `student@kodetocareer.com` / `Password123!` — Alice Johnson (KTC-2026-00001, CSE, 8.5 CGPA) |
| **College** | KTC Engineering Institute (Code: `KTC-EI-001`, Mumbai, Maharashtra) |
| **Course** | Full Stack Web Development (120 hours, Beginner, 2 modules, 1 lesson) |
| **Batch** | FS-A-2026 — Hybrid mode, Mon/Wed/Fri 10AM–12PM, Jul–Dec 2026 |

---

## 15. Build & Verification Status

| Project | Command | Status | Output |
|---------|---------|--------|--------|
| **Backend API** | `npm run typecheck` (`tsc --noEmit`) | ✅ PASS | 0 errors |
| **Frontend Web Admin** | `npm run build` (`tsc -b && vite build`) | ✅ PASS | 0 errors |
| **Mobile Student App** | `npm run build` (`vite build`) | ✅ PASS | 0 errors |

---

## 16. Future Improvements

### 🔴 High Priority — Core Platform

| # | Feature | Description |
|---|---------|-------------|
| 1 | **FCM Push Notifications** | Integrate Firebase Cloud Messaging for native push notifications on mobile. Currently notifications are in-app only; FCM would deliver alerts even when the app is closed (new quiz, attendance reminder, job alert). |
| 2 | **Full Offline Mode with IndexedDB** | Replace localStorage-based caching with IndexedDB for structured offline data storage. Enable students to view cached course content, complete quizzes, and submit answers offline — auto-sync when network returns. |
| 3 | **Video Transcoding Pipeline** | Build a serverless video processing pipeline (e.g., AWS MediaConvert or Cloudflare Stream) to auto-transcode uploaded videos into HLS adaptive bitrate streams (.m3u8 + segments) for smooth playback on varying network speeds. |
| 4 | **Real Database-Backed Chat** | Persist Socket.io chat messages to PostgreSQL instead of in-memory storage. Add message search, media sharing (images, PDFs), message reactions, and threaded replies. |
| 5 | **Role-Specific Mobile Apps** | Build separate Trainer and College Admin mobile apps (or multi-role support in the existing app) so trainers can mark attendance and manage classes from their phones. |

### 🟡 Medium Priority — Feature Enhancements

| # | Feature | Description |
|---|---------|-------------|
| 6 | **Automated PDF/Excel Report Generation** | Implement scheduled weekly/monthly report generation using PDFKit for PDF reports and a library like `exceljs` for Excel exports. Auto-email to college admins/principals on a configurable schedule. |
| 7 | **Discussion Forums / Q&A Board** | Add a per-course or per-batch discussion forum where students can ask questions, trainers can answer, and peers can upvote — similar to Stack Overflow. |
| 8 | **Assignment Plagiarism Detection** | Integrate a plagiarism detection service (e.g., Turnitin API or open-source `plagiarism-checker`) to automatically check text submissions for originality. |
| 9 | **Calendar Integration** | Add Google Calendar / Outlook sync for class sessions, quiz deadlines, and placement interviews. Students and trainers get calendar invites for upcoming events. |
| 10 | **Multi-Language / i18n Support** | Add internationalization using `react-i18next` for Hindi, regional languages, and English — supporting diverse college demographics across India. |
| 11 | **Dark Mode Toggle (Web Admin)** | The mobile app already has a dark theme. Add a system-level / manual dark mode toggle to the web admin dashboard. |
| 12 | **Gamification & Leaderboards** | Add XP points for completing lessons, quizzes, and assignments. Implement leaderboards (batch-level and college-level) with badges and achievements. |
| 13 | **Video Conferencing Integration** | Integrate with Jitsi Meet or Google Meet API for built-in video conferencing without needing external YouTube Live. One-click "Start Class" that generates a meeting room. |
| 14 | **Parent/Guardian Portal** | A read-only portal for parents to track their child's attendance, quiz scores, and placement status. Auto-sends weekly progress SMS/WhatsApp reports. |

### 🟢 Lower Priority — Nice to Have

| # | Feature | Description |
|---|---------|-------------|
| 15 | **AI-Powered Study Recommendations** | Use Gemini to analyze a student's quiz performance, completion history, and weak areas to recommend specific lessons, practice quizzes, or study materials. |
| 16 | **Interactive Code Playground** | Embed an in-browser code editor (Monaco Editor / CodeMirror) for coding lessons and assignments. Auto-test submissions against predefined test cases. |
| 17 | **Batch Scheduling AI** | Auto-suggest optimal batch schedules based on trainer availability, student preferences, room capacity, and conflict detection across colleges. |
| 18 | **Advanced Analytics Dashboard** | Implement Retention Rate analysis, Cohort Analysis (batch vs. batch comparison), Funnel Analysis (enrollment → completion → placement), and predictive placement probability using ML. |
| 19 | **WhatsApp Bot (Conversational)** | Beyond alert messages, implement a WhatsApp chatbot that allows students to query their attendance percentage, upcoming quiz schedule, or assignment deadlines via text commands. |
| 20 | **Two-Factor Authentication (TOTP)** | Add Google Authenticator / Authy support using TOTP (Time-based One-Time Password) as an alternative to email OTP for stronger admin security. |
| 21 | **SSO / OAuth Login** | Add "Sign in with Google" and "Sign in with Microsoft" OAuth integration for seamless college account linking. |
| 22 | **Bulk Certificate ZIP Download** | Allow admins to generate and download all certificates for a batch as a single ZIP archive instead of one-by-one. |
| 23 | **Student Portfolio Builder** | A public-facing portfolio page per student showcasing completed courses, certificates, skills, and projects — shareable URL for recruiters. |
| 24 | **API Rate Limiting Dashboard** | An admin panel to view and configure rate limits, see blocked IPs, and manage API usage quotas per college. |
| 25 | **Webhook System** | Allow colleges to register webhooks for events like "student placed", "quiz completed", "attendance below threshold" for integration with their existing systems. |
| 26 | **Custom Notification Templates** | Let admins create and manage email/WhatsApp notification templates with variable substitution (student name, course name, etc.) instead of hardcoded templates. |
| 27 | **Batch-Level Resource Library** | A shared file repository per batch where trainers upload reference materials (slides, code samples, reading lists) and students can download them. |
| 28 | **Trainer Performance Analytics** | Track and visualize trainer effectiveness metrics: student satisfaction ratings, average quiz scores of their students, attendance rates, course completion rates. |
| 29 | **Mobile App Widgets** | iOS/Android home screen widgets showing next class time, attendance percentage, and assignment deadline countdown using Capacitor plugins. |
| 30 | **Accessibility (a11y) Audit** | Full WCAG 2.1 AA compliance audit and remediation across web admin and mobile app — screen reader support, keyboard navigation, focus management, color contrast, ARIA labels. |

### 🛠️ DevOps & Infrastructure

| # | Feature | Description |
|---|---------|-------------|
| 31 | **CI/CD Pipeline** | Set up GitHub Actions / GitLab CI for automated testing, linting, type-checking, and deployment on push. Include build status badges in README. |
| 32 | **Docker Compose** | Create `docker-compose.yml` for single-command local development setup including PostgreSQL, Redis, and the Express backend. |
| 33 | **Environment-Based Configuration** | Implement proper `.env.development`, `.env.staging`, `.env.production` files with deployment-specific variables and secrets management. |
| 34 | **Database Backup & Restore** | Automated daily PostgreSQL backups to Cloudflare R2 or S3, with one-click restore for disaster recovery. |
| 35 | **Health Check Dashboard** | Implement `/health/detailed` endpoint showing database status, Redis status, queue length, active sockets, memory usage — with a simple admin dashboard. |
| 36 | **End-to-End Testing** | Add Playwright E2E tests for critical user flows: login, student enrollment, quiz attempt, certificate generation, placement recording. |

---

> **Note**: This document reflects the state of the project as of July 21, 2026. All features listed in sections 1–15 are implemented, type-checked, and production-build verified. The Future Improvements section (§16) contains proposed enhancements organized by priority.
