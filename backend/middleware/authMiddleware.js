const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User no longer exists' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access only' });
  }
};

// Staff and admin can read AND write
const staffAccess = (req, res, next) => {
  if (req.user && (req.user.role === 'staff' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Staff access only' });
  }
};

// Viewer, staff, and admin can read (viewer is read-only)
const viewerAccess = (req, res, next) => {
  if (req.user && (req.user.role === 'viewer' || req.user.role === 'staff' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
};

module.exports = { protect, adminOnly, staffAccess, viewerAccess };
