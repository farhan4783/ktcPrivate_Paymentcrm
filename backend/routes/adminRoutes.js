const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  approveUser, 
  rejectUser, 
  createUser, 
  updateUser, 
  deleteUser, 
  resetUserPassword 
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All admin routes are protected and admin-only
router.use(protect);
router.use(adminOnly);

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/reset-password', resetUserPassword);
router.put('/approve/:id', approveUser);
router.put('/reject/:id', rejectUser);

module.exports = router;
