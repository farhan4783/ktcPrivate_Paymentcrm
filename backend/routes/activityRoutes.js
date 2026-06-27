const express = require('express');
const router = express.Router();
const { protect, staffAccess, viewerAccess } = require('../middleware/authMiddleware');
const { addNote, getActivities } = require('../controllers/activityController');

// Anyone authenticated (viewer, staff, admin) can get activities
router.get('/:studentId', protect, viewerAccess, getActivities);

// Only staff and admin can write/add notes
router.post('/:studentId', protect, staffAccess, addNote);

module.exports = router;
