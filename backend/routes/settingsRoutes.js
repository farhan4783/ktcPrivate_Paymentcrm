const express = require('express');
const router = express.Router();
const { protect, adminOnly, viewerAccess } = require('../middleware/authMiddleware');
const { getSettings, updateSettings } = require('../controllers/settingsController');

router.get('/', protect, viewerAccess, getSettings);
router.put('/', protect, adminOnly, updateSettings);

module.exports = router;
