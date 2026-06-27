const express = require('express');
const router = express.Router();
const { protect, staffAccess } = require('../middleware/authMiddleware');
const { createPayment, getPaymentsByStudent } = require('../controllers/paymentController');

// Read — all authenticated users
router.get('/:studentId', protect, getPaymentsByStudent);

// Write — staff/admin only
router.post('/', protect, staffAccess, createPayment);

module.exports = router;
