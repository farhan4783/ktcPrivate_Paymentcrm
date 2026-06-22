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
};

export const paymentAPI = {
  createPayment: (data) => API.post('/payments', data),
  getPayments: (studentId) => API.get(`/payments/${studentId}`),
};

export const receiptAPI = {
  getReceipts: () => API.get('/receipts'),
  getReceiptById: (id) => API.get(`/receipts/${id}`),
};

export default API;
