import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';
import Payments from '../pages/Payments';
import StudentProfile from '../pages/StudentProfile';
import ReceiptPreview from '../components/ui/ReceiptPreview';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import AdminUserManagement from '../pages/AdminUserManagement';
import Reports from '../pages/Reports';
import ProtectedRoute from './ProtectedRoute';

import ReceiptGenerator from '../pages/ReceiptGenerator';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentProfile />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/receipts" element={<ReceiptGenerator />} />
          <Route path="/reports" element={<Reports />} />
          
          {/* Admin Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/users" element={<AdminUserManagement />} />
          </Route>
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
