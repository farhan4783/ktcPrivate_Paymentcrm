# PaymentCRM Backend API

A robust Node.js and Express backend for managing student enrollments, payments, and receipt generation. This server provides a secure RESTful API for the PaymentCRM ecosystem.

## 🚀 Key Features

### 👤 Student Management
- **Centralized Profiles**: Store and manage detailed student information.
- **Multi-Enrollment Support**: Ability for a single student to enroll in multiple courses simultaneously.
- **Dynamic Tracking**: Monitor enrollment status and historical data.

### 💰 Financial Management
- **Payment Processing**: Record and track student payments with precision.
- **Transaction History**: Comprehensive logs of all financial transactions.
- **Due Tracking**: Automated tracking of pending balances for specific enrollments.

### 📄 Receipt System
- **Dynamic Generation**: Automatically generate professional receipts for every transaction.
- **Historical Access**: Retrieve and view past receipts at any time.
- **Unique Identification**: Each receipt is assigned a unique tracking ID.

### 📊 Analytics & Dashboard
- **Real-time Statistics**: Aggregated data for total revenue, active students, and pending payments.
- **Data-Driven Insights**: Endpoint for fetching dashboard-ready metrics.

### 🔐 Security & Authentication
- **JWT Authentication**: Secure API access using JSON Web Tokens.
- **Password Encryption**: Industry-standard hashing using Bcryptjs.
- **Password Recovery**: Integrated "Forgot Password" flow with secure email tokens.
- **Protected Routes**: Middleware-driven access control to sensitive data.

### 🛠️ Admin & Moderation
- **User Approval**: Review and approve/reject new staff or user registrations.
- **Access Control**: Manage system access with granular role-based permissions (Admin Only routes).

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js (v5.x)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Bcryptjs
- **Logging**: Morgan
- **Email Service**: Nodemailer

## 📂 Project Structure

```text
backend/
├── controllers/      # Business logic for API endpoints
├── middleware/       # Custom middleware (auth, error handling)
├── models/           # Mongoose schemas for MongoDB
├── routes/           # API route definitions
├── server.js         # Application entry point
└── createAdmin.js    # Utility script for admin initialization
```

## ⚙️ Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` root and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

3. **Initialize Admin (Optional)**:
   ```bash
   node createAdmin.js
   ```

4. **Run the Server**:
   - **Development**: `npm run dev` (uses nodemon)
   - **Production**: `npm start`

## 📡 API Endpoints (Quick Reference)

| Category | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth/login` | POST | Authenticate user & get token |
| **Auth** | `/api/auth/me` | GET | Get current user profile |
| **Students** | `/api/students` | GET/POST | List or create students |
| **Students** | `/api/students/:id/enroll` | POST | Add course enrollment |
| **Payments** | `/api/payments` | POST | Record a new payment |
| **Receipts** | `/api/receipts/generate` | POST | Create a new receipt |
| **Dashboard** | `/api/dashboard/stats` | GET | Fetch analytics overview |

---
*Built with ❤️ for KodeToCareer.*
