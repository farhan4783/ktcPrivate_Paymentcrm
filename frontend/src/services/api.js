import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
};

export const studentAPI = {
  getStudents: () => API.get('/students'),
  getStudentById: (id) => API.get(`/students/${id}`),
  createStudent: (data) => API.post('/students', data),
  updateStudent: (id, data) => API.put(`/students/${id}`, data),
  deleteStudent: (id) => API.delete(`/students/${id}`),
  bulkDeleteStudents: (studentIds) => API.post('/students/bulk-delete', { studentIds }),
  bulkAddTags: (studentIds, tags) => API.post('/students/bulk-tag', { studentIds, tags }),
};

export const enrollmentAPI = {
  addEnrollment: (studentId, data) => API.post(`/students/${studentId}/enroll`, data),
  updateEnrollment: (studentId, enrollmentId, data) => API.put(`/students/${studentId}/enrollments/${enrollmentId}`, data),
  deleteEnrollment: (studentId, enrollmentId) => API.delete(`/students/${studentId}/enrollments/${enrollmentId}`),
};

export const paymentAPI = {
  createPayment: (data) => API.post('/payments', data),
  getPayments: (studentId) => API.get(`/payments/${studentId}`),
  updatePayment: (studentId, paymentId, data) => API.put(`/students/${studentId}/payments/${paymentId}`, data),
  deletePayment: (studentId, paymentId) => API.delete(`/students/${studentId}/payments/${paymentId}`),
};

export const receiptAPI = {
  getReceipts: () => API.get('/receipts'),
  getReceiptById: (id) => API.get(`/receipts/${id}`),
};

export const adminAPI = {
  getUsers: (status) => API.get(`/admin/users${status ? `?status=${status}` : ''}`),
  createUser: (data) => API.post('/admin/users', data),
  updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  resetPassword: (id, data) => API.put(`/admin/users/${id}/reset-password`, data),
  approveUser: (id) => API.put(`/admin/approve/${id}`, {}),
  rejectUser: (id) => API.put(`/admin/reject/${id}`, {}),
};

export const activityAPI = {
  getActivities: (studentId) => API.get(`/activities/${studentId}`),
  addNote: (studentId, data) => API.post(`/activities/${studentId}`, data),
};

export const exportAPI = {
  exportStudents: () => API.get('/export/students', { responseType: 'blob' }),
  exportPayments: () => API.get('/export/payments', { responseType: 'blob' }),
  exportReceipts: () => API.get('/export/receipts', { responseType: 'blob' }),
};

export const settingsAPI = {
  getSettings: () => API.get('/settings'),
  updateSettings: (data) => API.put('/settings', data),
};

export default API;
