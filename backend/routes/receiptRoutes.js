const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getReceipts, getReceiptById, generateReceipt } = require('../controllers/receiptController');

router.get('/', protect, getReceipts);
router.post('/generate', protect, generateReceipt);
router.get('/:id', protect, getReceiptById);

module.exports = router;
