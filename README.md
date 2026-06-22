# PaymentCRM

PaymentCRM is a full-stack student payment management system with a React frontend and an Express/MongoDB backend. It is built to manage student profiles, course enrollments, payments, receipts, dashboard analytics, and administrative user approval.

## 🧩 Project Structure

- `backend/` — Node.js + Express API server
- `frontend/` — React + Vite user interface

## 🚀 Core Features

### Backend Features
- Student management with detailed profiles and multi-course enrollments
- Payment processing and financial transaction tracking
- Receipt generation and retrieval with unique receipt IDs
- Dashboard analytics for revenue, active students, and pending payments
- JWT authentication and protected routes
- Password hashing and secure login
- Password reset support via email tokens
- Admin user approval and role-based access control

### Frontend Features
- Modern dashboard with charts and data metrics
- Student CRM interface with search and profile views
- Payment entry and balance management
- Receipt preview and PDF generation
- QR code support for receipts
- Admin panel for user registration approval
- Responsive UI styled with Tailwind CSS and animated transitions
- React Router protection for authenticated pages

## 🛠️ Technology Stack

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT authentication
- Bcryptjs
- Nodemailer
- Helmet, CORS, Morgan

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router Dom
- React Hook Form
- Chart.js
- Recharts
- JSPDF + HTML2Canvas
- Framer Motion

## 📁 Notable Files

- `backend/server.js` — API entry point
- `backend/controllers/` — request handlers for auth, students, payments, receipts, dashboard
- `backend/models/` — MongoDB schema definitions
- `backend/routes/` — API route definitions
- `frontend/src/App.jsx` — main React app container
- `frontend/src/pages/` — app pages like Dashboard, Payments, Students, ReceiptGenerator
- `frontend/src/services/api.js` — API request helper
- `frontend/src/context/AuthContext.jsx` — authentication state management

## ⚙️ Setup

### Backend
1. `cd backend`
2. `npm install`
3. Create `.env` with values like:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```
4. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. Create `.env` with:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. `npm run dev`

## 📌 Summary

PaymentCRM connects a secure backend API with a polished React dashboard to support enrollment tracking, payment intake, receipt creation, and administrative oversight. It is designed for educational or training organizations that need a compact CRM-like payment management solution.
