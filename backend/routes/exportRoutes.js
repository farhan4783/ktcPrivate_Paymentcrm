const express = require('express');
const router = express.Router();
const { protect, viewerAccess } = require('../middleware/authMiddleware');
const { exportStudents, exportPayments, exportReceipts } = require('../controllers/exportController');

router.get('/students', protect, viewerAccess, exportStudents);
router.get('/payments', protect, viewerAccess, exportPayments);
router.get('/receipts', protect, viewerAccess, exportReceipts);

module.exports = router;
