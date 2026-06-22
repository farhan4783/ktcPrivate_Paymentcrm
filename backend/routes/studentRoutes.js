const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createStudent, getStudents, getStudentById, addEnrollment } = require('../controllers/studentController');

router.post('/', protect, createStudent);
router.get('/', protect, getStudents);
router.get('/:id', protect, getStudentById);
router.post('/:id/enroll', protect, addEnrollment);

module.exports = router;
