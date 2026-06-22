const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createPayment, getPaymentsByStudent } = require('../controllers/paymentController');

router.post('/', protect, createPayment);
router.get('/:studentId', protect, getPaymentsByStudent);

module.exports = router;
