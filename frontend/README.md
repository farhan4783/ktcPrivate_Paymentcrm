# PaymentCRM Frontend

A professional, high-density React application designed for educational institutions to manage student enrollments, track payments, and generate digital receipts. Built with a focus on speed, aesthetics, and operational efficiency.

## ✨ Key Features

### 📊 Modern Analytics Dashboard
- **Visual Insights**: Real-time charts and metrics powered by Chart.js.
- **Financial Overview**: Instant snapshots of revenue, pending payments, and student counts.
- **Activity Feed**: Track recent transactions and system updates at a glance.

### 🎓 Advanced Student Management
- **High-Density CRM**: Manage student records with ease through a professional, searchable table interface.
- **Multi-Course Profiles**: Support for students enrolled in multiple courses simultaneously.
- **Lifecycle Tracking**: Monitor enrollment statuses, course durations, and historical records.

### 💸 Payment & Receipt System
- **Streamlined Recording**: Efficient interface for logging new payments and updating balances.
- **PDF Generation**: One-click generation of professional PDF receipts using `jspdf` and `html2canvas`.
- **QR Code Integration**: Automated QR code generation for digital receipt verification.
- **Receipt History**: Browse and regenerate past receipts effortlessly.

### 🛡️ Admin & Moderation Suite
- **User Management**: Approve or reject new staff registrations via a dedicated admin portal.
- **Role-Based Access**: Secure dashboard navigation based on user permissions.
- **Settings Configuration**: Customize system behavior and profile settings.

### 🎨 Premium UI/UX
- **High-Density Design**: Optimized for zero-scroll interfaces and maximum data visibility.
- **Smooth Animations**: Interactive elements enhanced with Framer Motion.
- **Responsive Layout**: Fully adaptive design for desktop, tablet, and mobile browsers.
- **Modern Styling**: Built with Tailwind CSS for a sleek, corporate aesthetic.

## 🛠️ Technology Stack

- **Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Chart.js](https://www.chartjs.org/) & [Recharts](https://recharts.org/)
- **State Management**: React Context API
- **Forms**: React Hook Form
- **Routing**: React Router Dom v6

## 📂 Project Structure

```text
frontend/
├── src/
│   ├── components/    # Reusable UI components (Buttons, Cards, Inputs)
│   ├── context/       # Global state (Auth, Data context)
│   ├── layouts/       # Main application layouts (Sidebar, Navbar)
│   ├── pages/         # View components (Dashboard, Payments, Students)
│   ├── routes/        # Navigation and route protection logic
│   ├── services/      # API communication logic (Axios)
│   └── utils/         # Helper functions (Formatters, PDF generators)
└── public/            # Static assets
```

## ⚙️ Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file in the `frontend/` root:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

---
*Developed with precision for KodeToCareer.*
