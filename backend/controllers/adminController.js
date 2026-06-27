const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get all users (with optional status filter)
exports.getAllUsers = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve a pending user
exports.approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { status: 'APPROVED' }, 
      { new: true, runValidators: false }
    );
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User approved successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject a pending user
exports.rejectUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { status: 'REJECTED' }, 
      { new: true, runValidators: false }
    );
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User rejected', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin creates a new user directly (auto-approved)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'staff',
      status: 'APPROVED' // Admin-created users are auto-approved
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin updates a user's details (name, email, role, status)
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent admin from demoting themselves
    if (user._id.toString() === req.user._id.toString() && role && role !== 'admin') {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (status) user.status = status;

    await user.save({ validateModifiedOnly: true });

    res.json({
      message: 'User updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin deletes a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin resets a user's password
exports.resetUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword; // Pre-save hook will hash it
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
