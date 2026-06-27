const express = require('express');
const router = express.Router();
const { protect, staffAccess } = require('../middleware/authMiddleware');
const { 
  createStudent, 
  getStudents, 
  getStudentById, 
  addEnrollment,
  updateStudent,
  deleteStudent,
  updateEnrollment,
  deleteEnrollment,
  updatePayment,
  deletePayment,
  bulkDeleteStudents,
  bulkAddTags
} = require('../controllers/studentController');

// Read routes — all authenticated users (including viewer)
router.get('/', protect, getStudents);

// Bulk write routes (Staff/Admin only) - MUST go before /:id to prevent matching "bulk-delete" as an id
router.post('/bulk-delete', protect, staffAccess, bulkDeleteStudents);
router.post('/bulk-tag', protect, staffAccess, bulkAddTags);

router.get('/:id', protect, getStudentById);

// Write routes — staff and admin only (viewer cannot modify)
router.post('/', protect, staffAccess, createStudent);
router.put('/:id', protect, staffAccess, updateStudent);
router.delete('/:id', protect, staffAccess, deleteStudent);

// Enrollment routes
router.post('/:id/enroll', protect, staffAccess, addEnrollment);
router.put('/:id/enrollments/:enrollmentId', protect, staffAccess, updateEnrollment);
router.delete('/:id/enrollments/:enrollmentId', protect, staffAccess, deleteEnrollment);

// Payment edit/delete routes (nested under student for clarity)
router.put('/:id/payments/:paymentId', protect, staffAccess, updatePayment);
router.delete('/:id/payments/:paymentId', protect, staffAccess, deletePayment);

module.exports = router;
